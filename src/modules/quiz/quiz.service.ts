import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { IsString, IsArray, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizDto {
  @ApiProperty({ type: [Number], description: 'Array of chosen option indexes' })
  @IsArray()
  answers: number[];
}

const XP_PER_CORRECT = 10;
const MAX_LIVES = 5;

function hasUnlimitedLives(role: string) {
  return role === 'PREMIUM' || role === 'ADMIN';
}

@Injectable()
export class QuizService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gamification: GamificationService,
  ) {}

  async getQuiz(storyId: string, userId: string, userRole: string) {
    if (!hasUnlimitedLives(userRole)) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { lives: true } });
      if (!user || user.lives <= 0) {
        throw new ForbiddenException({
          message: 'You have no lives left. Refill in the shop to keep going.',
          code: 'NO_LIVES',
        });
      }
    }

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
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { lives: true, role: true } });
    if (!user) throw new NotFoundException('User not found');

    const unlimitedLives = hasUnlimitedLives(user.role);
    if (!unlimitedLives && user.lives <= 0) {
      throw new ForbiddenException({
        message: 'You have no lives left. Refill in the shop to keep going.',
        code: 'NO_LIVES',
      });
    }

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
      } else {
        // Record mistake in database
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
    const wrongCount = quiz.questions.length - correctCount;

    // Save progress
    await this.prisma.userProgress.upsert({
      where: { userId_storyId: { userId, storyId } },
      create: { userId, storyId, completed: true, score, xpEarned },
      update: { score: Math.max(score, 0), completed: true },
    });

    let livesRemaining = user.lives;
    if (!unlimitedLives && wrongCount > 0) {
      const result = await this.prisma.user.update({
        where: { id: userId },
        data: { lives: { decrement: Math.min(wrongCount, user.lives) } },
        select: { lives: true },
      });
      livesRemaining = Math.max(0, Math.min(result.lives, MAX_LIVES));
    }

    if (xpEarned > 0) {
      await this.gamification.addXp(userId, xpEarned);
    }

    return { score, xpEarned, correctCount, totalQuestions: quiz.questions.length, results, livesRemaining };
  }
}
