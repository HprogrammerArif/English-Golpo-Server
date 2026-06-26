import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShopService, BuyItemDto } from './shop.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class RefillLivesDto {
  @ApiProperty({ description: 'AdMob reward token from client' })
  @IsString() adToken: string;
}

@ApiTags('shop')
@ApiBearerAuth()
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @ApiOperation({ summary: 'Get all shop items with gem prices' })
  getItems() {
    return this.shopService.getItems();
  }

  @Post('buy')
  @ApiOperation({ summary: 'Buy a shop item using gems' })
  buy(@CurrentUser() user: { id: string }, @Body() dto: BuyItemDto) {
    return this.shopService.buyItem(user.id, dto);
  }

  @Post('refill-lives')
  @ApiOperation({ summary: 'Refill lives after watching a rewarded ad' })
  refillLives(@CurrentUser() user: { id: string }, @Body() dto: RefillLivesDto) {
    return this.shopService.refillLives(user.id, dto.adToken);
  }
}
