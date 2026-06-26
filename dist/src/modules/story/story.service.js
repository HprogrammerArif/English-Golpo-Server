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
exports.StoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const FREE_STORY_LIMIT = 40;
let StoryService = class StoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLearningPaths() {
        return [
            { id: 'KIDS', label: 'Kids English', labelBn: 'বাচ্চাদের ইংরেজি', icon: '🧒', color: '#10B981' },
            { id: 'SPOKEN', label: 'Spoken English', labelBn: 'স্পোকেন ইংলিশ', icon: '🗣️', color: '#3B82F6' },
            { id: 'IELTS', label: 'IELTS Prep', labelBn: 'IELTS প্রস্তুতি', icon: '📚', color: '#8B5CF6' },
            { id: 'ADMISSION', label: 'Admission English', labelBn: 'ভর্তি পরীক্ষা', icon: '🎓', color: '#F59E0B' },
            { id: 'JOB', label: 'Job English', labelBn: 'চাকরির ইংরেজি', icon: '💼', color: '#EF4444' },
            { id: 'VOCAB', label: 'Vocabulary', labelBn: 'শব্দভাণ্ডার', icon: '📖', color: '#06B6D4' },
        ];
    }
    async getStories(userId, userRole, learningPath, level, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const isPremium = userRole === 'PREMIUM' || userRole === 'ADMIN';
        const where = {
            isPublished: true,
            ...(learningPath && { learningPath: learningPath }),
            ...(level && { level }),
        };
        const [stories, total] = await this.prisma.$transaction([
            this.prisma.story.findMany({
                where,
                select: {
                    id: true,
                    title: true,
                    titleBn: true,
                    description: true,
                    descriptionBn: true,
                    level: true,
                    learningPath: true,
                    isPremium: true,
                    nctbClass: true,
                    nctbUnit: true,
                    illustrationUrl: true,
                    durationSeconds: true,
                    wordCount: true,
                    tags: true,
                    createdAt: true,
                    _count: { select: { pages: true } },
                },
                orderBy: [{ level: 'asc' }, { createdAt: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.story.count({ where }),
        ]);
        if (!isPremium) {
            const completedCount = await this.prisma.userProgress.count({ where: { userId } });
            const paywallTriggered = completedCount >= FREE_STORY_LIMIT;
            return {
                stories,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
                paywallTriggered,
                freeStoriesRemaining: Math.max(0, FREE_STORY_LIMIT - completedCount),
            };
        }
        return {
            stories,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            paywallTriggered: false,
        };
    }
    async getStoryById(storyId, userId, userRole) {
        const story = await this.prisma.story.findUnique({
            where: { id: storyId },
            include: {
                pages: {
                    orderBy: { pageIndex: 'asc' },
                    include: {
                        sentences: {
                            orderBy: { sentenceIdx: 'asc' },
                            include: {
                                tokens: true,
                            },
                        },
                    },
                },
                quizzes: {
                    include: { questions: true },
                },
            },
        });
        if (!story)
            throw new common_1.NotFoundException('Story not found');
        const isPremium = userRole === 'PREMIUM' || userRole === 'ADMIN';
        if (story.isPremium && !isPremium) {
            const unlocked = await this.prisma.consumablePurchase.findFirst({
                where: { userId, type: 'STORY_UNLOCK', referenceId: storyId },
            });
            if (!unlocked) {
                throw new common_1.ForbiddenException({
                    message: 'This story requires a Premium subscription',
                    code: 'PAYWALL',
                    storyId,
                });
            }
        }
        const progress = await this.prisma.userProgress.findUnique({
            where: { userId_storyId: { userId, storyId } },
        });
        return { story, progress };
    }
};
exports.StoryService = StoryService;
exports.StoryService = StoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StoryService);
//# sourceMappingURL=story.service.js.map