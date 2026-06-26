import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, PhoneLoginDto, VerifyOtpDto, SsoLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(config.get('GOOGLE_CLIENT_ID'));
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  async register(dto: RegisterDto) {
    // Validate at least one identifier is provided
    if (!dto.phone && !dto.email) {
      throw new BadRequestException('Phone or email is required');
    }

    // Check for existing user
    if (dto.phone) {
      const exists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (exists) throw new ConflictException('Phone number already registered');
    }
    if (dto.email) {
      const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (exists) throw new ConflictException('Email already registered');
    }

    const passwordHash = dto.password
      ? await bcrypt.hash(dto.password, 12)
      : undefined;

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        passwordHash,
        learningPath: dto.learningPath as any,
        streak: { create: {} }, // Create empty streak record
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        learningPath: true,
        createdAt: true,
      },
    });

    this.logger.log(`New user registered: ${user.id}`);

    const token = this.signToken(user.id, user.phone, user.email, user.role);
    return { user, token };
  }

  // ─── Phone OTP ────────────────────────────────────────────────────────────

  async sendOtp(dto: PhoneLoginDto) {
    const mockEnabled = this.config.get<string>('OTP_MOCK_ENABLED') === 'true';
    const code = mockEnabled
      ? this.config.get<string>('OTP_MOCK_CODE', '1234')
      : this.generateOtpCode();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalidate previous OTPs for this phone
    await this.prisma.otpRequest.updateMany({
      where: { phone: dto.phone, verified: false },
      data: { verified: true }, // Mark as used
    });

    await this.prisma.otpRequest.create({
      data: {
        phone: dto.phone,
        code,
        expiresAt,
        purpose: 'LOGIN',
      },
    });

    if (!mockEnabled) {
      // TODO: await this.twilioService.sendSms(dto.phone, `Your English Golpo code: ${code}`)
      this.logger.log(`OTP sent to ${dto.phone}`);
    } else {
      this.logger.warn(`[DEV] OTP for ${dto.phone}: ${code}`);
    }

    return {
      message: 'OTP sent successfully',
      expiresIn: 300,
      // Only return code in dev mode
      ...(mockEnabled && { devCode: code }),
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.otpRequest.findFirst({
      where: {
        phone: dto.phone,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord || otpRecord.code !== dto.code) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.otpRequest.update({
      where: { id: otpRecord.id },
      data: { verified: true },
    });

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });

    if (!user) {
      // Auto-register on first OTP verify
      user = await this.prisma.user.create({
        data: {
          name: `User_${dto.phone.slice(-4)}`,
          phone: dto.phone,
          streak: { create: {} },
        },
      });
      this.logger.log(`Auto-registered user via OTP: ${user.id}`);
    }

    const token = this.signToken(user.id, user.phone, user.email, user.role);
    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        learningPath: user.learningPath,
        isNewUser: !user.learningPath, // True if they haven't selected a path yet
      },
      token,
    };
  }

  // ─── Google / Apple SSO ───────────────────────────────────────────────────

  async ssoLogin(dto: SsoLoginDto) {
    let googleId: string;
    let email: string | undefined;
    let name: string;

    if (dto.provider === 'google') {
      try {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: dto.idToken,
          audience: this.config.get('GOOGLE_CLIENT_ID'),
        });
        const payload = ticket.getPayload();
        if (!payload) throw new Error('Empty Google payload');
        googleId = payload.sub;
        email = payload.email;
        name = payload.name || email || 'Google User';
      } catch (e) {
        throw new UnauthorizedException('Invalid Google ID token');
      }
    } else {
      // Apple SSO — TODO: implement Apple token verification
      // For now treat idToken as a unique sub
      throw new BadRequestException('Apple SSO coming soon');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          streak: { create: {} },
        },
      });
    }

    const token = this.signToken(user.id, user.phone, user.email, user.role);
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        learningPath: user.learningPath,
        isNewUser: !user.learningPath,
      },
      token,
    };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private signToken(id: string, phone?: string | null, email?: string | null, role?: string) {
    return this.jwt.sign({
      sub: id,
      phone,
      email,
      role: role || 'FREE',
    });
  }

  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
