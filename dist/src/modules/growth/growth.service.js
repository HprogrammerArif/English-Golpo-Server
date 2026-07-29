"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthService = exports.TrackEventDto = exports.RedeemReferralDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RedeemReferralDto {
    code;
}
exports.RedeemReferralDto = RedeemReferralDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Referral code from deep link' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemReferralDto.prototype, "code", void 0);
class TrackEventDto {
    event;
    properties;
}
exports.TrackEventDto = TrackEventDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackEventDto.prototype, "event", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], TrackEventDto.prototype, "properties", void 0);
let GrowthService = class GrowthService {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async generateReferralLink(userId) {
        const baseUrl = this.config.get('BACKEND_URL');
        const code = userId.slice(0, 8).toUpperCase();
        return {
            code,
            deepLink: `engolpo://referral/${code}`,
            shareUrl: `${baseUrl}/join/${code}`,
            message: `ইংলিশ গল্প অ্যাপে জয়েন করো! আমার লিংক দিয়ে সাইন আপ করলে তুমি ৭ দিন ফ্রি Premium পাবে 🎉 ${baseUrl}/join/${code}`,
            referralLink: `${baseUrl}/join/${code}`,
            shareMessage: `ইংলিশ গল্প অ্যাপে জয়েন করো! আমার লিংক দিয়ে সাইন আপ করলে তুমি ৭ দিন ফ্রি Premium পাবে 🎉 ${baseUrl}/join/${code}`,
        };
    }
    async redeemReferral(refereeId, code) {
        const referrer = await this.prisma.user.findFirst({
            where: { id: { startsWith: code.toLowerCase() } },
        });
        if (!referrer || referrer.id === refereeId) {
            return { success: false, reason: 'Invalid referral code' };
        }
        const existing = await this.prisma.referral.findUnique({
            where: { referrerId_refereeId: { referrerId: referrer.id, refereeId } },
        });
        if (existing)
            return { success: false, reason: 'Already redeemed' };
        await this.prisma.referral.create({
            data: { referrerId: referrer.id, refereeId, status: 'COMPLETED', rewardGranted: true },
        });
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        const txId = `REF_${referrer.id.slice(0, 6)}_${refereeId.slice(0, 6)}_${Date.now()}`;
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
    async generateShareCard(userId, storyId, score) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, streak: true },
        });
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
            select: { title: true, illustrationUrl: true },
        });
        return {
            shareData: {
                userName: user?.name,
                storyTitle: story?.title,
                score,
                streak: user?.streak?.currentStreak || 0,
                appDeepLink: `engolpo://stories/${storyId}`,
            },
            whatsappText: `🇧🇩 ইংলিশ গল্পে "${story?.title}" পড়লাম! Score: ${score}/100 🎯\nতুমিও পড়ো: engolpo://stories/${storyId}`,
            shareText: `🇧🇩 ইংলিশ গল্পে "${story?.title}" পড়লাম! Score: ${score}/100 🎯\nতুমিও পড়ো: engolpo://stories/${storyId}`,
            scoreCardUrl: story?.illustrationUrl || '',
        };
    }
    async trackEvent(userId, dto) {
        return { tracked: true, event: dto.event };
    }
};
exports.GrowthService = GrowthService;
exports.GrowthService = GrowthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], GrowthService);
//# sourceMappingURL=growth.service.js.map