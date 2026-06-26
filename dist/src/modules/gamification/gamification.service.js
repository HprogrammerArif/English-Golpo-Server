"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GamificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../../prisma/prisma.service");
const XP_PER_LEVEL = 100;
const LEAGUE_THRESHOLDS = {
    BRONZE: 0,
    SILVER: 500,
    GOLD: 2000,
    PLATINUM: 5000,
    DIAMOND: 10000,
};
let GamificationService = GamificationService_1 = class GamificationService {
    prisma;
    logger = new common_1.Logger(GamificationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addXp(userId, amount) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { xpTotal: { increment: amount } },
            select: { xpTotal: true, league: true },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyGoal = await this.prisma.dailyGoal.upsert({
            where: { userId_date: { userId, date: today } },
            create: { userId, date: today, targetXp: 50, earnedXp: amount },
            update: { earnedXp: { increment: amount } },
        });
        if (!dailyGoal.completed && dailyGoal.earnedXp >= dailyGoal.targetXp) {
            await this.prisma.dailyGoal.update({
                where: { id: dailyGoal.id },
                data: { completed: true },
            });
        }
        const weekStart = this.getWeekStart();
        await this.prisma.leaderboardEntry.upsert({
            where: { userId_weekStarting: { userId, weekStarting: weekStart } },
            create: { userId, league: user.league, weekStarting: weekStart, xpEarned: amount },
            update: { xpEarned: { increment: amount } },
        });
        const streakResult = await this.updateStreak(userId);
        const level = Math.floor(user.xpTotal / XP_PER_LEVEL) + 1;
        const newLeague = this.calculateLeague(user.xpTotal);
        if (newLeague !== user.league) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { league: newLeague },
            });
        }
        return {
            xpAdded: amount,
            xpTotal: user.xpTotal,
            level,
            league: newLeague,
            streak: streakResult,
            dailyGoal: {
                earned: dailyGoal.earnedXp,
                target: dailyGoal.targetXp,
                completed: dailyGoal.earnedXp >= dailyGoal.targetXp,
            },
        };
    }
    async updateStreak(userId) {
        const streak = await this.prisma.streak.findUnique({ where: { userId } });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (!streak) {
            return this.prisma.streak.create({
                data: { userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
            });
        }
        const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
        if (lastActive)
            lastActive.setHours(0, 0, 0, 0);
        const isToday = lastActive?.getTime() === today.getTime();
        if (isToday)
            return streak;
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const isYesterday = lastActive?.getTime() === yesterday.getTime();
        const newStreak = isYesterday ? streak.currentStreak + 1 : 1;
        const longestStreak = Math.max(newStreak, streak.longestStreak);
        return this.prisma.streak.update({
            where: { userId },
            data: { currentStreak: newStreak, longestStreak, lastActiveDate: today },
        });
    }
    async getStreak(userId) {
        const streak = await this.prisma.streak.findUnique({ where: { userId } });
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const goals = await this.prisma.dailyGoal.findMany({
            where: { userId, date: { gte: thirtyDaysAgo }, completed: true },
            select: { date: true },
        });
        return {
            currentStreak: streak?.currentStreak || 0,
            longestStreak: streak?.longestStreak || 0,
            lastActiveDate: streak?.lastActiveDate,
            activeDates: goals.map((g) => g.date),
        };
    }
    async getLeaderboard(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { league: true },
        });
        const weekStart = this.getWeekStart();
        const entries = await this.prisma.leaderboardEntry.findMany({
            where: { league: user.league, weekStarting: weekStart },
            orderBy: { xpEarned: 'desc' },
            take: 30,
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
            },
        });
        return {
            league: user.league,
            weekStarting: weekStart,
            entries: entries.map((e, idx) => ({
                rank: idx + 1,
                userId: e.userId,
                name: e.user.name,
                avatarUrl: e.user.avatarUrl,
                xpEarned: e.xpEarned,
                isCurrentUser: e.userId === userId,
            })),
        };
    }
    async handleStreakFreezeCheck() {
        this.logger.log('[CRON] Checking streak freezes...');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const streaksAtRisk = await this.prisma.streak.findMany({
            where: {
                currentStreak: { gt: 0 },
                lastActiveDate: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            },
            include: {
                user: {
                    include: {
                        inventory: {
                            where: { itemType: 'STREAK_FREEZE', quantity: { gt: 0 } },
                        },
                    },
                },
            },
        });
        for (const streak of streaksAtRisk) {
            if (streak.user.inventory.length > 0) {
                await this.prisma.userItem.update({
                    where: { id: streak.user.inventory[0].id },
                    data: { quantity: { decrement: 1 } },
                });
                await this.prisma.streak.update({
                    where: { id: streak.id },
                    data: { lastActiveDate: new Date(), freezesUsed: { increment: 1 } },
                });
                this.logger.log(`Streak freeze applied for user ${streak.userId}`);
            }
        }
    }
    getWeekStart() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday;
    }
    calculateLeague(xpTotal) {
        if (xpTotal >= LEAGUE_THRESHOLDS.DIAMOND)
            return 'DIAMOND';
        if (xpTotal >= LEAGUE_THRESHOLDS.PLATINUM)
            return 'PLATINUM';
        if (xpTotal >= LEAGUE_THRESHOLDS.GOLD)
            return 'GOLD';
        if (xpTotal >= LEAGUE_THRESHOLDS.SILVER)
            return 'SILVER';
        return 'BRONZE';
    }
};
exports.GamificationService = GamificationService;
__decorate([
    (0, schedule_1.Cron)('0 23 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GamificationService.prototype, "handleStreakFreezeCheck", null);
exports.GamificationService = GamificationService = GamificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map