import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ContributionService, SubmitContributionDto } from './contribution.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('contributions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('contributions')
export class ContributionController {
  constructor(private readonly contributionService: ContributionService) {}

  @Post()
  @ApiOperation({ summary: 'Submit new media contribution (audio, video, illustration)' })
  submitContribution(
    @CurrentUser() user: { id: string },
    @Body() dto: SubmitContributionDto,
  ) {
    return this.contributionService.submitContribution(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user submitted contributions' })
  getMyContributions(@CurrentUser() user: { id: string }) {
    return this.contributionService.getMyContributions(user.id);
  }
}
