import { ShopService, BuyItemDto } from './shop.service';
declare class RefillLivesDto {
    adToken: string;
}
export declare class ShopController {
    private readonly shopService;
    constructor(shopService: ShopService);
    getItems(): Promise<{
        itemType: string;
        price: number;
        currency: string;
    }[]>;
    buy(user: {
        id: string;
    }, dto: BuyItemDto): Promise<{
        purchased: string;
        gemsSpent: number;
    }>;
    refillLives(user: {
        id: string;
    }, dto: RefillLivesDto): Promise<{
        lives: number;
        message: string;
    }>;
}
export {};
