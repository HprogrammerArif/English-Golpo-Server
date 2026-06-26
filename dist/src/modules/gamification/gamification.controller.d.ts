import { GamificationService } from './gamification.service';
declare class AddXpDto {
    amount: number;
}
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    addXp(user: {
        id: string;
    }, body: AddXpDto): Promise<{
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
    getStreak(user: {
        id: string;
    }): Promise<{
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: Date | null | undefined;
        activeDates: Date[];
    }>;
    getLeaderboard(user: {
        id: string;
    }): Promise<{
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
}
export {};
