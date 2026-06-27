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
exports.VideoController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const video_service_1 = require("./video.service");
const swagger_1 = require("@nestjs/swagger");
let VideoController = class VideoController {
    videoService;
    constructor(videoService) {
        this.videoService = videoService;
    }
    getVideos(path, level, page, limit) {
        return this.videoService.getVideos({ path: path, level: level ? +level : undefined, page, limit });
    }
    getMyProgress(req) {
        return this.videoService.getUserVideoProgress(req.user.sub);
    }
    getVideo(id) {
        return this.videoService.getVideoById(id);
    }
    trackProgress(req, dto) {
        return this.videoService.trackProgress(req.user.sub, dto);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all published video lessons with optional filters' }),
    (0, swagger_1.ApiQuery)({ name: 'path', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'level', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('path')),
    __param(1, (0, common_1.Query)('level', new common_1.DefaultValuePipe(undefined))),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "getVideos", null);
__decorate([
    (0, common_1.Get)('my-progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user video watch progress' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "getMyProgress", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single video lesson by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "getVideo", null);
__decorate([
    (0, common_1.Post)('progress'),
    (0, swagger_1.ApiOperation)({ summary: 'Track video watch progress and award XP on completion' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, video_service_1.TrackVideoProgressDto]),
    __metadata("design:returntype", void 0)
], VideoController.prototype, "trackProgress", null);
exports.VideoController = VideoController = __decorate([
    (0, swagger_1.ApiTags)('video'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [video_service_1.VideoService])
], VideoController);
//# sourceMappingURL=video.controller.js.map