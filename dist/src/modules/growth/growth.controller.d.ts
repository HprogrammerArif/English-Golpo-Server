import { GrowthService, RedeemReferralDto, TrackEventDto } from './growth.service';
declare class ShareCardDto {
    storyId: string;
    score: number;
}
export declare class GrowthController {
    private readonly growthService;
    constructor(growthService: GrowthService);
    getReferralLink(user: {
        id: string;
    }): Promise<{
        code: string;
        deepLink: string;
        shareUrl: string;
        message: string;
    }>;
    redeemReferral(user: {
        id: string;
    }, dto: RedeemReferralDto): Promise<{
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
    shareCard(user: {
        id: string;
    }, dto: ShareCardDto): Promise<{
        shareData: {
            userName: string | undefined;
            storyTitle: string | undefined;
            score: number;
            streak: number;
            appDeepLink: string;
        };
        whatsappText: string;
    }>;
    trackEvent(user: {
        id: string;
    }, dto: TrackEventDto): Promise<{
        tracked: boolean;
        event: string;
    }>;
}
export {};
