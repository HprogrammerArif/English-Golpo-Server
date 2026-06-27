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
exports.QuizService = exports.SubmitQuizDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SubmitQuizDto {
    answers;
}
exports.SubmitQuizDto = SubmitQuizDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [Number], description: 'Array of chosen option indexes' }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], SubmitQuizDto.prototype, "answers", void 0);
const XP_PER_CORRECT = 10;
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getQuiz(storyId) {
        const quiz = await this.prisma.quiz.findFirst({
            where: { storyId },
            include: {
                questions: {
                    select: {
                        id: true,
                        questionText: true,
                        questionTextBn: true,
                        options: true,
                        xpReward: true,
                    },
                },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('No quiz found for this story');
        return quiz;
    }
    async submitQuiz(userId, storyId, dto) {
        const quiz = await this.prisma.quiz.findFirst({
            where: { storyId },
            include: { questions: { orderBy: { id: 'asc' } } },
        });
        if (!quiz)
            throw new common_1.NotFoundException('No quiz found for this story');
        let correctCount = 0;
        let xpEarned = 0;
        const results = quiz.questions.map((q, idx) => {
            const userAnswer = dto.answers[idx];
            const isCorrect = userAnswer === q.correctIndex;
            if (isCorrect) {
                correctCount++;
                xpEarned += q.xpReward;
            }
            else {
                this.prisma.userMistake.upsert({
                    where: {
                        userId_type_englishText: {
                            userId,
                            type: 'SENTENCE',
                            englishText: q.questionText,
                        },
                    },
                    create: {
                        userId,
                        type: 'SENTENCE',
                        englishText: q.questionText,
                        banglaText: q.questionTextBn || '',
                        incorrectCount: 1,
                        corrected: false,
                    },
                    update: {
                        incorrectCount: { increment: 1 },
                        corrected: false,
                        updatedAt: new Date(),
                    },
                }).catch((err) => console.error('Failed to save mistake:', err));
            }
            return {
                questionId: q.id,
                userAnswer,
                correctIndex: q.correctIndex,
                isCorrect,
                explanation: isCorrect ? null : q.explanation,
            };
        });
        const score = Math.round((correctCount / quiz.questions.length) * 100);
        await this.prisma.userProgress.upsert({
            where: { userId_storyId: { userId, storyId } },
            create: { userId, storyId, completed: true, score, xpEarned },
            update: { score: Math.max(score, 0), completed: true },
        });
        return { score, xpEarned, correctCount, totalQuestions: quiz.questions.length, results };
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map