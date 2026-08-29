import { Controller, Post, Get, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  GamificationService,
  GAME_REWARD_SOURCES,
} from './gamification.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class AddGemsDto {
  @ApiProperty({ example: GAME_REWARD_SOURCES[0], enum: GAME_REWARD_SOURCES })
  @IsIn(GAME_REWARD_SOURCES)
  source: string;
}

@ApiTags('gamification')
@ApiBearerAuth()
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('gems/add')
  @ApiOperation({
    summary:
      'Award gems for completing a mini-game — fixed, server-defined amounts only, no client-supplied amount',
  })
  addGems(@CurrentUser() user: { id: string }, @Body() body: AddGemsDto) {
    return this.gamificationService.addGems(user.id, body.source);
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get current streak and 30-day activity calendar' })
  getStreak(@CurrentUser() user: { id: string }) {
    return this.gamificationService.getStreak(user.id);
  }

  @Get('daily-goal')
  @ApiOperation({ summary: "Get today's XP goal progress" })
  getDailyGoal(@CurrentUser() user: { id: string }) {
    return this.gamificationService.getDailyGoal(user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top 30 users in current league for this week' })
  getLeaderboard(@CurrentUser() user: { id: string }) {
    return this.gamificationService.getLeaderboard(user.id);
  }
}
