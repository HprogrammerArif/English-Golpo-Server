import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

class AddXpDto {
  @ApiProperty({ example: 10, description: 'XP points to add' })
  @IsNumber()
  @Min(1)
  amount: number;
}

@ApiTags('gamification')
@ApiBearerAuth()
@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Post('xp/add')
  @ApiOperation({ summary: 'Add XP — updates level, streak, daily goal, leaderboard' })
  addXp(@CurrentUser() user: { id: string }, @Body() body: AddXpDto) {
    return this.gamificationService.addXp(user.id, body.amount);
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get current streak and 30-day activity calendar' })
  getStreak(@CurrentUser() user: { id: string }) {
    return this.gamificationService.getStreak(user.id);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get top 30 users in current league for this week' })
  getLeaderboard(@CurrentUser() user: { id: string }) {
    return this.gamificationService.getLeaderboard(user.id);
  }
}
