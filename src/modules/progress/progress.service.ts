import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsBoolean, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProgressSyncItemDto {
  @ApiProperty() @IsString() storyId: string;
  @ApiProperty() @IsBoolean() completed: boolean;
  @ApiProperty() @IsNumber() score: number;
  @ApiProperty() @IsNumber() xpEarned: number;
}

export class SyncProgressDto {
  @ApiProperty({ type: [ProgressSyncItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgressSyncItemDto)
  items: ProgressSyncItemDto[];
}

export class AddBookmarkDto {
  @ApiProperty() @IsString() englishWord: string;
  @ApiProperty() @IsString() banglaMeaning: string;
  @ApiProperty() @IsString() context: string;
  @ApiPropertyOptional() @IsOptional() @IsString() wordTokenId?: string;
}

export class FlashcardResultDto {
  @ApiProperty() @IsString() word: string;
  @ApiProperty({ description: '0=blackout, 1=wrong, 2=wrong+easy, 3=correct+hard, 4=correct, 5=perfect' })
  @IsNumber() quality: number; // 0-5
}

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async syncProgress(userId: string, dto: SyncProgressDto) {
    const results = await Promise.all(
      dto.items.map((item) =>
        this.prisma.userProgress.upsert({
          where: { userId_storyId: { userId, storyId: item.storyId } },
          create: {
            userId,
            storyId: item.storyId,
            completed: item.completed,
            score: item.score,
            xpEarned: item.xpEarned,
          },
          update: {
            completed: item.completed,
            score: item.score,
            xpEarned: { increment: item.xpEarned },
          },
        }),
      ),
    );
    return { synced: results.length };
  }

  async addBookmark(userId: string, dto: AddBookmarkDto) {
    return this.prisma.bookmark.upsert({
      where: { userId_englishWord: { userId, englishWord: dto.englishWord } },
      create: {
        userId,
        wordTokenId: dto.wordTokenId,
        englishWord: dto.englishWord,
        banglaMeaning: dto.banglaMeaning,
        context: dto.context,
        nextReviewAt: new Date(),
      },
      update: {
        banglaMeaning: dto.banglaMeaning,
        context: dto.context,
      },
    });
  }

  async removeBookmark(userId: string, word: string) {
    await this.prisma.bookmark.deleteMany({
      where: { userId, englishWord: word },
    });
    return { removed: word };
  }

  async getBookmarks(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [bookmarks, total] = await this.prisma.$transaction([
      this.prisma.bookmark.findMany({
        where: { userId },
        orderBy: { savedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.bookmark.count({ where: { userId } }),
    ]);
    return { bookmarks, pagination: { page, limit, total } };
  }

  // ─── Spaced Repetition (SM-2 Algorithm) ──────────────────────────────────

  async getFlashcardQueue(userId: string) {
    const now = new Date();
    const cards = await this.prisma.bookmark.findMany({
      where: { userId, nextReviewAt: { lte: now } },
      orderBy: { nextReviewAt: 'asc' },
      take: 10,
      select: {
        id: true,
        englishWord: true,
        banglaMeaning: true,
        context: true,
        interval: true,
        repetitions: true,
      },
    });
    return { cards, count: cards.length };
  }

  async recordFlashcardResult(userId: string, dto: FlashcardResultDto) {
    const bookmark = await this.prisma.bookmark.findFirst({
      where: { userId, englishWord: dto.word },
    });
    if (!bookmark) return { skipped: true };

    // SM-2 Algorithm
    const q = Math.max(0, Math.min(5, dto.quality));
    let { interval, easeFactor, repetitions } = bookmark;

    if (q < 3) {
      // Incorrect — reset
      interval = 1;
      repetitions = 0;
    } else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    }

    // Adjust ease factor
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + interval);

    await this.prisma.bookmark.update({
      where: { id: bookmark.id },
      data: { interval, easeFactor, repetitions, nextReviewAt },
    });

    await this.prisma.flashcardReview.create({
      data: { userId, word: dto.word, quality: q },
    });

    return { word: dto.word, nextReviewAt, interval };
  }
}
