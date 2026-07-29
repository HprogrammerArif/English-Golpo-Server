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
exports.ContributionService = exports.SubmitContributionDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const class_validator_1 = require("class-validator");
class SubmitContributionDto {
    contentType;
    title;
    description;
    fileUrl;
    targetChildId;
}
exports.SubmitContributionDto = SubmitContributionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitContributionDto.prototype, "contentType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitContributionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitContributionDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitContributionDto.prototype, "fileUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], SubmitContributionDto.prototype, "targetChildId", void 0);
let ContributionService = class ContributionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitContribution(userId, dto) {
        if (dto.contentType === 'VIDEO' && dto.targetChildId) {
            const child = await this.prisma.user.findUnique({
                where: { id: dto.targetChildId },
            });
            if (!child) {
                throw new common_1.NotFoundException('Target child user not found');
            }
        }
        const initialPayoutStatus = dto.contentType === 'VIDEO' && dto.targetChildId ? 'NOT_APPLICABLE' : 'UNPAID';
        return this.prisma.contribution.create({
            data: {
                contributorId: userId,
                contentType: dto.contentType,
                title: dto.title,
                description: dto.description,
                fileUrl: dto.fileUrl,
                targetChildId: dto.targetChildId,
                payoutStatus: initialPayoutStatus,
            },
        });
    }
    async getMyContributions(userId) {
        return this.prisma.contribution.findMany({
            where: { contributorId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ContributionService = ContributionService;
exports.ContributionService = ContributionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContributionService);
//# sourceMappingURL=contribution.service.js.map