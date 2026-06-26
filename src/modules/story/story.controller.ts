import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StoryService } from './story.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('stories')
@ApiBearerAuth()
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('paths')
  @ApiOperation({ summary: 'Get all learning paths' })
  getLearningPaths() {
    return this.storyService.getLearningPaths();
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated stories list with paywall status' })
  @ApiQuery({ name: 'path', required: false, enum: ['KIDS','SPOKEN','IELTS','ADMISSION','JOB','VOCAB'] })
  @ApiQuery({ name: 'level', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getStories(
    @CurrentUser() user: { id: string; role: string },
    @Query('path') path?: string,
    @Query('level', new DefaultValuePipe(undefined), new ParseIntPipe({ optional: true })) level?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit = 20,
  ) {
    return this.storyService.getStories(user.id, user.role, path, level, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full story with pages, sentences, tokens, and quiz' })
  getStory(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.storyService.getStoryById(id, user.id, user.role);
  }
}
