import { UserService, UpdateProfileDto } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getMe(user: {
        id: string;
    }): Promise<{
        level: number;
        activeSubscription: {
            expiryDate: Date;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            planType: string;
        };
        id: string;
        email: string | null;
        phone: string | null;
        name: string;
        avatarUrl: string | null;
        role: string;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        lives: number;
        gems: number;
        league: import("@prisma/client").$Enums.League;
        xpTotal: number;
        whatsappOptIn: boolean;
        createdAt: Date;
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
    updateMe(user: {
        id: string;
    }, dto: UpdateProfileDto): Promise<{
        id: string;
        name: string;
        avatarUrl: string | null;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        whatsappOptIn: boolean;
    }>;
}
