import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
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
    getUsers(query: {
        search?: string;
        role?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        users: {
            id: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            createdAt: Date;
            name: string;
            email: string | null;
            phone: string | null;
            role: string;
            lives: number;
            gems: number;
            league: import("@prisma/client").$Enums.League;
            xpTotal: number;
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
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        nctbClass: number | null;
        createdAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        avatarUrl: string | null;
        role: string;
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
    updateUserStats(userId: string, data: {
        gems?: number;
        lives?: number;
        xpTotal?: number;
    }): Promise<{
        id: string;
        learningPath: import("@prisma/client").$Enums.LearningPath | null;
        nctbClass: number | null;
        createdAt: Date;
        name: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        avatarUrl: string | null;
        role: string;
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
    getAdminStories(query: {
        search?: string;
        path?: string;
        isPublished?: boolean | string;
        page?: number;
        limit?: number;
    }): Promise<{
        stories: ({
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
            _count: {
                pages: number;
                quizzes: number;
            };
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createStory(data: any): Promise<({
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
    }) | null>;
    getStoryDetail(storyId: string): Promise<{
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
        _count: {
            pages: number;
            quizzes: number;
        };
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
    }>;
    autoGenerateContent(storyId: string): Promise<void>;
    regenerateStoryContent(storyId: string): Promise<({
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
        _count: {
            pages: number;
            quizzes: number;
        };
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
    }) | null>;
    private splitRawSentences;
    private splitIntoSentences;
    private extractBilingualSentences;
    private extractVocabWithAI;
    private callOpenAI;
    private readonly vocabDict;
    private _generatePagesAndTokens;
    updateStory(id: string, data: any): Promise<{
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
    }>;
    deleteStory(id: string): Promise<{
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
    }>;
    addPageToStory(storyId: string, pageIndex: number, imageUrl: string): Promise<{
        storyId: string;
        id: string;
        pageIndex: number;
        imageUrl: string;
    }>;
    addSentenceToPage(pageId: string, data: {
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
    getAdminVideos(query: {
        search?: string;
        isPublished?: boolean | string;
        page?: number;
        limit?: number;
    }): Promise<{
        videos: {
            id: string;
            title: string;
            titleBn: string;
            description: string;
            descriptionBn: string;
            level: number;
            learningPath: import("@prisma/client").$Enums.LearningPath;
            isPremium: boolean;
            nctbClass: number | null;
            durationSeconds: number;
            tags: string[];
            isPublished: boolean;
            createdAt: Date;
            youtubeId: string | null;
            thumbnailUrl: string;
            videoType: import("@prisma/client").$Enums.VideoType;
            videoUrl: string | null;
            contributorId: string | null;
            targetChildId: string | null;
            approved: boolean;
            payoutAmount: number;
            payoutStatus: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    createVideo(data: any): Promise<{
        id: string;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        isPremium: boolean;
        nctbClass: number | null;
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        createdAt: Date;
        youtubeId: string | null;
        thumbnailUrl: string;
        videoType: import("@prisma/client").$Enums.VideoType;
        videoUrl: string | null;
        contributorId: string | null;
        targetChildId: string | null;
        approved: boolean;
        payoutAmount: number;
        payoutStatus: string;
    }>;
    updateVideo(id: string, data: any): Promise<{
        id: string;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        isPremium: boolean;
        nctbClass: number | null;
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        createdAt: Date;
        youtubeId: string | null;
        thumbnailUrl: string;
        videoType: import("@prisma/client").$Enums.VideoType;
        videoUrl: string | null;
        contributorId: string | null;
        targetChildId: string | null;
        approved: boolean;
        payoutAmount: number;
        payoutStatus: string;
    }>;
    deleteVideo(id: string): Promise<{
        id: string;
        title: string;
        titleBn: string;
        description: string;
        descriptionBn: string;
        level: number;
        learningPath: import("@prisma/client").$Enums.LearningPath;
        isPremium: boolean;
        nctbClass: number | null;
        durationSeconds: number;
        tags: string[];
        isPublished: boolean;
        createdAt: Date;
        youtubeId: string | null;
        thumbnailUrl: string;
        videoType: import("@prisma/client").$Enums.VideoType;
        videoUrl: string | null;
        contributorId: string | null;
        targetChildId: string | null;
        approved: boolean;
        payoutAmount: number;
        payoutStatus: string;
    }>;
    getSubscriptions(query: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        subscriptions: ({
            user: {
                id: string;
                name: string;
                email: string | null;
                phone: string | null;
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
    getTransactions(query: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        transactions: ({
            user: {
                id: string;
                name: string;
                email: string | null;
                phone: string | null;
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
        createdAt: Date;
        name: string;
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
    getContributions(query: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        contributions: ({
            contributor: {
                id: string;
                name: string;
                email: string | null;
                phone: string | null;
            };
        } & {
            id: string;
            title: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            contributorId: string;
            targetChildId: string | null;
            payoutAmount: number;
            payoutStatus: string;
            status: string;
            contentType: string;
            fileUrl: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    approveContribution(id: string, body: {
        payoutAmount?: number;
    }): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        contributorId: string;
        targetChildId: string | null;
        payoutAmount: number;
        payoutStatus: string;
        status: string;
        contentType: string;
        fileUrl: string;
    }>;
    rejectContribution(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        contributorId: string;
        targetChildId: string | null;
        payoutAmount: number;
        payoutStatus: string;
        status: string;
        contentType: string;
        fileUrl: string;
    }>;
    markContributionPayoutPaid(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        contributorId: string;
        targetChildId: string | null;
        payoutAmount: number;
        payoutStatus: string;
        status: string;
        contentType: string;
        fileUrl: string;
    }>;
}
