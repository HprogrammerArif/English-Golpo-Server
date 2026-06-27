import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LearningPath } from '@prisma/client';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsIn, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetVideosDto {
  @ApiPropertyOptional() @IsOptional() @IsString() path?: LearningPath;
  @ApiPropertyOptional() @IsOptional() @IsNumber() level?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() limit?: number;
}

export class TrackVideoProgressDto {
  @ApiProperty() @IsString() videoId: string;
  @ApiProperty() @IsNumber() @Min(0) watchedSeconds: number;
  @ApiProperty() @IsBoolean() completed: boolean;
}

@Injectable()
export class VideoService {
  constructor(private readonly prisma: PrismaService) {}

  async getVideos(dto: GetVideosDto) {
    const { path, level, page = 1, limit = 20 } = dto;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (path) where.learningPath = path;
    if (level) where.level = level;

    const [videos, total] = await this.prisma.$transaction([
      this.prisma.videoLesson.findMany({
        where,
        orderBy: [{ level: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.videoLesson.count({ where }),
    ]);

    return {
      videos,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getVideoById(id: string) {
    const video = await this.prisma.videoLesson.findUnique({ where: { id } });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async getUserVideoProgress(userId: string) {
    return this.prisma.videoProgress.findMany({
      where: { userId },
      include: { video: { select: { id: true, title: true, titleBn: true, thumbnailUrl: true, durationSeconds: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async trackProgress(userId: string, dto: TrackVideoProgressDto) {
    const video = await this.prisma.videoLesson.findUnique({ where: { id: dto.videoId } });
    if (!video) throw new NotFoundException('Video not found');

    const xpReward = dto.completed ? 15 : 0;

    const progress = await this.prisma.videoProgress.upsert({
      where: { userId_videoId: { userId, videoId: dto.videoId } },
      create: {
        userId,
        videoId: dto.videoId,
        watchedSeconds: dto.watchedSeconds,
        completed: dto.completed,
        xpEarned: xpReward,
      },
      update: {
        watchedSeconds: Math.max(dto.watchedSeconds, 0),
        completed: dto.completed,
        xpEarned: dto.completed ? xpReward : 0,
      },
    });

    // Award XP on first completion
    if (dto.completed && xpReward > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { xpTotal: { increment: xpReward } },
      });
    }

    return progress;
  }
}
