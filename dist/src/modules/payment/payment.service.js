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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const axios_1 = __importDefault(require("axios"));
const PLANS = {
    monthly: { amount: '79.00', days: 30 },
    yearly: { amount: '599.00', days: 365 },
    family: { amount: '249.00', days: 30, seats: 4 },
    booster: { amount: '29.00', days: 7 },
    story_unlock: { amount: '9.00', days: 0 },
    pronunciation_credits: { amount: '19.00', days: 0 },
};
let PaymentService = PaymentService_1 = class PaymentService {
    prisma;
    config;
    logger = new common_1.Logger(PaymentService_1.name);
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async createBkashPayment(userId, planId, storyId) {
        const plan = PLANS[planId];
        if (!plan)
            throw new common_1.BadRequestException('Invalid plan ID');
        const token = await this.getBkashToken();
        const merchantInvoiceNumber = `EG_${userId.slice(0, 8)}_${Date.now()}`;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { phone: true },
        });
        try {
            const response = await axios_1.default.post(this.config.get('BKASH_CREATE_PAYMENT_URL'), {
                mode: '0011',
                payerReference: user?.phone || userId,
                callbackURL: `${this.config.get('BACKEND_URL')}/api/payment/bkash/callback?userId=${userId}&planId=${planId}`,
                amount: plan.amount,
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber,
            }, {
                headers: {
                    Authorization: token,
                    'X-APP-Key': this.config.get('BKASH_APP_KEY'),
                    'Content-Type': 'application/json',
                },
            });
            return {
                checkoutUrl: response.data.bkashURL,
                paymentId: response.data.paymentID,
                merchantInvoice: merchantInvoiceNumber,
            };
        }
        catch (e) {
            this.logger.error('bKash create payment failed', e?.response?.data);
            throw new common_1.InternalServerErrorException('bKash payment initiation failed');
        }
    }
    async handleBkashCallback(paymentId, status, userId, planId) {
        if (status !== 'success') {
            return { redirect: `${this.config.get('BACKEND_URL')}/api/payment/fail?reason=cancelled` };
        }
        const token = await this.getBkashToken();
        try {
            const executeResponse = await axios_1.default.post(this.config.get('BKASH_EXECUTE_PAYMENT_URL'), { paymentID: paymentId }, {
                headers: {
                    Authorization: token,
                    'X-APP-Key': this.config.get('BKASH_APP_KEY'),
                },
            });
            if (executeResponse.data.transactionStatus === 'Completed') {
                await this.confirmPayment({
                    userId,
                    gateway: 'BKASH',
                    transactionId: executeResponse.data.trxID,
                    amount: parseFloat(executeResponse.data.amount),
                    planId,
                });
                return {
                    redirect: `${this.config.get('BACKEND_URL')}/api/payment/success?transactionId=${executeResponse.data.trxID}`,
                };
            }
        }
        catch (e) {
            this.logger.error('bKash execute payment failed', e?.response?.data);
        }
        return { redirect: `${this.config.get('BACKEND_URL')}/api/payment/fail` };
    }
    async getBkashToken() {
        const response = await axios_1.default.post(this.config.get('BKASH_GRANT_TOKEN_URL'), {
            app_key: this.config.get('BKASH_APP_KEY'),
            app_secret: this.config.get('BKASH_APP_SECRET'),
        }, {
            headers: {
                username: this.config.get('BKASH_USERNAME'),
                password: this.config.get('BKASH_PASSWORD'),
                'Content-Type': 'application/json',
            },
        });
        return response.data.id_token;
    }
    async handleRevenueCatWebhook(signature, body) {
        const secret = this.config.get('REVENUECAT_WEBHOOK_SECRET');
        if (secret && signature !== secret) {
            throw new common_1.BadRequestException('Invalid RevenueCat signature');
        }
        const event = body.event;
        const userId = event.app_user_id;
        const expiryMs = event.expiration_at_ms;
        this.logger.log(`RevenueCat event: ${event.type} for user: ${userId}`);
        switch (event.type) {
            case 'INITIAL_PURCHASE':
            case 'RENEWAL': {
                await this.prisma.subscription.upsert({
                    where: { subscriptionId: event.id },
                    create: {
                        userId,
                        gateway: event.store === 'APP_STORE' ? 'APP_STORE' : 'PLAY_STORE',
                        status: 'ACTIVE',
                        expiryDate: new Date(expiryMs),
                        subscriptionId: event.id,
                    },
                    update: {
                        status: 'ACTIVE',
                        expiryDate: new Date(expiryMs),
                    },
                });
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { role: 'PREMIUM' },
                });
                break;
            }
            case 'CANCELLATION':
            case 'EXPIRATION': {
                await this.prisma.subscription.updateMany({
                    where: { userId, gateway: { in: ['APP_STORE', 'PLAY_STORE'] } },
                    data: { status: 'EXPIRED' },
                });
                const otherActive = await this.prisma.subscription.findFirst({
                    where: { userId, status: 'ACTIVE' },
                });
                if (!otherActive) {
                    await this.prisma.user.update({
                        where: { id: userId },
                        data: { role: 'FREE' },
                    });
                }
                break;
            }
        }
        return { received: true };
    }
    async unlockStory(userId, storyId, transactionId) {
        return this.prisma.consumablePurchase.create({
            data: { userId, type: 'STORY_UNLOCK', referenceId: storyId, transactionId },
        });
    }
    async activateBooster(userId, transactionId) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        await this.prisma.subscription.create({
            data: {
                userId,
                gateway: 'BKASH',
                status: 'ACTIVE',
                planType: 'BOOSTER',
                expiryDate,
                subscriptionId: transactionId,
            },
        });
        await this.prisma.user.update({ where: { id: userId }, data: { role: 'PREMIUM' } });
        return { boostedUntil: expiryDate };
    }
    async confirmPayment(data) {
        const plan = PLANS[data.planId];
        await this.prisma.paymentTransaction.create({
            data: {
                userId: data.userId,
                gateway: data.gateway,
                transactionId: data.transactionId,
                amount: data.amount,
                currency: 'BDT',
                status: 'SUCCESS',
            },
        });
        if (plan && plan.days > 0) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + plan.days);
            await this.prisma.subscription.create({
                data: {
                    userId: data.userId,
                    gateway: data.gateway,
                    status: 'ACTIVE',
                    planType: data.planId.toUpperCase(),
                    expiryDate,
                    subscriptionId: data.transactionId,
                },
            });
            await this.prisma.user.update({
                where: { id: data.userId },
                data: { role: 'PREMIUM' },
            });
        }
        this.logger.log(`Payment confirmed: ${data.transactionId} for user ${data.userId}`);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map