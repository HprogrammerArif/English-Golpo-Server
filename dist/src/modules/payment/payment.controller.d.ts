import { PaymentService } from './payment.service';
declare class CreateBkashPaymentDto {
    planId: string;
    storyId?: string;
}
declare class UnlockStoryDto {
    storyId: string;
    transactionId: string;
}
declare class BoosterDto {
    transactionId: string;
}
declare class VerifyPersonalPaymentDto {
    planId: string;
    transactionId: string;
}
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createBkashPayment(user: {
        id: string;
    }, dto: CreateBkashPaymentDto): Promise<{
        checkoutUrl: any;
        paymentId: any;
        merchantInvoice: string;
    }>;
    verifyPersonalPayment(user: {
        id: string;
    }, dto: VerifyPersonalPaymentDto): Promise<{
        success: boolean;
        message: string;
    }>;
    bkashCallback(paymentId: string, status: string, userId: string, planId: string): Promise<{
        redirect: string;
    }>;
    revenueCatWebhook(signature: string, body: any): Promise<{
        received: boolean;
    }>;
    unlockStory(user: {
        id: string;
    }, dto: UnlockStoryDto): Promise<{
        id: string;
        type: string;
        userId: string;
        quantity: number;
        referenceId: string | null;
        transactionId: string;
        purchasedAt: Date;
    }>;
    activateBooster(user: {
        id: string;
    }, dto: BoosterDto): Promise<{
        boostedUntil: Date;
    }>;
    paymentSuccess(txId: string): {
        status: string;
        transactionId: string;
        message: string;
    };
    paymentFail(reason: string): {
        status: string;
        reason: string;
    };
}
export {};
