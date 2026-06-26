import { PrismaService } from '../../prisma/prisma.service';
export declare class SubmitQuizDto {
    answers: number[];
}
export declare class QuizService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getQuiz(storyId: string): Promise<{
        questions: {
            id: string;
            questionText: string;
            questionTextBn: string | null;
            options: string[];
            xpReward: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        storyId: string;
    }>;
    submitQuiz(userId: string, storyId: string, dto: SubmitQuizDto): Promise<{
        score: number;
        xpEarned: number;
        correctCount: number;
        totalQuestions: number;
        results: {
            questionId: string;
            userAnswer: number;
            correctIndex: number;
            isCorrect: boolean;
            explanation: string | null;
        }[];
    }>;
}
