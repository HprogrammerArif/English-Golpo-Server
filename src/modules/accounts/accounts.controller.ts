import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService, LinkChildDto, ProvisionB2BDto } from './accounts.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('parents/dashboard')
  @ApiOperation({ summary: 'Parent dashboard — all children XP, streak, weekly activity' })
  getParentDashboard(@CurrentUser() user: { id: string }) {
    return this.accountsService.getParentDashboard(user.id);
  }

  @Post('parents/link-child')
  @ApiOperation({ summary: 'Link a child account by phone number' })
  linkChild(@CurrentUser() user: { id: string }, @Body() dto: LinkChildDto) {
    return this.accountsService.linkChild(user.id, dto);
  }

  @Post('b2b/provision')
  @ApiOperation({ summary: 'Provision a new B2B organization (school/coaching center)' })
  provisionB2B(@CurrentUser() user: { id: string }, @Body() dto: ProvisionB2BDto) {
    return this.accountsService.provisionB2B(user.id, dto);
  }

  @Get('b2b/dashboard')
  @ApiOperation({ summary: 'B2B admin dashboard with member progress leaderboard' })
  getB2BDashboard(@CurrentUser() user: { id: string }) {
    return this.accountsService.getB2BDashboard(user.id);
  }
}
