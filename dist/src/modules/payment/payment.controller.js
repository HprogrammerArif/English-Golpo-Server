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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
const payment_service_1 = require("./payment.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const public_decorator_1 = require("../../common/decorators/public.decorator");
class CreateBkashPaymentDto {
    planId;
    storyId;
}
__decorate([
    (0, swagger_2.ApiProperty)({ enum: ['monthly', 'yearly', 'family', 'booster', 'story_unlock', 'pronunciation_credits'] }),
    (0, class_validator_1.IsIn)(['monthly', 'yearly', 'family', 'booster', 'story_unlock', 'pronunciation_credits']),
    __metadata("design:type", String)
], CreateBkashPaymentDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Required when planId=story_unlock' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBkashPaymentDto.prototype, "storyId", void 0);
class UnlockStoryDto {
    storyId;
    transactionId;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnlockStoryDto.prototype, "storyId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UnlockStoryDto.prototype, "transactionId", void 0);
class BoosterDto {
    transactionId;
}
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BoosterDto.prototype, "transactionId", void 0);
class VerifyPersonalPaymentDto {
    planId;
    transactionId;
}
__decorate([
    (0, swagger_2.ApiProperty)({ enum: ['monthly', 'yearly', 'family'] }),
    (0, class_validator_1.IsIn)(['monthly', 'yearly', 'family']),
    __metadata("design:type", String)
], VerifyPersonalPaymentDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_2.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyPersonalPaymentDto.prototype, "transactionId", void 0);
let PaymentController = class PaymentController {
    paymentService;
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    createBkashPayment(user, dto) {
        return this.paymentService.createBkashPayment(user.id, dto.planId, dto.storyId);
    }
    verifyPersonalPayment(user, dto) {
        return this.paymentService.verifyPersonalBkashPayment(user.id, dto.planId, dto.transactionId);
    }
    bkashCallback(paymentId, status, userId, planId) {
        return this.paymentService.handleBkashCallback(paymentId, status, userId, planId);
    }
    revenueCatWebhook(signature, body) {
        return this.paymentService.handleRevenueCatWebhook(signature, body);
    }
    unlockStory(user, dto) {
        return this.paymentService.unlockStory(user.id, dto.storyId, dto.transactionId);
    }
    activateBooster(user, dto) {
        return this.paymentService.activateBooster(user.id, dto.transactionId);
    }
    paymentSuccess(txId) {
        return { status: 'success', transactionId: txId, message: 'Payment completed successfully' };
    }
    paymentFail(reason) {
        return { status: 'failed', reason: reason || 'Payment failed or was cancelled' };
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)('bkash/create'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate bKash tokenized checkout — returns checkoutUrl for WebView' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateBkashPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createBkashPayment", null);
__decorate([
    (0, common_1.Post)('bkash/verify-personal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify manual bKash personal payment via Transaction ID' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, VerifyPersonalPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "verifyPersonalPayment", null);
__decorate([
    (0, common_1.Get)('bkash/callback'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'bKash callback — called by bKash after user payment (Server→Server)' }),
    __param(0, (0, common_1.Query)('paymentID')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "bkashCallback", null);
__decorate([
    (0, common_1.Post)('revenuecat-webhook'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'RevenueCat S2S webhook — App Store & Google Play subscription events' }),
    __param(0, (0, common_1.Headers)('X-RevenueCat-Signature')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "revenueCatWebhook", null);
__decorate([
    (0, common_1.Post)('unlock-story'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Permanently unlock a single premium story (9 BDT)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UnlockStoryDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "unlockStory", null);
__decorate([
    (0, common_1.Post)('booster'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Activate 7-day Premium booster (29 BDT)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BoosterDto]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "activateBooster", null);
__decorate([
    (0, common_1.Get)('success'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "paymentSuccess", null);
__decorate([
    (0, common_1.Get)('fail'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "paymentFail", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map