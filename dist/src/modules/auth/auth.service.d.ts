import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, PhoneLoginDto, VerifyOtpDto, SsoLoginDto, EmailLoginDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly logger;
    private readonly googleClient;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            name: string;
            role: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            createdAt: Date;
        };
        token: string;
    }>;
    sendOtp(dto: PhoneLoginDto): Promise<{
        devCode?: string | undefined;
        message: string;
        expiresIn: number;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string | null;
            role: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            isNewUser: boolean;
        };
        token: string;
    }>;
    ssoLogin(dto: SsoLoginDto): Promise<{
        user: {
            id: string;
            name: string;
            email: string | null;
            role: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
            isNewUser: boolean;
        };
        token: string;
    }>;
    loginWithEmail(dto: EmailLoginDto): Promise<{
        user: {
            id: string;
            name: string;
            phone: string | null;
            email: string | null;
            role: string;
            learningPath: import("@prisma/client").$Enums.LearningPath | null;
        };
        token: string;
    }>;
    private signToken;
    private generateOtpCode;
}
