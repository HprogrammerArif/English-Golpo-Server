import { AuthService } from './auth.service';
import { RegisterDto, PhoneLoginDto, VerifyOtpDto, SsoLoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
}
