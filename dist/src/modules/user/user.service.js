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
exports.UserService = exports.UpdateProfileDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateProfileDto {
    name;
    avatarUrl;
    learningPath;
    whatsappOptIn;
}
exports.UpdateProfileDto = UpdateProfileDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "avatarUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB']),
    __metadata("design:type", String)
], UpdateProfileDto.prototype, "learningPath", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateProfileDto.prototype, "whatsappOptIn", void 0);
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, name: true, email: true, phone: true, avatarUrl: true,
                role: true, learningPath: true, lives: true, gems: true, league: true,
                xpTotal: true, whatsappOptIn: true, createdAt: true,
                streak: true,
                subscriptions: {
                    where: { status: 'ACTIVE' },
                    orderBy: { expiryDate: 'desc' },
                    take: 1,
                    select: { planType: true, expiryDate: true, gateway: true },
                },
                _count: { select: { bookmarks: true, progress: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const activeSubscription = user.subscriptions[0] || null;
        const level = Math.floor((user.xpTotal || 0) / 100) + 1;
        return { ...user, level, activeSubscription };
    }
    async updateProfile(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.avatarUrl && { avatarUrl: dto.avatarUrl }),
                ...(dto.learningPath && { learningPath: dto.learningPath }),
                ...(dto.whatsappOptIn !== undefined && { whatsappOptIn: dto.whatsappOptIn }),
            },
            select: {
                id: true, name: true, avatarUrl: true, learningPath: true, whatsappOptIn: true,
            },
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map