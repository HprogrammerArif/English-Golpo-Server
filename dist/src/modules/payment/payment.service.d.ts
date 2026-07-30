import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PaymentService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    createBkashPayment(userId: string, planId: string, storyId?: string): Promise<{
        checkoutUrl: any;
        paymentId: any;
        merchantInvoice: string;
    }>;
    handleBkashCallback(paymentId: string, status: string, userId: string, planId: string): Promise<{
        redirect: string;
    }>;
    private getBkashToken;
    handleRevenueCatWebhook(signature: string, body: any): Promise<{
        received: boolean;
    }>;
    unlockStory(userId: string, storyId: string, transactionId: string): Promise<{
        id: string;
        type: string;
        userId: string;
        quantity: number;
        referenceId: string | null;
        transactionId: string;
        purchasedAt: Date;
    }>;
    activateBooster(userId: string, transactionId: string): Promise<{
        boostedUntil: Date;
    }>;
    verifyPersonalBkashPayment(userId: string, planId: string, transactionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    confirmPayment(data: {
        userId: string;
        gateway: string;
        transactionId: string;
        amount: number;
        planId: string;
    }): Promise<void>;
}
