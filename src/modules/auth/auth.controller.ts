import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, PhoneLoginDto, VerifyOtpDto, SsoLoginDto } from './dto/auth.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
@Public() // All auth routes are public (no JWT required)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User created, JWT returned' })
  @ApiResponse({ status: 409, description: 'Phone/email already registered' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login/phone')
  @HttpCode(HttpStatus.OK)
  @Throttle({ short: { ttl: 60000, limit: 3 } }) // Max 3 OTP requests per minute
  @ApiOperation({ summary: 'Request a phone OTP (6-digit code sent via SMS)' })
  @ApiResponse({ status: 200, description: 'OTP sent to phone' })
  sendOtp(@Body() dto: PhoneLoginDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('login/phone/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and receive JWT token' })
  @ApiResponse({ status: 200, description: 'OTP verified, JWT returned' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('login/sso')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login via Google or Apple ID token' })
  @ApiResponse({ status: 200, description: 'SSO authenticated, JWT returned' })
  ssoLogin(@Body() dto: SsoLoginDto) {
    return this.authService.ssoLogin(dto);
  }
}
