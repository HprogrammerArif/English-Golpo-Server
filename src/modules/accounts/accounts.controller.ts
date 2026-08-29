import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import {
  AccountsService,
  LinkChildDto,
  ConfirmLinkChildDto,
  ProvisionB2BDto,
} from './accounts.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('parents/dashboard')
  @ApiOperation({
    summary: 'Parent dashboard — all children XP, streak, weekly activity',
  })
  getParentDashboard(@CurrentUser() user: { id: string }) {
    return this.accountsService.getParentDashboard(user.id);
  }

  @Post('parents/link-child/request')
  @ApiOperation({
    summary:
      "Request to link a child account — sends a verification code to the child's phone",
  })
  requestLinkChild(
    @CurrentUser() user: { id: string },
    @Body() dto: LinkChildDto,
  ) {
    return this.accountsService.requestLinkChild(user.id, dto);
  }

  @Post('parents/link-child/confirm')
  @ApiOperation({
    summary:
      'Confirm linking a child account using the code sent to their phone',
  })
  confirmLinkChild(
    @CurrentUser() user: { id: string },
    @Body() dto: ConfirmLinkChildDto,
  ) {
    return this.accountsService.confirmLinkChild(user.id, dto);
  }

  @Post('b2b/provision')
  @ApiOperation({
    summary: 'Provision a new B2B organization (school/coaching center)',
  })
  provisionB2B(
    @CurrentUser() user: { id: string },
    @Body() dto: ProvisionB2BDto,
  ) {
    return this.accountsService.provisionB2B(user.id, dto);
  }

  @Get('b2b/dashboard')
  @ApiOperation({
    summary: 'B2B admin dashboard with member progress leaderboard',
  })
  getB2BDashboard(@CurrentUser() user: { id: string }) {
    return this.accountsService.getB2BDashboard(user.id);
  }
}
