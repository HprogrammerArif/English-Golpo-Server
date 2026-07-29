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
export declare class AddMistakeDto {
    type: string;
    englishText: string;
    banglaText: string;
}
export declare class ResolveMistakeDto {
    id: string;
}
export declare class ToggleLearnedDto {
    word: string;
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
        isLearned: boolean;
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
            isLearned: boolean;
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
    getMistakes(userId: string): Promise<{
        id: string;
        createdAt: Date;
        englishText: string;
        banglaText: string;
        updatedAt: Date;
        type: string;
        userId: string;
        incorrectCount: number;
        corrected: boolean;
    }[]>;
    addMistake(userId: string, dto: AddMistakeDto): Promise<{
        id: string;
        createdAt: Date;
        englishText: string;
        banglaText: string;
        updatedAt: Date;
        type: string;
        userId: string;
        incorrectCount: number;
        corrected: boolean;
    }>;
    resolveMistake(userId: string, mistakeId: string): Promise<{
        id: string;
        createdAt: Date;
        englishText: string;
        banglaText: string;
        updatedAt: Date;
        type: string;
        userId: string;
        incorrectCount: number;
        corrected: boolean;
    }>;
    getSentencePatterns(): Promise<{
        id: string;
        createdAt: Date;
        pattern: string;
        patternBn: string;
        exampleEn: string;
        exampleBn: string;
        category: string;
    }[]>;
    getLearnedWords(userId: string): Promise<{
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
        isLearned: boolean;
    }[]>;
    toggleLearnedWord(userId: string, word: string): Promise<{
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
        isLearned: boolean;
    }>;
}
