import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RedeemReferralDto {
  @ApiProperty({ description: 'Referral code from deep link' })
  @IsString() code: string;
}

export class TrackEventDto {
  @ApiProperty() @IsString() event: string;
  @ApiPropertyOptional() @IsOptional() properties?: Record<string, any>;
}

@Injectable()
export class GrowthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generateReferralLink(userId: string) {
    const baseUrl = this.config.get('BACKEND_URL');
    const code = userId.slice(0, 8).toUpperCase();
    return {
      code,
      deepLink: `engolpo://referral/${code}`,
      shareUrl: `${baseUrl}/join/${code}`,
      message: `ইংলিশ গল্প অ্যাপে জয়েন করো! আমার লিংক দিয়ে সাইন আপ করলে তুমি ৭ দিন ফ্রি Premium পাবে 🎉 ${baseUrl}/join/${code}`,
      referralLink: `${baseUrl}/join/${code}`, // for RN compatibility
      shareMessage: `ইংলিশ গল্প অ্যাপে জয়েন করো! আমার লিংক দিয়ে সাইন আপ করলে তুমি ৭ দিন ফ্রি Premium পাবে 🎉 ${baseUrl}/join/${code}`, // for RN compatibility
    };
  }

  async redeemReferral(refereeId: string, code: string) {
    // Find referrer by code (first 8 chars of their ID)
    const referrer = await this.prisma.user.findFirst({
      where: { id: { startsWith: code.toLowerCase() } },
    });

    if (!referrer || referrer.id === refereeId) {
      return { success: false, reason: 'Invalid referral code' };
    }

    const existing = await this.prisma.referral.findUnique({
      where: { referrerId_refereeId: { referrerId: referrer.id, refereeId } },
    });
    if (existing) return { success: false, reason: 'Already redeemed' };

    // Create referral record
    await this.prisma.referral.create({
      data: { referrerId: referrer.id, refereeId, status: 'COMPLETED', rewardGranted: true },
    });

    // Grant 7 days Premium to both users
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    const txId = `REF_${referrer.id.slice(0,6)}_${refereeId.slice(0,6)}_${Date.now()}`;

    await this.prisma.$transaction([
      this.prisma.subscription.create({
        data: { userId: referrer.id, gateway: 'BKASH', status: 'ACTIVE', planType: 'REFERRAL', expiryDate, subscriptionId: `${txId}_A` },
      }),
      this.prisma.subscription.create({
        data: { userId: refereeId, gateway: 'BKASH', status: 'ACTIVE', planType: 'REFERRAL', expiryDate, subscriptionId: `${txId}_B` },
      }),
      this.prisma.user.updateMany({
        where: { id: { in: [referrer.id, refereeId] } },
        data: { role: 'PREMIUM' },
      }),
    ]);

    return { success: true, reward: '7 days Premium', expiryDate };
  }

  async generateShareCard(userId: string, storyId: string, score: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, streak: true },
    });
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      select: { title: true, illustrationUrl: true },
    });

    // In production: generate image via Cloudinary text overlay API
    // For now, return a shareable data payload
    return {
      shareData: {
        userName: user?.name,
        storyTitle: story?.title,
        score,
        streak: user?.streak?.currentStreak || 0,
        appDeepLink: `engolpo://stories/${storyId}`,
        // imageUrl: generated via Cloudinary in production
      },
      whatsappText: `🇧🇩 ইংলিশ গল্পে "${story?.title}" পড়লাম! Score: ${score}/100 🎯\nতুমিও পড়ো: engolpo://stories/${storyId}`,
      shareText: `🇧🇩 ইংলিশ গল্পে "${story?.title}" পড়লাম! Score: ${score}/100 🎯\nতুমিও পড়ো: engolpo://stories/${storyId}`, // for RN compatibility
      scoreCardUrl: story?.illustrationUrl || '', // for RN compatibility fallback
    };
  }

  async trackEvent(userId: string, dto: TrackEventDto) {
    // In production: forward to PostHog or Firebase Analytics
    // For now just acknowledge
    return { tracked: true, event: dto.event };
  }
}
