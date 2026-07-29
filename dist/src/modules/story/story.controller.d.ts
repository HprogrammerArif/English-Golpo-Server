import { StoryService } from './story.service';
export declare class StoryController {
    private readonly storyService;
    constructor(storyService: StoryService);
    getLearningPaths(): Promise<{
        id: string;
        label: string;
        labelBn: string;
        icon: string;
        color: string;
    }[]>;
    getStories(user: {
        id: string;
        role: string;
    }, path?: string, level?: number, page?: number, limit?: number): Promise<{
        stories: {
            id: string;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            isPremium: boolean;
            nctbClass: number | null;
            nctbUnit: string | null;
            illustrationUrl: string;
            durationSeconds: number;
            wordCount: number;
            tags: string[];
            createdAt: Date;
            _count: {
                pages: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        paywallTriggered: boolean;
        freeStoriesRemaining: number;
    } | {
        stories: {
            id: string;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            isPremium: boolean;
            nctbClass: number | null;
            nctbUnit: string | null;
            illustrationUrl: string;
            durationSeconds: number;
            wordCount: number;
            tags: string[];
            createdAt: Date;
            _count: {
                pages: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        paywallTriggered: boolean;
        freeStoriesRemaining?: undefined;
    }>;
    getStory(id: string, user: {
        id: string;
        role: string;
    }): Promise<{
        story: {
            pages: ({
                sentences: ({
                    tokens: {
                        id: string;
                        english: string;
                        bangla: string;
                        sentenceContext: string;
                        pronunciationG: string | null;
                        sentenceId: string;
                    }[];
                } & {
                    id: string;
                    sentenceIdx: number;
                    englishText: string;
                    banglaText: string;
                    startTime: number;
                    endTime: number;
                    pageId: string;
                })[];
            } & {
                storyId: string;
                id: string;
                pageIndex: number;
                imageUrl: string;
            })[];
            quizzes: ({
                questions: {
                    id: string;
                    questionText: string;
                    questionTextBn: string | null;
                    options: string[];
                    correctIndex: number;
                    explanation: string | null;
                    xpReward: number;
                    quizId: string;
                }[];
            } & {
                storyId: string;
                id: string;
                createdAt: Date;
            })[];
        } & {
            id: string;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            isPremium: boolean;
            nctbClass: number | null;
            nctbUnit: string | null;
            illustrationUrl: string;
            audioUrl: string;
            durationSeconds: number;
            wordCount: number;
            tags: string[];
            isPublished: boolean;
            createdAt: Date;
        };
        progress: {
            storyId: string;
            id: string;
            updatedAt: Date;
            userId: string;
            completed: boolean;
            score: number;
            xpEarned: number;
        } | null;
    }>;
}
