import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ─── Metrics ─────────────────────────────────────────────────────────────
  @Get('stats')
  @ApiOperation({ summary: 'Get overview dashboard metrics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ─── Users ───────────────────────────────────────────────────────────────
  @Get('users')
  @ApiOperation({ summary: 'Get paginated users list with search & role filter' })
  getUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getUsers({ search, role, page, limit });
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role (FREE, PREMIUM, ADMIN)' })
  updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: 'FREE' | 'PREMIUM' | 'ADMIN',
  ) {
    return this.adminService.updateUserRole(userId, role);
  }

  @Patch('users/:id/stats')
  @ApiOperation({ summary: 'Adjust user gems, lives, or XP' })
  updateUserStats(
    @Param('id') userId: string,
    @Body() body: { gems?: number; lives?: number; xpTotal?: number },
  ) {
    return this.adminService.updateUserStats(userId, body);
  }

  // ─── Stories CMS ──────────────────────────────────────────────────────────
  @Get('stories')
  @ApiOperation({ summary: 'Get all stories (including drafts) for admin dashboard' })
  getAdminStories(
    @Query('search') search?: string,
    @Query('path') path?: string,
    @Query('isPublished') isPublished?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAdminStories({ search, path, isPublished, page, limit });
  }

  @Post('stories')
  @ApiOperation({ summary: 'Create a new story' })
  createStory(@Body() body: any) {
    return this.adminService.createStory(body);
  }

  @Put('stories/:id')
  @ApiOperation({ summary: 'Update existing story details' })
  updateStory(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateStory(id, body);
  }

  @Delete('stories/:id')
  @ApiOperation({ summary: 'Delete story by ID' })
  deleteStory(@Param('id') id: string) {
    return this.adminService.deleteStory(id);
  }

  @Post('stories/:id/pages')
  @ApiOperation({ summary: 'Add a new page to story' })
  addPageToStory(
    @Param('id') storyId: string,
    @Body() body: { pageIndex: number; imageUrl: string },
  ) {
    return this.adminService.addPageToStory(storyId, body.pageIndex, body.imageUrl);
  }

  @Post('pages/:pageId/sentences')
  @ApiOperation({ summary: 'Add sentence to story page' })
  addSentenceToPage(
    @Param('pageId') pageId: string,
    @Body() body: { sentenceIdx: number; englishText: string; banglaText: string; startTime: number; endTime: number },
  ) {
    return this.adminService.addSentenceToPage(pageId, body);
  }

  // ─── Video CMS ────────────────────────────────────────────────────────────
  @Get('videos')
  @ApiOperation({ summary: 'Get all video lessons (including drafts)' })
  getAdminVideos(
    @Query('search') search?: string,
    @Query('isPublished') isPublished?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAdminVideos({ search, isPublished, page, limit });
  }

  @Post('videos')
  @ApiOperation({ summary: 'Create a new video lesson' })
  createVideo(@Body() body: any) {
    return this.adminService.createVideo(body);
  }

  @Put('videos/:id')
  @ApiOperation({ summary: 'Update video lesson' })
  updateVideo(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateVideo(id, body);
  }

  @Delete('videos/:id')
  @ApiOperation({ summary: 'Delete video lesson' })
  deleteVideo(@Param('id') id: string) {
    return this.adminService.deleteVideo(id);
  }

  // ─── Subscriptions & Financials ─────────────────────────────────────────
  @Get('subscriptions')
  @ApiOperation({ summary: 'Get all user subscriptions' })
  getSubscriptions(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getSubscriptions({ status, page, limit });
  }

  @Post('subscriptions/grant')
  @ApiOperation({ summary: 'Manually grant Premium subscription to a user' })
  grantSubscription(
    @Body('userId') userId: string,
    @Body('planType') planType: string,
    @Body('days') days?: number,
  ) {
    return this.adminService.grantSubscription(userId, planType, days);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get payment transactions history' })
  getTransactions(
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getTransactions({ status, page, limit });
  }

  // ─── B2B Organizations ───────────────────────────────────────────────────
  @Get('b2b')
  @ApiOperation({ summary: 'Get all B2B organizations' })
  getB2BOrganizations() {
    return this.adminService.getB2BOrganizations();
  }
}
