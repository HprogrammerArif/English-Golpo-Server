export declare class RegisterDto {
    name: string;
    phone?: string;
    email?: string;
    password?: string;
    learningPath?: string;
}
export declare class PhoneLoginDto {
    phone: string;
}
export declare class VerifyOtpDto {
    phone: string;
    code: string;
}
export declare class SsoLoginDto {
    idToken: string;
    provider: 'google' | 'apple';
}
export declare class EmailLoginDto {
    email: string;
    password: string;
}
