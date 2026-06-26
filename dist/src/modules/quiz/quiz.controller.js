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
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quiz_service_1 = require("./quiz.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let QuizController = class QuizController {
    quizService;
    constructor(quizService) {
        this.quizService = quizService;
    }
    getQuiz(storyId) {
        return this.quizService.getQuiz(storyId);
    }
    submitQuiz(storyId, user, dto) {
        return this.quizService.submitQuiz(user.id, storyId, dto);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Get)(':storyId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quiz questions for a story (answers not included)' }),
    __param(0, (0, common_1.Param)('storyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "getQuiz", null);
__decorate([
    (0, common_1.Post)(':storyId/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit quiz answers — returns score, XP, and correct answers' }),
    __param(0, (0, common_1.Param)('storyId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, quiz_service_1.SubmitQuizDto]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "submitQuiz", null);
exports.QuizController = QuizController = __decorate([
    (0, swagger_1.ApiTags)('quiz'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('quiz'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map