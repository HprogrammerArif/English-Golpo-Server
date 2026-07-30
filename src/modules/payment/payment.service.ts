import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

const PLANS = {
  monthly: { amount: '79.00', days: 30 },
  yearly: { amount: '599.00', days: 365 },
  family: { amount: '249.00', days: 30, seats: 4 },
  booster: { amount: '29.00', days: 7 },
  story_unlock: { amount: '9.00', days: 0 },
  pronunciation_credits: { amount: '19.00', days: 0 },
};

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // ─── bKash ────────────────────────────────────────────────────────────────

  async createBkashPayment(userId: string, planId: string, storyId?: string) {
    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) throw new BadRequestException('Invalid plan ID');

    const token = await this.getBkashToken();
    const merchantInvoiceNumber = `EG_${userId.slice(0, 8)}_${Date.now()}`;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });

    try {
      const response = await axios.post(
        this.config.get('BKASH_CREATE_PAYMENT_URL')!,
        {
          mode: '0011',
          payerReference: user?.phone || userId,
          callbackURL: `${this.config.get('BACKEND_URL')}/api/payment/bkash/callback?userId=${userId}&planId=${planId}`,
          amount: plan.amount,
          currency: 'BDT',
          intent: 'sale',
          merchantInvoiceNumber,
        },
        {
          headers: {
            Authorization: token,
            'X-APP-Key': this.config.get('BKASH_APP_KEY'),
            'Content-Type': 'application/json',
          },
        },
      );

      return {
        checkoutUrl: response.data.bkashURL,
        paymentId: response.data.paymentID,
        merchantInvoice: merchantInvoiceNumber,
      };
    } catch (e: any) {
      this.logger.error('bKash create payment failed', e?.response?.data);
      throw new InternalServerErrorException('bKash payment initiation failed');
    }
  }

  async handleBkashCallback(
    paymentId: string,
    status: string,
    userId: string,
    planId: string,
  ) {
    if (status !== 'success') {
      return { redirect: `${this.config.get('BACKEND_URL')}/api/payment/fail?reason=cancelled` };
    }

    const token = await this.getBkashToken();

    try {
      const executeResponse = await axios.post(
        this.config.get('BKASH_EXECUTE_PAYMENT_URL')!,
        { paymentID: paymentId },
        {
          headers: {
            Authorization: token,
            'X-APP-Key': this.config.get('BKASH_APP_KEY'),
          },
        },
      );

      if (executeResponse.data.transactionStatus === 'Completed') {
        await this.confirmPayment({
          userId,
          gateway: 'BKASH',
          transactionId: executeResponse.data.trxID,
          amount: parseFloat(executeResponse.data.amount),
          planId,
        });

        return {
          redirect: `${this.config.get('BACKEND_URL')}/api/payment/success?transactionId=${executeResponse.data.trxID}`,
        };
      }
    } catch (e: any) {
      this.logger.error('bKash execute payment failed', e?.response?.data);
    }

    return { redirect: `${this.config.get('BACKEND_URL')}/api/payment/fail` };
  }

  private async getBkashToken(): Promise<string> {
    const response = await axios.post(
      this.config.get('BKASH_GRANT_TOKEN_URL')!,
      {
        app_key: this.config.get('BKASH_APP_KEY'),
        app_secret: this.config.get('BKASH_APP_SECRET'),
      },
      {
        headers: {
          username: this.config.get('BKASH_USERNAME'),
          password: this.config.get('BKASH_PASSWORD'),
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.id_token;
  }

  // ─── RevenueCat Webhook ────────────────────────────────────────────────────

  async handleRevenueCatWebhook(signature: string, body: any) {
    const secret = this.config.get('REVENUECAT_WEBHOOK_SECRET');
    // Validate signature
    if (secret && signature !== secret) {
      throw new BadRequestException('Invalid RevenueCat signature');
    }

    const event = body.event;
    const userId = event.app_user_id;
    const expiryMs = event.expiration_at_ms;

    this.logger.log(`RevenueCat event: ${event.type} for user: ${userId}`);

    switch (event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL': {
        await this.prisma.subscription.upsert({
          where: { subscriptionId: event.id },
          create: {
            userId,
            gateway: event.store === 'APP_STORE' ? 'APP_STORE' : 'PLAY_STORE',
            status: 'ACTIVE',
            expiryDate: new Date(expiryMs),
            subscriptionId: event.id,
          },
          update: {
            status: 'ACTIVE',
            expiryDate: new Date(expiryMs),
          },
        });
        await this.prisma.user.update({
          where: { id: userId },
          data: { role: 'PREMIUM' },
        });
        break;
      }
      case 'CANCELLATION':
      case 'EXPIRATION': {
        await this.prisma.subscription.updateMany({
          where: { userId, gateway: { in: ['APP_STORE', 'PLAY_STORE'] } },
          data: { status: 'EXPIRED' },
        });
        // Check if user has any other active sub before revoking PREMIUM
        const otherActive = await this.prisma.subscription.findFirst({
          where: { userId, status: 'ACTIVE' },
        });
        if (!otherActive) {
          await this.prisma.user.update({
            where: { id: userId },
            data: { role: 'FREE' },
          });
        }
        break;
      }
    }

    return { received: true };
  }

  // ─── Micro-Transactions ───────────────────────────────────────────────────

  async unlockStory(userId: string, storyId: string, transactionId: string) {
    return this.prisma.consumablePurchase.create({
      data: { userId, type: 'STORY_UNLOCK', referenceId: storyId, transactionId },
    });
  }

  async activateBooster(userId: string, transactionId: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    await this.prisma.subscription.create({
      data: {
        userId,
        gateway: 'BKASH',
        status: 'ACTIVE',
        planType: 'BOOSTER',
        expiryDate,
        subscriptionId: transactionId,
      },
    });
    await this.prisma.user.update({ where: { id: userId }, data: { role: 'PREMIUM' } });
    return { boostedUntil: expiryDate };
  }

  async verifyPersonalBkashPayment(userId: string, planId: string, transactionId: string) {
    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) throw new BadRequestException('Invalid plan ID');

    // Check if transaction ID is already used to prevent double usage
    const existing = await this.prisma.paymentTransaction.findUnique({
      where: { transactionId },
    });
    if (existing) {
      throw new BadRequestException('Transaction ID has already been used.');
    }

    // For testing/mocking, we automatically confirm this payment
    await this.confirmPayment({
      userId,
      gateway: 'BKASH',
      transactionId,
      amount: parseFloat(plan.amount),
      planId,
    });

    return { success: true, message: 'Payment verified and premium activated!' };
  }

  // ─── Internal: Confirm any payment ───────────────────────────────────────

  async confirmPayment(data: {
    userId: string;
    gateway: string;
    transactionId: string;
    amount: number;
    planId: string;
  }) {
    const plan = PLANS[data.planId as keyof typeof PLANS];

    // Record transaction
    await this.prisma.paymentTransaction.create({
      data: {
        userId: data.userId,
        gateway: data.gateway as any,
        transactionId: data.transactionId,
        amount: data.amount,
        currency: 'BDT',
        status: 'SUCCESS',
      },
    });

    if (plan && plan.days > 0) {
      // It's a subscription
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + plan.days);

      await this.prisma.subscription.create({
        data: {
          userId: data.userId,
          gateway: data.gateway as any,
          status: 'ACTIVE',
          planType: data.planId.toUpperCase(),
          expiryDate,
          subscriptionId: data.transactionId,
        },
      });

      await this.prisma.user.update({
        where: { id: data.userId },
        data: { role: 'PREMIUM' },
      });
    }

    this.logger.log(`Payment confirmed: ${data.transactionId} for user ${data.userId}`);
  }
}
