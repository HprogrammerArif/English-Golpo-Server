import { PrismaService } from '../../prisma/prisma.service';
export declare class UpdateProfileDto {
    name?: string;
    avatarUrl?: string;
    learningPath?: string;
    whatsappOptIn?: boolean;
}
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMe(userId: string): Promise<{
        level: number;
        activeSubscription: {
            expiryDate: Date;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            planType: string;
        };
        id: string;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        createdAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        avatarUrl: string | null;
        role: string;
        lives: number;
        gems: number;
        league: import("@prisma/client").$Enums.League;
        xpTotal: number;
        whatsappOptIn: boolean;
        streak: {
            id: string;
            currentStreak: number;
            longestStreak: number;
            lastActiveDate: Date | null;
            freezesUsed: number;
            userId: string;
        } | null;
        subscriptions: {
            expiryDate: Date;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            planType: string;
        }[];
        _count: {
            progress: number;
            bookmarks: number;
        };
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        id: string;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        name: string;
        avatarUrl: string | null;
        whatsappOptIn: boolean;
    }>;
}
