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
exports.StoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const story_service_1 = require("./story.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let StoryController = class StoryController {
    storyService;
    constructor(storyService) {
        this.storyService = storyService;
    }
    getLearningPaths() {
        return this.storyService.getLearningPaths();
    }
    getStories(user, path, level, page = 1, limit = 20) {
        return this.storyService.getStories(user.id, user.role, path, level, page, limit);
    }
    getStory(id, user) {
        return this.storyService.getStoryById(id, user.id, user.role);
    }
};
exports.StoryController = StoryController;
__decorate([
    (0, common_1.Get)('paths'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all learning paths' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "getLearningPaths", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated stories list with paywall status' }),
    (0, swagger_1.ApiQuery)({ name: 'path', required: false, enum: ['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB'] }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('path')),
    __param(2, (0, common_1.Query)('level', new common_1.DefaultValuePipe(undefined), new common_1.ParseIntPipe({ optional: true }))),
    __param(3, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Object, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "getStories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full story with pages, sentences, tokens, and quiz' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], StoryController.prototype, "getStory", null);
exports.StoryController = StoryController = __decorate([
    (0, swagger_1.ApiTags)('stories'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('stories'),
    __metadata("design:paramtypes", [story_service_1.StoryService])
], StoryController);
//# sourceMappingURL=story.controller.js.map