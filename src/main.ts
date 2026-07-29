import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ─── Global Prefix ───────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── CORS ────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', '*'],
    credentials: true,
  });

  // ─── Global Pipes ────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,         // Strip unknown fields
      forbidNonWhitelisted: true,
      transform: true,         // Auto-transform types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── Global Filters & Interceptors ───────────────────────────────────────
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ─── Swagger API Docs ────────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log('📖 Swagger docs: http://localhost:3000/api/docs');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}/api`);
}

bootstrap();
