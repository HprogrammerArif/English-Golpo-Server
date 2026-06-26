import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsArray, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizDto {
  @ApiProperty({ type: [Number], description: 'Array of chosen option indexes' })
  @IsArray()
  answers: number[];
}

const XP_PER_CORRECT = 10;

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuiz(storyId: string) {
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
            // correctIndex is excluded from the GET response (only used in POST)
          },
        },
      },
    });

    if (!quiz) throw new NotFoundException('No quiz found for this story');
    return quiz;
  }

  async submitQuiz(userId: string, storyId: string, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findFirst({
      where: { storyId },
      include: { questions: { orderBy: { id: 'asc' } } },
    });

    if (!quiz) throw new NotFoundException('No quiz found for this story');

    let correctCount = 0;
    let xpEarned = 0;

    const results = quiz.questions.map((q, idx) => {
      const userAnswer = dto.answers[idx];
      const isCorrect = userAnswer === q.correctIndex;
      if (isCorrect) {
        correctCount++;
        xpEarned += q.xpReward;
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

    // Save progress
    await this.prisma.userProgress.upsert({
      where: { userId_storyId: { userId, storyId } },
      create: { userId, storyId, completed: true, score, xpEarned },
      update: { score: Math.max(score, 0), completed: true },
    });

    return { score, xpEarned, correctCount, totalQuestions: quiz.questions.length, results };
  }
}
