import { QuizService, SubmitQuizDto } from './quiz.service';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
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
    submitQuiz(storyId: string, user: {
        id: string;
    }, dto: SubmitQuizDto): Promise<{
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
