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

const MAX_LIVES = 5;

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

    return this.prisma.$transaction(async (tx) => {
      // Atomic guarded decrement — only succeeds if the balance is still sufficient,
      // closing the race window between a balance check and the deduction.
      const deducted = await tx.user.updateMany({
        where: { id: userId, gems: { gte: price } },
        data: { gems: { decrement: price } },
      });

      if (deducted.count === 0) {
        const user = await tx.user.findUnique({ where: { id: userId }, select: { gems: true } });
        throw new BadRequestException(`Insufficient gems. Need ${price}, have ${user?.gems || 0}`);
      }

      await tx.userItem.upsert({
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
      });

      // An Extra Life is an instant-use consumable — apply its effect immediately, capped at MAX_LIVES.
      if (dto.itemType === 'EXTRA_LIFE') {
        const current = await tx.user.findUnique({ where: { id: userId }, select: { lives: true } });
        if (current && current.lives < MAX_LIVES) {
          await tx.user.update({ where: { id: userId }, data: { lives: { increment: 1 } } });
        }
      }

      return { purchased: dto.itemType, gemsSpent: price };
    });
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
