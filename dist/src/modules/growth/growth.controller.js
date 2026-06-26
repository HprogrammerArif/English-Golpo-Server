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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const growth_service_1 = require("./growth.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
class ShareCardDto {
    storyId;
    score;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShareCardDto.prototype, "storyId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ShareCardDto.prototype, "score", void 0);
let GrowthController = class GrowthController {
    growthService;
    constructor(growthService) {
        this.growthService = growthService;
    }
    getReferralLink(user) {
        return this.growthService.generateReferralLink(user.id);
    }
    redeemReferral(user, dto) {
        return this.growthService.redeemReferral(user.id, dto.code);
    }
    shareCard(user, dto) {
        return this.growthService.generateShareCard(user.id, dto.storyId, dto.score);
    }
    trackEvent(user, dto) {
        return this.growthService.trackEvent(user.id, dto);
    }
};
exports.GrowthController = GrowthController;
__decorate([
    (0, common_1.Get)('referral/link'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral deep link and WhatsApp share message' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GrowthController.prototype, "getReferralLink", null);
__decorate([
    (0, common_1.Post)('referral/redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Redeem a referral code — both users get 7 days Premium' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, growth_service_1.RedeemReferralDto]),
    __metadata("design:returntype", void 0)
], GrowthController.prototype, "redeemReferral", null);
__decorate([
    (0, common_1.Post)('share-card'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate WhatsApp-ready score card for a completed story' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ShareCardDto]),
    __metadata("design:returntype", void 0)
], GrowthController.prototype, "shareCard", null);
__decorate([
    (0, common_1.Post)('events/track'),
    (0, swagger_1.ApiOperation)({ summary: 'Track A/B test events and funnel analytics' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, growth_service_1.TrackEventDto]),
    __metadata("design:returntype", void 0)
], GrowthController.prototype, "trackEvent", null);
exports.GrowthController = GrowthController = __decorate([
    (0, swagger_1.ApiTags)('growth'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('growth'),
    __metadata("design:paramtypes", [growth_service_1.GrowthService])
], GrowthController);
//# sourceMappingURL=growth.controller.js.map