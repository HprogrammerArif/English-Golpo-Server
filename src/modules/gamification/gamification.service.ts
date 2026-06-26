import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

const XP_PER_LEVEL = 100;
const LEAGUE_THRESHOLDS = {
  BRONZE: 0,
  SILVER: 500,
  GOLD: 2000,
  PLATINUM: 5000,
  DIAMOND: 10000,
};

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── Add XP ───────────────────────────────────────────────────────────────

  async addXp(userId: string, amount: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { xpTotal: { increment: amount } },
      select: { xpTotal: true, league: true },
    });

    // Update daily goal
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyGoal = await this.prisma.dailyGoal.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, targetXp: 50, earnedXp: amount },
      update: { earnedXp: { increment: amount } },
    });

    // Mark daily goal complete
    if (!dailyGoal.completed && dailyGoal.earnedXp >= dailyGoal.targetXp) {
      await this.prisma.dailyGoal.update({
        where: { id: dailyGoal.id },
        data: { completed: true },
      });
    }

    // Update weekly leaderboard
    const weekStart = this.getWeekStart();
    await this.prisma.leaderboardEntry.upsert({
      where: { userId_weekStarting: { userId, weekStarting: weekStart } },
      create: { userId, league: user.league, weekStarting: weekStart, xpEarned: amount },
      update: { xpEarned: { increment: amount } },
    });

    // Update streak
    const streakResult = await this.updateStreak(userId);

    // Calculate level
    const level = Math.floor(user.xpTotal / XP_PER_LEVEL) + 1;

    // Check league promotion
    const newLeague = this.calculateLeague(user.xpTotal);
    if (newLeague !== user.league) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { league: newLeague as any },
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

  // ─── Streak ───────────────────────────────────────────────────────────────

  async updateStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!streak) {
      return this.prisma.streak.create({
        data: { userId, currentStreak: 1, longestStreak: 1, lastActiveDate: today },
      });
    }

    const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;
    if (lastActive) lastActive.setHours(0, 0, 0, 0);

    const isToday = lastActive?.getTime() === today.getTime();
    if (isToday) return streak; // Already counted today

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

  async getStreak(userId: string) {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    // Build last 30 days activity calendar
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

  // ─── Leaderboard ──────────────────────────────────────────────────────────

  async getLeaderboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { league: true },
    });
    const weekStart = this.getWeekStart();

    const entries = await this.prisma.leaderboardEntry.findMany({
      where: { league: user!.league, weekStarting: weekStart },
      orderBy: { xpEarned: 'desc' },
      take: 30,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });

    return {
      league: user!.league,
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

  // ─── Scheduled: Daily streak freeze check ─────────────────────────────────

  @Cron('0 23 * * *') // Run at 11PM every day
  async handleStreakFreezeCheck() {
    this.logger.log('[CRON] Checking streak freezes...');
    // Users with active streak but no activity today AND a freeze item → auto-apply
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
        // Consume freeze
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

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private getWeekStart(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  private calculateLeague(xpTotal: number): string {
    if (xpTotal >= LEAGUE_THRESHOLDS.DIAMOND) return 'DIAMOND';
    if (xpTotal >= LEAGUE_THRESHOLDS.PLATINUM) return 'PLATINUM';
    if (xpTotal >= LEAGUE_THRESHOLDS.GOLD) return 'GOLD';
    if (xpTotal >= LEAGUE_THRESHOLDS.SILVER) return 'SILVER';
    return 'BRONZE';
  }
}
