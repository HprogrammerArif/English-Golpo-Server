import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() avatarUrl?: string;
  @ApiPropertyOptional({ enum: ['KIDS','SPOKEN','IELTS','ADMISSION','JOB','VOCAB'] })
  @IsOptional() @IsIn(['KIDS','SPOKEN','IELTS','ADMISSION','JOB','VOCAB'])
  learningPath?: string;
  @ApiPropertyOptional() @IsOptional() whatsappOptIn?: boolean;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true, avatarUrl: true,
        role: true, learningPath: true, lives: true, gems: true, league: true,
        xpTotal: true, whatsappOptIn: true, createdAt: true,
        streak: true,
        subscriptions: {
          where: { status: 'ACTIVE' },
          orderBy: { expiryDate: 'desc' },
          take: 1,
          select: { planType: true, expiryDate: true, gateway: true },
        },
        _count: { select: { bookmarks: true, progress: true } },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const activeSubscription = user.subscriptions[0] || null;
    const level = Math.floor((user.xpTotal || 0) / 100) + 1;

    return { ...user, level, activeSubscription };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
        ...(dto.learningPath && { learningPath: dto.learningPath as any }),
        ...(dto.whatsappOptIn !== undefined && { whatsappOptIn: dto.whatsappOptIn }),
      },
      select: {
        id: true, name: true, avatarUrl: true, learningPath: true, whatsappOptIn: true,
      },
    });
  }
}
