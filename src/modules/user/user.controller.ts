import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService, UpdateProfileDto } from './user.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with subscription, streak, and level' })
  getMe(@CurrentUser() user: { id: string }) {
    return this.userService.getMe(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update profile: name, avatar, learning path, WhatsApp opt-in' })
  updateMe(@CurrentUser() user: { id: string }, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, dto);
  }
}
