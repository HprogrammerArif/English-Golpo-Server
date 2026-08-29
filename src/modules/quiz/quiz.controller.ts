import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuizService, SubmitQuizDto } from './quiz.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('quiz')
@ApiBearerAuth()
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get(':storyId')
  @ApiOperation({ summary: 'Get quiz questions for a story (answers not included)' })
  getQuiz(
    @Param('storyId') storyId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.quizService.getQuiz(storyId, user.id, user.role);
  }

  @Post(':storyId/submit')
  @ApiOperation({ summary: 'Submit quiz answers — returns score, XP, and correct answers' })
  submitQuiz(
    @Param('storyId') storyId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizService.submitQuiz(user.id, storyId, dto);
  }
}
