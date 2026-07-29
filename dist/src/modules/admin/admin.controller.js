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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const admin_service_1 = require("./admin.service");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }
    getUsers(search, role, page, limit) {
        return this.adminService.getUsers({ search, role, page, limit });
    }
    updateUserRole(userId, role) {
        return this.adminService.updateUserRole(userId, role);
    }
    updateUserStats(userId, body) {
        return this.adminService.updateUserStats(userId, body);
    }
    getAdminStories(search, path, isPublished, page, limit) {
        return this.adminService.getAdminStories({ search, path, isPublished, page, limit });
    }
    createStory(body) {
        return this.adminService.createStory(body);
    }
    updateStory(id, body) {
        return this.adminService.updateStory(id, body);
    }
    deleteStory(id) {
        return this.adminService.deleteStory(id);
    }
    addPageToStory(storyId, body) {
        return this.adminService.addPageToStory(storyId, body.pageIndex, body.imageUrl);
    }
    addSentenceToPage(pageId, body) {
        return this.adminService.addSentenceToPage(pageId, body);
    }
    getAdminVideos(search, isPublished, page, limit) {
        return this.adminService.getAdminVideos({ search, isPublished, page, limit });
    }
    createVideo(body) {
        return this.adminService.createVideo(body);
    }
    updateVideo(id, body) {
        return this.adminService.updateVideo(id, body);
    }
    deleteVideo(id) {
        return this.adminService.deleteVideo(id);
    }
    getSubscriptions(status, page, limit) {
        return this.adminService.getSubscriptions({ status, page, limit });
    }
    grantSubscription(userId, planType, days) {
        return this.adminService.grantSubscription(userId, planType, days);
    }
    getTransactions(status, page, limit) {
        return this.adminService.getTransactions({ status, page, limit });
    }
    getB2BOrganizations() {
        return this.adminService.getB2BOrganizations();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overview dashboard metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated users list with search & role filter' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user role (FREE, PREMIUM, ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Adjust user gems, lives, or XP' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStats", null);
__decorate([
    (0, common_1.Get)('stories'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all stories (including drafts) for admin dashboard' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('path')),
    __param(2, (0, common_1.Query)('isPublished')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAdminStories", null);
__decorate([
    (0, common_1.Post)('stories'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new story' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createStory", null);
__decorate([
    (0, common_1.Put)('stories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update existing story details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateStory", null);
__decorate([
    (0, common_1.Delete)('stories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete story by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteStory", null);
__decorate([
    (0, common_1.Post)('stories/:id/pages'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new page to story' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "addPageToStory", null);
__decorate([
    (0, common_1.Post)('pages/:pageId/sentences'),
    (0, swagger_1.ApiOperation)({ summary: 'Add sentence to story page' }),
    __param(0, (0, common_1.Param)('pageId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "addSentenceToPage", null);
__decorate([
    (0, common_1.Get)('videos'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all video lessons (including drafts)' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('isPublished')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAdminVideos", null);
__decorate([
    (0, common_1.Post)('videos'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new video lesson' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createVideo", null);
__decorate([
    (0, common_1.Put)('videos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update video lesson' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateVideo", null);
__decorate([
    (0, common_1.Delete)('videos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete video lesson' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteVideo", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user subscriptions' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getSubscriptions", null);
__decorate([
    (0, common_1.Post)('subscriptions/grant'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually grant Premium subscription to a user' }),
    __param(0, (0, common_1.Body)('userId')),
    __param(1, (0, common_1.Body)('planType')),
    __param(2, (0, common_1.Body)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "grantSubscription", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment transactions history' }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('b2b'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all B2B organizations' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getB2BOrganizations", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map