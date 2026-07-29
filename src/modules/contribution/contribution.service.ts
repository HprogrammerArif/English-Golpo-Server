import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsOptional } from 'class-validator';

export class SubmitContributionDto {
  @IsString()
  contentType: string; // 'VIDEO' | 'AUDIO' | 'ILLUSTRATION'

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  fileUrl: string;

  @IsString()
  @IsOptional()
  targetChildId?: string;
}

@Injectable()
export class ContributionService {
  constructor(private readonly prisma: PrismaService) {}

  async submitContribution(userId: string, dto: SubmitContributionDto) {
    if (dto.contentType === 'VIDEO' && dto.targetChildId) {
      const child = await this.prisma.user.findUnique({
        where: { id: dto.targetChildId },
      });
      if (!child) {
        throw new NotFoundException('Target child user not found');
      }
    }

    // Public contributions earn money, private family ones are NOT_APPLICABLE
    const initialPayoutStatus = dto.contentType === 'VIDEO' && dto.targetChildId ? 'NOT_APPLICABLE' : 'UNPAID';

    return this.prisma.contribution.create({
      data: {
        contributorId: userId,
        contentType: dto.contentType,
        title: dto.title,
        description: dto.description,
        fileUrl: dto.fileUrl,
        targetChildId: dto.targetChildId,
        payoutStatus: initialPayoutStatus,
      },
    });
  }

  async getMyContributions(userId: string) {
    return this.prisma.contribution.findMany({
      where: { contributorId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
