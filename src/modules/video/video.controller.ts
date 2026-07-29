import {
  Controller, Get, Post, Param, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VideoService, GetVideosDto, TrackVideoProgressDto } from './video.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('video')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published video lessons with optional filters' })
  @ApiQuery({ name: 'path', required: false })
  @ApiQuery({ name: 'level', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getVideos(
    @Query('path') path?: string,
    @Query('level', new DefaultValuePipe(undefined)) level?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.videoService.getVideos({ path: path as any, level: level ? +level : undefined, page, limit });
  }

  @Get('my-progress')
  @ApiOperation({ summary: 'Get current user video watch progress' })
  getMyProgress(@CurrentUser() user: { id: string }) {
    return this.videoService.getUserVideoProgress(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single video lesson by ID' })
  getVideo(@Param('id') id: string) {
    return this.videoService.getVideoById(id);
  }

  @Post('progress')
  @ApiOperation({ summary: 'Track video watch progress and award XP on completion' })
  trackProgress(@CurrentUser() user: { id: string }, @Body() dto: TrackVideoProgressDto) {
    return this.videoService.trackProgress(user.id, dto);
  }
}
