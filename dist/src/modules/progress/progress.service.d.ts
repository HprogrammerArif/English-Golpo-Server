import { PrismaService } from '../../prisma/prisma.service';
export declare class ProgressSyncItemDto {
    storyId: string;
    completed: boolean;
    score: number;
    xpEarned: number;
}
export declare class SyncProgressDto {
    items: ProgressSyncItemDto[];
}
export declare class AddBookmarkDto {
    englishWord: string;
    banglaMeaning: string;
    context: string;
    wordTokenId?: string;
}
export declare class FlashcardResultDto {
    word: string;
    quality: number;
}
export declare class ProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    syncProgress(userId: string, dto: SyncProgressDto): Promise<{
        synced: number;
    }>;
    addBookmark(userId: string, dto: AddBookmarkDto): Promise<{
        id: string;
        userId: string;
        englishWord: string;
        banglaMeaning: string;
        context: string;
        wordTokenId: string | null;
        savedAt: Date;
        nextReviewAt: Date;
        interval: number;
        easeFactor: number;
        repetitions: number;
    }>;
    removeBookmark(userId: string, word: string): Promise<{
        removed: string;
    }>;
    getBookmarks(userId: string, page?: number, limit?: number): Promise<{
        bookmarks: {
            id: string;
            userId: string;
            englishWord: string;
            banglaMeaning: string;
            context: string;
            wordTokenId: string | null;
            savedAt: Date;
            nextReviewAt: Date;
            interval: number;
            easeFactor: number;
            repetitions: number;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getFlashcardQueue(userId: string): Promise<{
        cards: {
            id: string;
            englishWord: string;
            banglaMeaning: string;
            context: string;
            interval: number;
            repetitions: number;
        }[];
        count: number;
    }>;
    recordFlashcardResult(userId: string, dto: FlashcardResultDto): Promise<{
        skipped: boolean;
        word?: undefined;
        nextReviewAt?: undefined;
        interval?: undefined;
    } | {
        word: string;
        nextReviewAt: Date;
        interval: number;
        skipped?: undefined;
    }>;
}
