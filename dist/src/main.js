"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: ['http://localhost:8081', 'http://localhost:19006'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter(), new prisma_exception_filter_1.PrismaExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('English Golpo API')
            .setDescription('Backend API for English Golpo — Bengali language learning app')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('auth', 'Authentication & Registration')
            .addTag('user', 'User profile management')
            .addTag('stories', 'Story content & learning paths')
            .addTag('gamification', 'XP, streaks, leagues & leaderboards')
            .addTag('progress', 'User progress & vocabulary bookmarks')
            .addTag('quiz', 'Quiz questions & results')
            .addTag('shop', 'Virtual item shop')
            .addTag('payment', 'bKash, Nagad, RevenueCat payments')
            .addTag('growth', 'Referrals, share cards & analytics')
            .addTag('accounts', 'Parental controls & B2B management')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
        logger.log('📖 Swagger docs: http://localhost:3000/api/docs');
    }
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Server running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map