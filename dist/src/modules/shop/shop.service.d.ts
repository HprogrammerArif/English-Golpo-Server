import { PrismaService } from '../../prisma/prisma.service';
export declare class BuyItemDto {
    itemType: string;
    itemId?: string;
}
export declare class ShopService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getItems(): Promise<{
        itemType: string;
        price: number;
        currency: string;
    }[]>;
    buyItem(userId: string, dto: BuyItemDto): Promise<{
        purchased: string;
        gemsSpent: number;
    }>;
    refillLives(userId: string, adToken: string): Promise<{
        lives: number;
        message: string;
    }>;
}
