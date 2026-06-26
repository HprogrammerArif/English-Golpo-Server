import { PrismaService } from '../../prisma/prisma.service';
export declare class GamificationService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    addXp(userId: string, amount: number): Promise<{
        xpAdded: number;
        xpTotal: number;
        level: number;
        league: string;
        streak: {
            id: string;
            currentStreak: number;
            longestStreak: number;
            lastActiveDate: Date | null;
            freezesUsed: number;
            userId: string;
        };
        dailyGoal: {
            earned: number;
            target: number;
            completed: boolean;
        };
    }>;
    updateStreak(userId: string): Promise<{
        id: string;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null;
        freezesUsed: number;
        userId: string;
    }>;
    getStreak(userId: string): Promise<{
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null | undefined;
        activeDates: Date[];
    }>;
    getLeaderboard(userId: string): Promise<{
        league: import("@prisma/client").$Enums.League;
        weekStarting: Date;
        entries: {
            rank: number;
            userId: string;
            name: string;
            avatarUrl: string | null;
            xpEarned: number;
            isCurrentUser: boolean;
        }[];
    }>;
    handleStreakFreezeCheck(): Promise<void>;
    private getWeekStart;
    private calculateLeague;
}
