import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        users: {
            total: number;
            free: number;
            premium: number;
            admin: number;
        };
        stories: {
            total: number;
            published: number;
            draft: number;
        };
        videos: {
            total: number;
            published: number;
            draft: number;
        };
        subscriptions: {
            total: number;
            active: number;
        };
        finance: {
            totalSuccessfulTransactions: number;
            totalRevenueBDT: number;
        };
        b2bOrganizations: number;
    }>;
    getUsers(search?: string, role?: string, page?: number, limit?: number): Promise<{
        users: {
            role: string;
            id: string;
            createdAt: Date;
            name: string;
            email: string | null;
            phone: string | null;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            lives: number;
            gems: number;
            league: import("@prisma/client").$Enums.League;
            xpTotal: number;
            subscriptions: {
                gateway: import("@prisma/client").$Enums.PaymentGateway;
                planType: string;
                expiryDate: Date;
            }[];
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUserRole(userId: string, role: 'FREE' | 'PREMIUM' | 'ADMIN'): Promise<{
        role: string;
        id: string;
        createdAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        avatarUrl: string | null;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        nctbClass: number | null;
        lives: number;
        gems: number;
        league: import("@prisma/client").$Enums.League;
        xpTotal: number;
        lastLifeRefill: Date | null;
        whatsappOptIn: boolean;
        parentId: string | null;
        organizationId: string | null;
        updatedAt: Date;
    }>;
    updateUserStats(userId: string, body: {
        gems?: number;
        lives?: number;
        xpTotal?: number;
    }): Promise<{
        role: string;
        id: string;
        createdAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        avatarUrl: string | null;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        nctbClass: number | null;
        lives: number;
        gems: number;
        league: import("@prisma/client").$Enums.League;
        xpTotal: number;
        lastLifeRefill: Date | null;
        whatsappOptIn: boolean;
        parentId: string | null;
        organizationId: string | null;
        updatedAt: Date;
    }>;
    getAdminStories(search?: string, path?: string, isPublished?: string, page?: number, limit?: number): Promise<{
        stories: ({
            _count: {
                pages: number;
                quizzes: number;
            };
            pages: ({
                sentences: {
                    id: string;
                    pageId: string;
                    sentenceIdx: number;
                    englishText: string;
                    banglaText: string;
                    startTime: number;
                    endTime: number;
                }[];
            } & {
                id: string;
                pageIndex: number;
                storyId: string;
                imageUrl: string;
            })[];
            quizzes: ({
                questions: {
                    id: string;
                    quizId: string;
                    questionText: string;
                    questionTextBn: string | null;
                    options: string[];
                    correctIndex: number;
                    explanation: string | null;
                    xpReward: number;
                }[];
            } & {
                id: string;
                createdAt: Date;
                storyId: string;
            })[];
        } & {
            isPublished: boolean;
            id: string;
            createdAt: Date;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            nctbClass: number | null;
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createStory(body: any): Promise<({
        pages: ({
            sentences: ({
                tokens: {
                    id: string;
                    sentenceId: string;
                    english: string;
                    bangla: string;
                    sentenceContext: string;
                    pronunciationG: string | null;
                }[];
            } & {
                id: string;
                pageId: string;
                sentenceIdx: number;
                englishText: string;
                banglaText: string;
                startTime: number;
                endTime: number;
            })[];
        } & {
            id: string;
            pageIndex: number;
            storyId: string;
            imageUrl: string;
        })[];
        quizzes: ({
            questions: {
                id: string;
                quizId: string;
                questionText: string;
                questionTextBn: string | null;
                options: string[];
                correctIndex: number;
                explanation: string | null;
                xpReward: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            storyId: string;
        })[];
    } & {
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
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
    }) | null>;
    updateStory(id: string, body: any): Promise<{
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
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
    }>;
    deleteStory(id: string): Promise<{
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
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
    }>;
    getStoryDetail(id: string): Promise<{
        _count: {
            pages: number;
            quizzes: number;
        };
        pages: ({
            sentences: ({
                tokens: {
                    id: string;
                    sentenceId: string;
                    english: string;
                    bangla: string;
                    sentenceContext: string;
                    pronunciationG: string | null;
                }[];
            } & {
                id: string;
                pageId: string;
                sentenceIdx: number;
                englishText: string;
                banglaText: string;
                startTime: number;
                endTime: number;
            })[];
        } & {
            id: string;
            pageIndex: number;
            storyId: string;
            imageUrl: string;
        })[];
        quizzes: ({
            questions: {
                id: string;
                quizId: string;
                questionText: string;
                questionTextBn: string | null;
                options: string[];
                correctIndex: number;
                explanation: string | null;
                xpReward: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            storyId: string;
        })[];
    } & {
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
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
    }>;
    regenerateStoryContent(id: string): Promise<({
        _count: {
            pages: number;
            quizzes: number;
        };
        pages: ({
            sentences: ({
                tokens: {
                    id: string;
                    sentenceId: string;
                    english: string;
                    bangla: string;
                    sentenceContext: string;
                    pronunciationG: string | null;
                }[];
            } & {
                id: string;
                pageId: string;
                sentenceIdx: number;
                englishText: string;
                banglaText: string;
                startTime: number;
                endTime: number;
            })[];
        } & {
            id: string;
            pageIndex: number;
            storyId: string;
            imageUrl: string;
        })[];
        quizzes: ({
            questions: {
                id: string;
                quizId: string;
                questionText: string;
                questionTextBn: string | null;
                options: string[];
                correctIndex: number;
                explanation: string | null;
                xpReward: number;
            }[];
        } & {
            id: string;
            createdAt: Date;
            storyId: string;
        })[];
    } & {
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
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
    }) | null>;
    addPageToStory(storyId: string, body: {
        pageIndex: number;
        imageUrl: string;
    }): Promise<{
        id: string;
        pageIndex: number;
        storyId: string;
        imageUrl: string;
    }>;
    addSentenceToPage(pageId: string, body: {
        sentenceIdx: number;
        englishText: string;
        banglaText: string;
        startTime: number;
        endTime: number;
    }): Promise<{
        id: string;
        pageId: string;
        sentenceIdx: number;
        englishText: string;
        banglaText: string;
        startTime: number;
        endTime: number;
    }>;
    getAdminVideos(search?: string, isPublished?: string, page?: number, limit?: number): Promise<{
        videos: {
            isPublished: boolean;
            id: string;
            createdAt: Date;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            nctbClass: number | null;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            isPremium: boolean;
            durationSeconds: number;
            tags: string[];
            youtubeId: string;
            thumbnailUrl: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createVideo(body: any): Promise<{
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        isPremium: boolean;
        durationSeconds: number;
        tags: string[];
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    updateVideo(id: string, body: any): Promise<{
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        isPremium: boolean;
        durationSeconds: number;
        tags: string[];
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    deleteVideo(id: string): Promise<{
        isPublished: boolean;
        id: string;
        createdAt: Date;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        nctbClass: number | null;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        isPremium: boolean;
        durationSeconds: number;
        tags: string[];
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    getSubscriptions(status?: string, page?: number, limit?: number): Promise<{
        subscriptions: ({
            user: {
                id: string;
                name: string;
                email: string | null;
                phone: string | null;
            };
        } & {
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            id: string;
            userId: string;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            createdAt: Date;
            updatedAt: Date;
            planType: string;
            seatCount: number;
            expiryDate: Date;
            subscriptionId: string | null;
            autoRenew: boolean;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    grantSubscription(userId: string, planType: string, days?: number): Promise<{
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        id: string;
        userId: string;
        gateway: import("@prisma/client").$Enums.PaymentGateway;
        createdAt: Date;
        updatedAt: Date;
        planType: string;
        seatCount: number;
        expiryDate: Date;
        subscriptionId: string | null;
        autoRenew: boolean;
    }>;
    getTransactions(status?: string, page?: number, limit?: number): Promise<{
        transactions: ({
            user: {
                id: string;
                name: string;
                email: string | null;
                phone: string | null;
            };
        } & {
            status: string;
            id: string;
            userId: string;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            transactionId: string;
            amount: number;
            currency: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            createdAt: Date;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getB2BOrganizations(): Promise<({
        _count: {
            members: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        type: string;
        licenseCount: number;
        adminId: string;
        contactPerson: string | null;
        contactPhone: string | null;
        customBranding: import("@prisma/client/runtime/client").JsonValue | null;
        nctbClassFocus: number[];
        contractEnd: Date | null;
        monthlyReportDay: number;
    })[]>;
}
