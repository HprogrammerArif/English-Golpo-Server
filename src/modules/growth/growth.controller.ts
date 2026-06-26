import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GrowthService, RedeemReferralDto, TrackEventDto } from './growth.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class ShareCardDto {
  @ApiProperty() @IsString() storyId: string;
  @ApiProperty() @IsNumber() score: number;
}

@ApiTags('growth')
@ApiBearerAuth()
@Controller('growth')
export class GrowthController {
  constructor(private readonly growthService: GrowthService) {}

  @Get('referral/link')
  @ApiOperation({ summary: 'Get referral deep link and WhatsApp share message' })
  getReferralLink(@CurrentUser() user: { id: string }) {
    return this.growthService.generateReferralLink(user.id);
  }

  @Post('referral/redeem')
  @ApiOperation({ summary: 'Redeem a referral code — both users get 7 days Premium' })
  redeemReferral(@CurrentUser() user: { id: string }, @Body() dto: RedeemReferralDto) {
    return this.growthService.redeemReferral(user.id, dto.code);
  }

  @Post('share-card')
  @ApiOperation({ summary: 'Generate WhatsApp-ready score card for a completed story' })
  shareCard(@CurrentUser() user: { id: string }, @Body() dto: ShareCardDto) {
    return this.growthService.generateShareCard(user.id, dto.storyId, dto.score);
  }

  @Post('events/track')
  @ApiOperation({ summary: 'Track A/B test events and funnel analytics' })
  trackEvent(@CurrentUser() user: { id: string }, @Body() dto: TrackEventDto) {
    return this.growthService.trackEvent(user.id, dto);
  }
}
