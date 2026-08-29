import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LinkChildDto {
  @ApiProperty({ description: 'Phone number of child account to link' })
  @IsString()
  childPhone: string;
}

export class ConfirmLinkChildDto {
  @ApiProperty({ description: 'Phone number of child account to link' })
  @IsString()
  childPhone: string;

  @ApiProperty({ description: "Verification code sent to the child's phone" })
  @IsString()
  code: string;
}

export class ProvisionB2BDto {
  @ApiProperty() @IsString() organizationName: string;
  @ApiProperty({
    enum: ['SCHOOL', 'COACHING_CENTER', 'MADRASA', 'FAMILY', 'CORPORATE'],
  })
  @IsString()
  type: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() licenseCount?: number;
  @ApiPropertyOptional() @IsOptional() contactPhone?: string;
}

@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async getParentDashboard(parentId: string) {
    const parent = await this.prisma.user.findUnique({
      where: { id: parentId },
      include: {
        children: {
          select: {
            id: true,
            name: true,
            learningPath: true,
            xpTotal: true,
            streak: { select: { currentStreak: true } },
            dailyGoals: {
              where: {
                date: {
                  gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                },
              },
              select: { date: true, earnedXp: true, completed: true },
            },
            _count: { select: { progress: true, bookmarks: true } },
          },
        },
      },
    });

    return {
      children:
        parent?.children.map((child) => ({
          id: child.id,
          name: child.name,
          learningPath: child.learningPath,
          xpTotal: child.xpTotal,
          level: Math.floor((child.xpTotal || 0) / 100) + 1,
          streak: child.streak?.currentStreak || 0,
          weeklyXp: child.dailyGoals.reduce((sum, g) => sum + g.earnedXp, 0),
          storiesCompleted: child._count.progress,
          wordsBookmarked: child._count.bookmarks,
          weeklyActivity: child.dailyGoals,
        })) || [],
    };
  }

  // Linking requires the requester to prove they have access to the child's
  // phone via a verification code — prevents silently claiming any account.
  async requestLinkChild(parentId: string, dto: LinkChildDto) {
    const child = await this.prisma.user.findUnique({
      where: { phone: dto.childPhone },
    });
    if (!child) throw new NotFoundException('Child account not found');
    if (child.id === parentId)
      throw new BadRequestException(
        'You cannot link your own account as a child',
      );

    const mockEnabled = this.config.get<string>('OTP_MOCK_ENABLED') === 'true';
    const code = mockEnabled
      ? this.config.get<string>('OTP_MOCK_CODE', '1234')
      : this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.otpRequest.updateMany({
      where: { phone: dto.childPhone, purpose: 'CHILD_LINK', verified: false },
      data: { verified: true },
    });
    await this.prisma.otpRequest.create({
      data: { phone: dto.childPhone, code, expiresAt, purpose: 'CHILD_LINK' },
    });

    if (mockEnabled)
      this.logger.warn(`[DEV] Child-link code for ${dto.childPhone}: ${code}`);

    return {
      message:
        "A verification code was sent to the child's phone. Ask them to share it with you to confirm the link.",
      expiresIn: 300,
      ...(mockEnabled && { devCode: code }),
    };
  }

  async confirmLinkChild(parentId: string, dto: ConfirmLinkChildDto) {
    const mockEnabled = this.config.get<string>('OTP_MOCK_ENABLED') === 'true';
    const mockCode = this.config.get<string>('OTP_MOCK_CODE', '1234');

    const otpRecord = await this.prisma.otpRequest.findFirst({
      where: {
        phone: dto.childPhone,
        purpose: 'CHILD_LINK',
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    const isMockValid = mockEnabled && dto.code === mockCode;
    if (!isMockValid && (!otpRecord || otpRecord.code !== dto.code)) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }
    if (otpRecord) {
      await this.prisma.otpRequest.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
    }

    const child = await this.prisma.user.findUnique({
      where: { phone: dto.childPhone },
    });
    if (!child) throw new NotFoundException('Child account not found');

    await this.prisma.user.update({
      where: { id: child.id },
      data: { parentId },
    });

    return { linked: true, childName: child.name };
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async provisionB2B(adminId: string, dto: ProvisionB2BDto) {
    return this.prisma.b2BOrganization.create({
      data: {
        adminId,
        name: dto.organizationName,
        type: dto.type,
        licenseCount: dto.licenseCount || 25,
        contactPhone: dto.contactPhone,
      },
    });
  }

  async getB2BDashboard(adminId: string) {
    const org = await this.prisma.b2BOrganization.findUnique({
      where: { adminId },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            xpTotal: true,
            learningPath: true,
            streak: { select: { currentStreak: true } },
            _count: { select: { progress: true } },
          },
          orderBy: { xpTotal: 'desc' },
        },
      },
    });

    if (!org) return { organization: null };

    return {
      organization: {
        name: org.name,
        type: org.type,
        licenseCount: org.licenseCount,
        usedSeats: org.members.length,
        availableSeats: org.licenseCount - org.members.length,
        contractEnd: org.contractEnd,
      },
      members: org.members.map((m, idx) => ({
        rank: idx + 1,
        id: m.id,
        name: m.name,
        xpTotal: m.xpTotal,
        level: Math.floor((m.xpTotal || 0) / 100) + 1,
        streak: m.streak?.currentStreak || 0,
        storiesCompleted: m._count.progress,
        learningPath: m.learningPath,
      })),
    };
  }
}
