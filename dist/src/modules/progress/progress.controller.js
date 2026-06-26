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
exports.ProgressController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const progress_service_1 = require("./progress.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let ProgressController = class ProgressController {
    progressService;
    constructor(progressService) {
        this.progressService = progressService;
    }
    sync(user, dto) {
        return this.progressService.syncProgress(user.id, dto);
    }
    getBookmarks(user, page, limit) {
        return this.progressService.getBookmarks(user.id, page, limit);
    }
    addBookmark(user, dto) {
        return this.progressService.addBookmark(user.id, dto);
    }
    removeBookmark(user, word) {
        return this.progressService.removeBookmark(user.id, word);
    }
    getFlashcardQueue(user) {
        return this.progressService.getFlashcardQueue(user.id);
    }
    recordFlashcardResult(user, dto) {
        return this.progressService.recordFlashcardResult(user.id, dto);
    }
};
exports.ProgressController = ProgressController;
__decorate([
    (0, common_1.Post)('sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Batch sync offline progress' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, progress_service_1.SyncProgressDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "sync", null);
__decorate([
    (0, common_1.Get)('bookmarks'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookmarks (vocabulary)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getBookmarks", null);
__decorate([
    (0, common_1.Post)('bookmarks'),
    (0, swagger_1.ApiOperation)({ summary: 'Save a vocabulary bookmark' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, progress_service_1.AddBookmarkDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "addBookmark", null);
__decorate([
    (0, common_1.Delete)('bookmarks/:word'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a vocabulary bookmark' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('word')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Get)('flashcard-queue'),
    (0, swagger_1.ApiOperation)({ summary: 'Get today\'s spaced repetition flashcard queue (10 cards)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "getFlashcardQueue", null);
__decorate([
    (0, common_1.Post)('flashcard-result'),
    (0, swagger_1.ApiOperation)({ summary: 'Record flashcard response — adjusts SM-2 next review interval' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, progress_service_1.FlashcardResultDto]),
    __metadata("design:returntype", void 0)
], ProgressController.prototype, "recordFlashcardResult", null);
exports.ProgressController = ProgressController = __decorate([
    (0, swagger_1.ApiTags)('progress'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('progress'),
    __metadata("design:paramtypes", [progress_service_1.ProgressService])
], ProgressController);
//# sourceMappingURL=progress.controller.js.map