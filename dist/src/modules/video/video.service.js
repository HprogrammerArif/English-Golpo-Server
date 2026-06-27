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
exports.VideoService = exports.TrackVideoProgressDto = exports.GetVideosDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GetVideosDto {
    path;
    level;
    page;
    limit;
}
exports.GetVideosDto = GetVideosDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetVideosDto.prototype, "path", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetVideosDto.prototype, "level", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetVideosDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetVideosDto.prototype, "limit", void 0);
class TrackVideoProgressDto {
    videoId;
    watchedSeconds;
    completed;
}
exports.TrackVideoProgressDto = TrackVideoProgressDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TrackVideoProgressDto.prototype, "videoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], TrackVideoProgressDto.prototype, "watchedSeconds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TrackVideoProgressDto.prototype, "completed", void 0);
let VideoService = class VideoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVideos(dto) {
        const { path, level, page = 1, limit = 20 } = dto;
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        if (path)
            where.learningPath = path;
        if (level)
            where.level = level;
        const [videos, total] = await this.prisma.$transaction([
            this.prisma.videoLesson.findMany({
                where,
                orderBy: [{ level: 'asc' }, { createdAt: 'desc' }],
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
    async getVideoById(id) {
        const video = await this.prisma.videoLesson.findUnique({ where: { id } });
        if (!video)
            throw new common_1.NotFoundException('Video not found');
        return video;
    }
    async getUserVideoProgress(userId) {
        return this.prisma.videoProgress.findMany({
            where: { userId },
            include: { video: { select: { id: true, title: true, titleBn: true, thumbnailUrl: true, durationSeconds: true } } },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async trackProgress(userId, dto) {
        const video = await this.prisma.videoLesson.findUnique({ where: { id: dto.videoId } });
        if (!video)
            throw new common_1.NotFoundException('Video not found');
        const xpReward = dto.completed ? 15 : 0;
        const progress = await this.prisma.videoProgress.upsert({
            where: { userId_videoId: { userId, videoId: dto.videoId } },
            create: {
                userId,
                videoId: dto.videoId,
                watchedSeconds: dto.watchedSeconds,
                completed: dto.completed,
                xpEarned: xpReward,
            },
            update: {
                watchedSeconds: Math.max(dto.watchedSeconds, 0),
                completed: dto.completed,
                xpEarned: dto.completed ? xpReward : 0,
            },
        });
        if (dto.completed && xpReward > 0) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { xpTotal: { increment: xpReward } },
            });
        }
        return progress;
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideoService);
//# sourceMappingURL=video.service.js.map