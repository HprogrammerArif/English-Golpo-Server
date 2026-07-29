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
            id: string;
            email: string | null;
            phone: string | null;
            name: string;
            role: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            lives: number;
            gems: number;
            league: import("@prisma/client").$Enums.League;
            xpTotal: number;
            createdAt: Date;
            subscriptions: {
                expiryDate: Date;
                gateway: import("@prisma/client").$Enums.PaymentGateway;
                planType: string;
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
        id: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        name: string;
        avatarUrl: string | null;
        role: string;
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUserStats(userId: string, body: {
        gems?: number;
        lives?: number;
        xpTotal?: number;
    }): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        name: string;
        avatarUrl: string | null;
        role: string;
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
        createdAt: Date;
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
                    sentenceIdx: number;
                    englishText: string;
                    banglaText: string;
                    startTime: number;
                    endTime: number;
                    pageId: string;
                }[];
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createStory(body: any): Promise<{
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
    }>;
    updateStory(id: string, body: any): Promise<{
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
    }>;
    deleteStory(id: string): Promise<{
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
    }>;
    addPageToStory(storyId: string, body: {
        pageIndex: number;
        imageUrl: string;
    }): Promise<{
        id: string;
        pageIndex: number;
        imageUrl: string;
        storyId: string;
    }>;
    addSentenceToPage(pageId: string, body: {
        sentenceIdx: number;
        englishText: string;
        banglaText: string;
        startTime: number;
        endTime: number;
    }): Promise<{
        id: string;
        sentenceIdx: number;
        englishText: string;
        banglaText: string;
        startTime: number;
        endTime: number;
        pageId: string;
    }>;
    getAdminVideos(search?: string, isPublished?: string, page?: number, limit?: number): Promise<{
        videos: {
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
            durationSeconds: number;
            tags: string[];
            isPublished: boolean;
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
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    updateVideo(id: string, body: any): Promise<{
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
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    deleteVideo(id: string): Promise<{
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
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        youtubeId: string;
        thumbnailUrl: string;
    }>;
    getSubscriptions(status?: string, page?: number, limit?: number): Promise<{
        subscriptions: ({
            user: {
                id: string;
                email: string | null;
                phone: string | null;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.SubscriptionStatus;
            expiryDate: Date;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            planType: string;
            seatCount: number;
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.SubscriptionStatus;
        expiryDate: Date;
        gateway: import("@prisma/client").$Enums.PaymentGateway;
        planType: string;
        seatCount: number;
        subscriptionId: string | null;
        autoRenew: boolean;
    }>;
    getTransactions(status?: string, page?: number, limit?: number): Promise<{
        transactions: ({
            user: {
                id: string;
                email: string | null;
                phone: string | null;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            status: string;
            gateway: import("@prisma/client").$Enums.PaymentGateway;
            transactionId: string;
            amount: number;
            currency: string;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
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
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        licenseCount: number;
        contactPhone: string | null;
        adminId: string;
        contactPerson: string | null;
        customBranding: import("@prisma/client/runtime/client").JsonValue | null;
        nctbClassFocus: number[];
        contractEnd: Date | null;
        monthlyReportDay: number;
    })[]>;
}
