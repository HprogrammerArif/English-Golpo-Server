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
exports.ProgressService = exports.FlashcardResultDto = exports.AddBookmarkDto = exports.SyncProgressDto = exports.ProgressSyncItemDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ProgressSyncItemDto {
    storyId;
    completed;
    score;
    xpEarned;
}
exports.ProgressSyncItemDto = ProgressSyncItemDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProgressSyncItemDto.prototype, "storyId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProgressSyncItemDto.prototype, "completed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProgressSyncItemDto.prototype, "score", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProgressSyncItemDto.prototype, "xpEarned", void 0);
class SyncProgressDto {
    items;
}
exports.SyncProgressDto = SyncProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ProgressSyncItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProgressSyncItemDto),
    __metadata("design:type", Array)
], SyncProgressDto.prototype, "items", void 0);
class AddBookmarkDto {
    englishWord;
    banglaMeaning;
    context;
    wordTokenId;
}
exports.AddBookmarkDto = AddBookmarkDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddBookmarkDto.prototype, "englishWord", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddBookmarkDto.prototype, "banglaMeaning", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddBookmarkDto.prototype, "context", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddBookmarkDto.prototype, "wordTokenId", void 0);
class FlashcardResultDto {
    word;
    quality;
}
exports.FlashcardResultDto = FlashcardResultDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FlashcardResultDto.prototype, "word", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '0=blackout, 1=wrong, 2=wrong+easy, 3=correct+hard, 4=correct, 5=perfect' }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FlashcardResultDto.prototype, "quality", void 0);
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncProgress(userId, dto) {
        const results = await Promise.all(dto.items.map((item) => this.prisma.userProgress.upsert({
            where: { userId_storyId: { userId, storyId: item.storyId } },
            create: {
                userId,
                storyId: item.storyId,
                completed: item.completed,
                score: item.score,
                xpEarned: item.xpEarned,
            },
            update: {
                completed: item.completed,
                score: item.score,
                xpEarned: { increment: item.xpEarned },
            },
        })));
        return { synced: results.length };
    }
    async addBookmark(userId, dto) {
        return this.prisma.bookmark.upsert({
            where: { userId_englishWord: { userId, englishWord: dto.englishWord } },
            create: {
                userId,
                wordTokenId: dto.wordTokenId,
                englishWord: dto.englishWord,
                banglaMeaning: dto.banglaMeaning,
                context: dto.context,
                nextReviewAt: new Date(),
            },
            update: {
                banglaMeaning: dto.banglaMeaning,
                context: dto.context,
            },
        });
    }
    async removeBookmark(userId, word) {
        await this.prisma.bookmark.deleteMany({
            where: { userId, englishWord: word },
        });
        return { removed: word };
    }
    async getBookmarks(userId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [bookmarks, total] = await this.prisma.$transaction([
            this.prisma.bookmark.findMany({
                where: { userId },
                orderBy: { savedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.bookmark.count({ where: { userId } }),
        ]);
        return { bookmarks, pagination: { page, limit, total } };
    }
    async getFlashcardQueue(userId) {
        const now = new Date();
        const cards = await this.prisma.bookmark.findMany({
            where: { userId, nextReviewAt: { lte: now } },
            orderBy: { nextReviewAt: 'asc' },
            take: 10,
            select: {
                id: true,
                englishWord: true,
                banglaMeaning: true,
                context: true,
                interval: true,
                repetitions: true,
            },
        });
        return { cards, count: cards.length };
    }
    async recordFlashcardResult(userId, dto) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: { userId, englishWord: dto.word },
        });
        if (!bookmark)
            return { skipped: true };
        const q = Math.max(0, Math.min(5, dto.quality));
        let { interval, easeFactor, repetitions } = bookmark;
        if (q < 3) {
            interval = 1;
            repetitions = 0;
        }
        else {
            if (repetitions === 0)
                interval = 1;
            else if (repetitions === 1)
                interval = 6;
            else
                interval = Math.round(interval * easeFactor);
            repetitions += 1;
        }
        easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        const nextReviewAt = new Date();
        nextReviewAt.setDate(nextReviewAt.getDate() + interval);
        await this.prisma.bookmark.update({
            where: { id: bookmark.id },
            data: { interval, easeFactor, repetitions, nextReviewAt },
        });
        await this.prisma.flashcardReview.create({
            data: { userId, word: dto.word, quality: q },
        });
        return { word: dto.word, nextReviewAt, interval };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map