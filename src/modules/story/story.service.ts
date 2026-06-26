import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const FREE_STORY_LIMIT = 40;

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getLearningPaths() {
    return [
      { id: 'KIDS', label: 'Kids English', labelBn: 'বাচ্চাদের ইংরেজি', icon: '🧒', color: '#10B981' },
      { id: 'SPOKEN', label: 'Spoken English', labelBn: 'স্পোকেন ইংলিশ', icon: '🗣️', color: '#3B82F6' },
      { id: 'IELTS', label: 'IELTS Prep', labelBn: 'IELTS প্রস্তুতি', icon: '📚', color: '#8B5CF6' },
      { id: 'ADMISSION', label: 'Admission English', labelBn: 'ভর্তি পরীক্ষা', icon: '🎓', color: '#F59E0B' },
      { id: 'JOB', label: 'Job English', labelBn: 'চাকরির ইংরেজি', icon: '💼', color: '#EF4444' },
      { id: 'VOCAB', label: 'Vocabulary', labelBn: 'শব্দভাণ্ডার', icon: '📖', color: '#06B6D4' },
    ];
  }

  async getStories(
    userId: string,
    userRole: string,
    learningPath?: string,
    level?: number,
    page = 1,
    limit = 20,
  ) {
    const skip = (page - 1) * limit;
    const isPremium = userRole === 'PREMIUM' || userRole === 'ADMIN';

    const where: any = {
      isPublished: true,
      ...(learningPath && { learningPath: learningPath as any }),
      ...(level && { level }),
    };

    const [stories, total] = await this.prisma.$transaction([
      this.prisma.story.findMany({
        where,
        select: {
          id: true,
          title: true,
          titleBn: true,
          description: true,
          descriptionBn: true,
          level: true,
          learningPath: true,
          isPremium: true,
          nctbClass: true,
          nctbUnit: true,
          illustrationUrl: true,
          durationSeconds: true,
          wordCount: true,
          tags: true,
          createdAt: true,
          _count: { select: { pages: true } },
        },
        orderBy: [{ level: 'asc' }, { createdAt: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.story.count({ where }),
    ]);

    // Free tier: check how many premium stories this user has accessed
    if (!isPremium) {
      const completedCount = await this.prisma.userProgress.count({ where: { userId } });
      const paywallTriggered = completedCount >= FREE_STORY_LIMIT;
      return {
        stories,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        paywallTriggered,
        freeStoriesRemaining: Math.max(0, FREE_STORY_LIMIT - completedCount),
      };
    }

    return {
      stories,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      paywallTriggered: false,
    };
  }

  async getStoryById(storyId: string, userId: string, userRole: string) {
    const story = await this.prisma.story.findUnique({
      where: { id: storyId },
      include: {
        pages: {
          orderBy: { pageIndex: 'asc' },
          include: {
            sentences: {
              orderBy: { sentenceIdx: 'asc' },
              include: {
                tokens: true,
              },
            },
          },
        },
        quizzes: {
          include: { questions: true },
        },
      },
    });

    if (!story) throw new NotFoundException('Story not found');

    // Paywall check for premium stories
    const isPremium = userRole === 'PREMIUM' || userRole === 'ADMIN';
    if (story.isPremium && !isPremium) {
      // Check if user has unlocked this story via micro-transaction
      const unlocked = await this.prisma.consumablePurchase.findFirst({
        where: { userId, type: 'STORY_UNLOCK', referenceId: storyId },
      });
      if (!unlocked) {
        throw new ForbiddenException({
          message: 'This story requires a Premium subscription',
          code: 'PAYWALL',
          storyId,
        });
      }
    }

    // Get user progress for this story
    const progress = await this.prisma.userProgress.findUnique({
      where: { userId_storyId: { userId, storyId } },
    });

    return { story, progress };
  }
}
