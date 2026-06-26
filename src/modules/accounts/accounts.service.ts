import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LinkChildDto {
  @ApiProperty({ description: 'Phone number of child account to link' })
  @IsString() childPhone: string;
}

export class ProvisionB2BDto {
  @ApiProperty() @IsString() organizationName: string;
  @ApiProperty({ enum: ['SCHOOL','COACHING_CENTER','MADRASA','FAMILY','CORPORATE'] })
  @IsString() type: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() licenseCount?: number;
  @ApiPropertyOptional() @IsOptional() contactPhone?: string;
}

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

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
      children: parent?.children.map((child) => ({
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

  async linkChild(parentId: string, dto: LinkChildDto) {
    const child = await this.prisma.user.findUnique({ where: { phone: dto.childPhone } });
    if (!child) throw new Error('Child account not found');

    await this.prisma.user.update({
      where: { id: child.id },
      data: { parentId },
    });

    return { linked: true, childName: child.name };
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
