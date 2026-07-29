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
exports.AccountsService = exports.ProvisionB2BDto = exports.LinkChildDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LinkChildDto {
    childPhone;
}
exports.LinkChildDto = LinkChildDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number of child account to link' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LinkChildDto.prototype, "childPhone", void 0);
class ProvisionB2BDto {
    organizationName;
    type;
    licenseCount;
    contactPhone;
}
exports.ProvisionB2BDto = ProvisionB2BDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionB2BDto.prototype, "organizationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['SCHOOL', 'COACHING_CENTER', 'MADRASA', 'FAMILY', 'CORPORATE'] }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProvisionB2BDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ProvisionB2BDto.prototype, "licenseCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProvisionB2BDto.prototype, "contactPhone", void 0);
let AccountsService = class AccountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getParentDashboard(parentId) {
        const parent = await this.prisma.user.findUnique({
            where: { id: parentId },
            include: {
                children: {
                    select: {
                        id: true,
                        name: true,
                        learningPath: true,
                        xpTotal: true,
                        streak: { select: { currentStreak: true } },
                        dailyGoals: {
                            where: {
                                date: {
                                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                                },
                            },
                            select: { date: true, earnedXp: true, completed: true },
                        },
                        _count: { select: { progress: true, bookmarks: true } },
                    },
                },
            },
        });
        return {
            children: parent?.children.map((child) => ({
                id: child.id,
                name: child.name,
                learningPath: child.learningPath,
                xpTotal: child.xpTotal,
                level: Math.floor((child.xpTotal || 0) / 100) + 1,
                streak: child.streak?.currentStreak || 0,
                weeklyXp: child.dailyGoals.reduce((sum, g) => sum + g.earnedXp, 0),
                storiesCompleted: child._count.progress,
                wordsBookmarked: child._count.bookmarks,
                weeklyActivity: child.dailyGoals,
            })) || [],
        };
    }
    async linkChild(parentId, dto) {
        const child = await this.prisma.user.findUnique({ where: { phone: dto.childPhone } });
        if (!child)
            throw new common_1.NotFoundException('Child account not found');
        await this.prisma.user.update({
            where: { id: child.id },
            data: { parentId },
        });
        return { linked: true, childName: child.name };
    }
    async provisionB2B(adminId, dto) {
        return this.prisma.b2BOrganization.create({
            data: {
                adminId,
                name: dto.organizationName,
                type: dto.type,
                licenseCount: dto.licenseCount || 25,
                contactPhone: dto.contactPhone,
            },
        });
    }
    async getB2BDashboard(adminId) {
        const org = await this.prisma.b2BOrganization.findUnique({
            where: { adminId },
            include: {
                members: {
                    select: {
                        id: true,
                        name: true,
                        xpTotal: true,
                        learningPath: true,
                        streak: { select: { currentStreak: true } },
                        _count: { select: { progress: true } },
                    },
                    orderBy: { xpTotal: 'desc' },
                },
            },
        });
        if (!org)
            return { organization: null };
        return {
            organization: {
                name: org.name,
                type: org.type,
                licenseCount: org.licenseCount,
                usedSeats: org.members.length,
                availableSeats: org.licenseCount - org.members.length,
                contractEnd: org.contractEnd,
            },
            members: org.members.map((m, idx) => ({
                rank: idx + 1,
                id: m.id,
                name: m.name,
                xpTotal: m.xpTotal,
                level: Math.floor((m.xpTotal || 0) / 100) + 1,
                streak: m.streak?.currentStreak || 0,
                storiesCompleted: m._count.progress,
                learningPath: m.learningPath,
            })),
        };
    }
};
exports.AccountsService = AccountsService;
exports.AccountsService = AccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountsService);
//# sourceMappingURL=accounts.service.js.map