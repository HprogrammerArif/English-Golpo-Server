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
            learningPath: import("@prisma/client").$Enums.LearningPath;
            nctbClass: number | null;
            createdAt: Date;
            _count: {
                pages: number;
            };
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            isPremium: boolean;
            nctbUnit: string | null;
            illustrationUrl: string;
            durationSeconds: number;
            wordCount: number;
            tags: string[];
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
            learningPath: import("@prisma/client").$Enums.LearningPath;
            nctbClass: number | null;
            createdAt: Date;
            _count: {
                pages: number;
            };
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            isPremium: boolean;
            nctbUnit: string | null;
            illustrationUrl: string;
            durationSeconds: number;
            wordCount: number;
            tags: string[];
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
                id: string;
                pageIndex: number;
                imageUrl: string;
                storyId: string;
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
                id: string;
                createdAt: Date;
                storyId: string;
            })[];
        } & {
            id: string;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            nctbClass: number | null;
            createdAt: Date;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            isPremium: boolean;
            nctbUnit: string | null;
            illustrationUrl: string;
            audioUrl: string;
            durationSeconds: number;
            wordCount: number;
            tags: string[];
            isPublished: boolean;
        };
        progress: {
            id: string;
            updatedAt: Date;
            userId: string;
            storyId: string;
            completed: boolean;
            score: number;
            xpEarned: number;
        } | null;
    }>;
}
