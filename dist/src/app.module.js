"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const schedule_1 = require("@nestjs/schedule");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const story_module_1 = require("./modules/story/story.module");
const gamification_module_1 = require("./modules/gamification/gamification.module");
const progress_module_1 = require("./modules/progress/progress.module");
const quiz_module_1 = require("./modules/quiz/quiz.module");
const shop_module_1 = require("./modules/shop/shop.module");
const payment_module_1 = require("./modules/payment/payment.module");
const growth_module_1 = require("./modules/growth/growth.module");
const accounts_module_1 = require("./modules/accounts/accounts.module");
const video_module_1 = require("./modules/video/video.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    name: 'short',
                    ttl: 60000,
                    limit: 60,
                },
                {
                    name: 'long',
                    ttl: 3600000,
                    limit: 1000,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            story_module_1.StoryModule,
            gamification_module_1.GamificationModule,
            progress_module_1.ProgressModule,
            quiz_module_1.QuizModule,
            shop_module_1.ShopModule,
            payment_module_1.PaymentModule,
            growth_module_1.GrowthModule,
            accounts_module_1.AccountsModule,
            video_module_1.VideoModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map