import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class RedeemReferralDto {
    code: string;
}
export declare class TrackEventDto {
    event: string;
    properties?: Record<string, any>;
}
export declare class GrowthService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    generateReferralLink(userId: string): Promise<{
        code: string;
        deepLink: string;
        shareUrl: string;
        message: string;
    }>;
    redeemReferral(refereeId: string, code: string): Promise<{
        success: boolean;
        reason: string;
        reward?: undefined;
        expiryDate?: undefined;
    } | {
        success: boolean;
        reward: string;
        expiryDate: Date;
        reason?: undefined;
    }>;
    generateShareCard(userId: string, storyId: string, score: number): Promise<{
        shareData: {
            userName: string | undefined;
            storyTitle: string | undefined;
            score: number;
            streak: number;
            appDeepLink: string;
        };
        whatsappText: string;
    }>;
    trackEvent(userId: string, dto: TrackEventDto): Promise<{
        tracked: boolean;
        event: string;
    }>;
}
