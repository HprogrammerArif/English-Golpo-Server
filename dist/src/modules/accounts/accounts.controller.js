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
exports.AccountsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const accounts_service_1 = require("./accounts.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AccountsController = class AccountsController {
    accountsService;
    constructor(accountsService) {
        this.accountsService = accountsService;
    }
    getParentDashboard(user) {
        return this.accountsService.getParentDashboard(user.id);
    }
    linkChild(user, dto) {
        return this.accountsService.linkChild(user.id, dto);
    }
    provisionB2B(user, dto) {
        return this.accountsService.provisionB2B(user.id, dto);
    }
    getB2BDashboard(user) {
        return this.accountsService.getB2BDashboard(user.id);
    }
};
exports.AccountsController = AccountsController;
__decorate([
    (0, common_1.Get)('parents/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Parent dashboard — all children XP, streak, weekly activity' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "getParentDashboard", null);
__decorate([
    (0, common_1.Post)('parents/link-child'),
    (0, swagger_1.ApiOperation)({ summary: 'Link a child account by phone number' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, accounts_service_1.LinkChildDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "linkChild", null);
__decorate([
    (0, common_1.Post)('b2b/provision'),
    (0, swagger_1.ApiOperation)({ summary: 'Provision a new B2B organization (school/coaching center)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, accounts_service_1.ProvisionB2BDto]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "provisionB2B", null);
__decorate([
    (0, common_1.Get)('b2b/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'B2B admin dashboard with member progress leaderboard' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AccountsController.prototype, "getB2BDashboard", null);
exports.AccountsController = AccountsController = __decorate([
    (0, swagger_1.ApiTags)('accounts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('accounts'),
    __metadata("design:paramtypes", [accounts_service_1.AccountsService])
], AccountsController);
//# sourceMappingURL=accounts.controller.js.map