import { Controller, Post, Get, Body, Query, Param, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

class CreateBkashPaymentDto {
  @ApiProperty({ enum: ['monthly','yearly','family','booster','story_unlock','pronunciation_credits'] })
  @IsIn(['monthly','yearly','family','booster','story_unlock','pronunciation_credits'])
  planId: string;

  @ApiPropertyOptional({ description: 'Required when planId=story_unlock' })
  @IsOptional() @IsString() storyId?: string;
}

class UnlockStoryDto {
  @ApiProperty() @IsString() storyId: string;
  @ApiProperty() @IsString() transactionId: string;
}

class BoosterDto {
  @ApiProperty() @IsString() transactionId: string;
}

class VerifyPersonalPaymentDto {
  @ApiProperty({ enum: ['monthly','yearly','family'] })
  @IsIn(['monthly','yearly','family'])
  planId: string;

  @ApiProperty() @IsString() transactionId: string;
}

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // ─── bKash ────────────────────────────────────────────────────────────────

  @Post('bkash/create')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate bKash tokenized checkout — returns checkoutUrl for WebView' })
  createBkashPayment(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateBkashPaymentDto,
  ) {
    return this.paymentService.createBkashPayment(user.id, dto.planId, dto.storyId);
  }

  @Post('bkash/verify-personal')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify manual bKash personal payment via Transaction ID' })
  verifyPersonalPayment(
    @CurrentUser() user: { id: string },
    @Body() dto: VerifyPersonalPaymentDto,
  ) {
    return this.paymentService.verifyPersonalBkashPayment(user.id, dto.planId, dto.transactionId);
  }

  @Get('bkash/callback')
  @Public()
  @ApiOperation({ summary: 'bKash callback — called by bKash after user payment (Server→Server)' })
  bkashCallback(
    @Query('paymentID') paymentId: string,
    @Query('status') status: string,
    @Query('userId') userId: string,
    @Query('planId') planId: string,
  ) {
    return this.paymentService.handleBkashCallback(paymentId, status, userId, planId);
  }

  // ─── RevenueCat ───────────────────────────────────────────────────────────

  @Post('revenuecat-webhook')
  @Public()
  @ApiOperation({ summary: 'RevenueCat S2S webhook — App Store & Google Play subscription events' })
  revenueCatWebhook(
    @Headers('X-RevenueCat-Signature') signature: string,
    @Body() body: any,
  ) {
    return this.paymentService.handleRevenueCatWebhook(signature, body);
  }

  // ─── Micro-Transactions ───────────────────────────────────────────────────

  @Post('unlock-story')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Permanently unlock a single premium story (9 BDT)' })
  unlockStory(@CurrentUser() user: { id: string }, @Body() dto: UnlockStoryDto) {
    return this.paymentService.unlockStory(user.id, dto.storyId, dto.transactionId);
  }

  @Post('booster')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate 7-day Premium booster (29 BDT)' })
  activateBooster(@CurrentUser() user: { id: string }, @Body() dto: BoosterDto) {
    return this.paymentService.activateBooster(user.id, dto.transactionId);
  }

  // ─── Status pages (redirected to from payment gateways) ──────────────────

  @Get('success')
  @Public()
  paymentSuccess(@Query('transactionId') txId: string) {
    return { status: 'success', transactionId: txId, message: 'Payment completed successfully' };
  }

  @Get('fail')
  @Public()
  paymentFail(@Query('reason') reason: string) {
    return { status: 'failed', reason: reason || 'Payment failed or was cancelled' };
  }
}
