import { ProgressService, SyncProgressDto, AddBookmarkDto, FlashcardResultDto } from './progress.service';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    sync(user: {
        id: string;
    }, dto: SyncProgressDto): Promise<{
        synced: number;
    }>;
    getBookmarks(user: {
        id: string;
    }, page: number, limit: number): Promise<{
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
    addBookmark(user: {
        id: string;
    }, dto: AddBookmarkDto): Promise<{
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
    removeBookmark(user: {
        id: string;
    }, word: string): Promise<{
        removed: string;
    }>;
    getFlashcardQueue(user: {
        id: string;
    }): Promise<{
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
    recordFlashcardResult(user: {
        id: string;
    }, dto: FlashcardResultDto): Promise<{
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
