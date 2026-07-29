"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, freeUsers, premiumUsers, adminUsers, totalStories, publishedStories, totalVideos, publishedVideos, totalSubscriptions, activeSubscriptions, transactions, b2bCount,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'FREE' } }),
            this.prisma.user.count({ where: { role: 'PREMIUM' } }),
            this.prisma.user.count({ where: { role: 'ADMIN' } }),
            this.prisma.story.count(),
            this.prisma.story.count({ where: { isPublished: true } }),
            this.prisma.videoLesson.count(),
            this.prisma.videoLesson.count({ where: { isPublished: true } }),
            this.prisma.subscription.count(),
            this.prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            this.prisma.paymentTransaction.findMany({
                where: { status: 'SUCCESS' },
                select: { amount: true },
            }),
            this.prisma.b2BOrganization.count(),
        ]);
        const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount, 0);
        return {
            users: { total: totalUsers, free: freeUsers, premium: premiumUsers, admin: adminUsers },
            stories: { total: totalStories, published: publishedStories, draft: totalStories - publishedStories },
            videos: { total: totalVideos, published: publishedVideos, draft: totalVideos - publishedVideos },
            subscriptions: { total: totalSubscriptions, active: activeSubscriptions },
            finance: { totalSuccessfulTransactions: transactions.length, totalRevenueBDT: totalRevenue },
            b2bOrganizations: b2bCount,
        };
    }
    async getUsers(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.role)
            where.role = query.role;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
                { phone: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    role: true,
                    learningPath: true,
                    xpTotal: true,
                    gems: true,
                    lives: true,
                    league: true,
                    createdAt: true,
                    subscriptions: {
                        where: { status: 'ACTIVE' },
                        take: 1,
                        select: { planType: true, expiryDate: true, gateway: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async updateUserRole(userId, role) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    }
    async updateUserStats(userId, data) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(data.gems !== undefined && { gems: Number(data.gems) }),
                ...(data.lives !== undefined && { lives: Number(data.lives) }),
                ...(data.xpTotal !== undefined && { xpTotal: Number(data.xpTotal) }),
            },
        });
    }
    async getAdminStories(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.path)
            where.learningPath = query.path;
        if (query.isPublished !== undefined) {
            where.isPublished = query.isPublished === 'true' || query.isPublished === true;
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { titleBn: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [stories, total] = await this.prisma.$transaction([
            this.prisma.story.findMany({
                where,
                include: {
                    pages: {
                        orderBy: { pageIndex: 'asc' },
                        include: {
                            sentences: true,
                        },
                    },
                    quizzes: {
                        include: { questions: true },
                    },
                    _count: { select: { pages: true, quizzes: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.story.count({ where }),
        ]);
        return {
            stories,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async createStory(data) {
        return this.prisma.story.create({
            data: {
                title: data.title,
                titleBn: data.titleBn,
                description: data.description || '',
                descriptionBn: data.descriptionBn || '',
                level: Number(data.level) || 1,
                learningPath: data.learningPath,
                isPremium: Boolean(data.isPremium),
                nctbClass: data.nctbClass ? Number(data.nctbClass) : null,
                nctbUnit: data.nctbUnit || null,
                illustrationUrl: data.illustrationUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                audioUrl: data.audioUrl || '',
                durationSeconds: Number(data.durationSeconds) || 0,
                wordCount: Number(data.wordCount) || 0,
                tags: Array.isArray(data.tags) ? data.tags : [],
                isPublished: Boolean(data.isPublished),
            },
        });
    }
    async updateStory(id, data) {
        const story = await this.prisma.story.findUnique({ where: { id } });
        if (!story)
            throw new common_1.NotFoundException('Story not found');
        const updateData = { ...data };
        if (data.level !== undefined)
            updateData.level = Number(data.level);
        if (data.nctbClass !== undefined)
            updateData.nctbClass = data.nctbClass ? Number(data.nctbClass) : null;
        if (data.durationSeconds !== undefined)
            updateData.durationSeconds = Number(data.durationSeconds);
        if (data.wordCount !== undefined)
            updateData.wordCount = Number(data.wordCount);
        if (data.isPremium !== undefined)
            updateData.isPremium = Boolean(data.isPremium);
        if (data.isPublished !== undefined)
            updateData.isPublished = Boolean(data.isPublished);
        return this.prisma.story.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteStory(id) {
        const story = await this.prisma.story.findUnique({ where: { id } });
        if (!story)
            throw new common_1.NotFoundException('Story not found');
        return this.prisma.story.delete({ where: { id } });
    }
    async addPageToStory(storyId, pageIndex, imageUrl) {
        return this.prisma.storyPage.create({
            data: {
                storyId,
                pageIndex: Number(pageIndex),
                imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
            },
        });
    }
    async addSentenceToPage(pageId, data) {
        return this.prisma.sentence.create({
            data: {
                pageId,
                sentenceIdx: Number(data.sentenceIdx),
                englishText: data.englishText,
                banglaText: data.banglaText,
                startTime: Number(data.startTime) || 0,
                endTime: Number(data.endTime) || 0,
            },
        });
    }
    async getAdminVideos(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.isPublished !== undefined) {
            where.isPublished = query.isPublished === 'true' || query.isPublished === true;
        }
        if (query.search) {
            where.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { titleBn: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        const [videos, total] = await this.prisma.$transaction([
            this.prisma.videoLesson.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.videoLesson.count({ where }),
        ]);
        return {
            videos,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async createVideo(data) {
        return this.prisma.videoLesson.create({
            data: {
                title: data.title,
                titleBn: data.titleBn,
                description: data.description || '',
                descriptionBn: data.descriptionBn || '',
                youtubeId: data.youtubeId,
                thumbnailUrl: data.thumbnailUrl || `https://img.youtube.com/vi/${data.youtubeId}/hqdefault.jpg`,
                durationSeconds: Number(data.durationSeconds) || 0,
                learningPath: data.learningPath,
                level: Number(data.level) || 1,
                nctbClass: data.nctbClass ? Number(data.nctbClass) : null,
                tags: Array.isArray(data.tags) ? data.tags : [],
                isPremium: Boolean(data.isPremium),
                isPublished: Boolean(data.isPublished),
            },
        });
    }
    async updateVideo(id, data) {
        const updateData = { ...data };
        if (data.level !== undefined)
            updateData.level = Number(data.level);
        if (data.nctbClass !== undefined)
            updateData.nctbClass = data.nctbClass ? Number(data.nctbClass) : null;
        if (data.durationSeconds !== undefined)
            updateData.durationSeconds = Number(data.durationSeconds);
        if (data.isPremium !== undefined)
            updateData.isPremium = Boolean(data.isPremium);
        if (data.isPublished !== undefined)
            updateData.isPublished = Boolean(data.isPublished);
        return this.prisma.videoLesson.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteVideo(id) {
        return this.prisma.videoLesson.delete({ where: { id } });
    }
    async getSubscriptions(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        const [subscriptions, total] = await this.prisma.$transaction([
            this.prisma.subscription.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.subscription.count({ where }),
        ]);
        return { subscriptions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async grantSubscription(userId, planType, days = 30) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + Number(days));
        await this.prisma.user.update({
            where: { id: userId },
            data: { role: 'PREMIUM' },
        });
        return this.prisma.subscription.create({
            data: {
                userId,
                gateway: 'BKASH',
                status: 'ACTIVE',
                planType: planType || 'MONTHLY',
                expiryDate,
                autoRenew: false,
            },
        });
    }
    async getTransactions(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status)
            where.status = query.status;
        const [transactions, total] = await this.prisma.$transaction([
            this.prisma.paymentTransaction.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.paymentTransaction.count({ where }),
        ]);
        return { transactions, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
    async getB2BOrganizations() {
        return this.prisma.b2BOrganization.findMany({
            include: {
                _count: { select: { members: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map