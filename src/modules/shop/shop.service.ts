import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsIn, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const ITEM_PRICES: Record<string, number> = {
  STREAK_FREEZE: 50,
  EXTRA_LIFE: 30,
  AVATAR_OUTFIT: 200,
  BONUS_LESSON: 100,
};

export class BuyItemDto {
  @ApiProperty({ enum: Object.keys(ITEM_PRICES) })
  @IsIn(Object.keys(ITEM_PRICES))
  itemType: string;

  @ApiPropertyOptional({ description: 'Specific item ID (e.g., outfit ID)' })
  @IsOptional() @IsString()
  itemId?: string;
}

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  async getItems() {
    return Object.entries(ITEM_PRICES).map(([itemType, price]) => ({
      itemType,
      price,
      currency: 'GEMS',
    }));
  }

  async buyItem(userId: string, dto: BuyItemDto) {
    const price = ITEM_PRICES[dto.itemType];
    if (!price) throw new BadRequestException('Unknown item type');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { gems: true },
    });

    if (!user || user.gems < price) {
      throw new BadRequestException(`Insufficient gems. Need ${price}, have ${user?.gems || 0}`);
    }

    // Deduct gems and add item
    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { gems: { decrement: price } },
      }),
      this.prisma.userItem.upsert({
        where: {
          // Use a pseudo-unique condition
          id: `${userId}-${dto.itemType}-${dto.itemId || 'default'}`,
        },
        create: {
          id: `${userId}-${dto.itemType}-${dto.itemId || 'default'}`,
          userId,
          itemType: dto.itemType,
          itemId: dto.itemId,
          quantity: 1,
        },
        update: { quantity: { increment: 1 } },
      }),
    ]);

    return { purchased: dto.itemType, gemsSpent: price };
  }

  async refillLives(userId: string, adToken: string) {
    // In production: validate adToken against AdMob server-side verification
    // For dev: accept any non-empty token
    if (!adToken) throw new BadRequestException('Valid ad token required');

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { lives: 5, lastLifeRefill: new Date() },
      select: { lives: true },
    });

    return { lives: user.lives, message: 'Lives refilled via ad reward' };
  }
}
