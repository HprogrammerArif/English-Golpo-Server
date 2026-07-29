"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const google_auth_library_1 = require("google-auth-library");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    config;
    logger = new common_1.Logger(AuthService_1.name);
    googleClient;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.googleClient = new google_auth_library_1.OAuth2Client(config.get('GOOGLE_CLIENT_ID'));
    }
    async register(dto) {
        if (!dto.phone && !dto.email) {
            throw new common_1.BadRequestException('Phone or email is required');
        }
        if (dto.phone) {
            const exists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
            if (exists)
                throw new common_1.ConflictException('Phone number already registered');
        }
        if (dto.email) {
            const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (exists)
                throw new common_1.ConflictException('Email already registered');
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
                learningPath: dto.learningPath,
                streak: { create: {} },
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
    async sendOtp(dto) {
        const mockEnabled = this.config.get('OTP_MOCK_ENABLED') === 'true';
        const code = mockEnabled
            ? this.config.get('OTP_MOCK_CODE', '1234')
            : this.generateOtpCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.otpRequest.updateMany({
            where: { phone: dto.phone, verified: false },
            data: { verified: true },
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
            this.logger.log(`OTP sent to ${dto.phone}`);
        }
        else {
            this.logger.warn(`[DEV] OTP for ${dto.phone}: ${code}`);
        }
        return {
            message: 'OTP sent successfully',
            expiresIn: 300,
            ...(mockEnabled && { devCode: code }),
        };
    }
    async verifyOtp(dto) {
        const mockEnabled = this.config.get('OTP_MOCK_ENABLED') === 'true';
        const mockCode = this.config.get('OTP_MOCK_CODE', '1234');
        const otpRecord = await this.prisma.otpRequest.findFirst({
            where: {
                phone: dto.phone,
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        const isMockValid = mockEnabled && dto.code === mockCode;
        if (!isMockValid && (!otpRecord || otpRecord.code !== dto.code)) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        if (otpRecord) {
            await this.prisma.otpRequest.update({
                where: { id: otpRecord.id },
                data: { verified: true },
            });
        }
        let user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
        if (!user) {
            const isDefaultAdminPhone = dto.phone === '01700000000';
            user = await this.prisma.user.create({
                data: {
                    name: isDefaultAdminPhone ? 'Admin User' : `User_${dto.phone.slice(-4)}`,
                    phone: dto.phone,
                    role: isDefaultAdminPhone ? 'ADMIN' : 'FREE',
                    streak: { create: {} },
                },
            });
            this.logger.log(`Auto-registered user via OTP: ${user.id}`);
        }
        else if (dto.phone === '01700000000' && user.role !== 'ADMIN') {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: { role: 'ADMIN' },
            });
        }
        const token = this.signToken(user.id, user.phone, user.email, user.role);
        return {
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                learningPath: user.learningPath,
                isNewUser: !user.learningPath,
            },
            token,
        };
    }
    async ssoLogin(dto) {
        let googleId;
        let email;
        let name;
        if (dto.provider === 'google') {
            try {
                const ticket = await this.googleClient.verifyIdToken({
                    idToken: dto.idToken,
                    audience: this.config.get('GOOGLE_CLIENT_ID'),
                });
                const payload = ticket.getPayload();
                if (!payload)
                    throw new Error('Empty Google payload');
                googleId = payload.sub;
                email = payload.email;
                name = payload.name || email || 'Google User';
            }
            catch (e) {
                throw new common_1.UnauthorizedException('Invalid Google ID token');
            }
        }
        else {
            throw new common_1.BadRequestException('Apple SSO coming soon');
        }
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
    async loginWithEmail(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const token = this.signToken(user.id, user.phone, user.email, user.role);
        return {
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
                learningPath: user.learningPath,
            },
            token,
        };
    }
    signToken(id, phone, email, role) {
        return this.jwt.sign({
            sub: id,
            phone,
            email,
            role: role || 'FREE',
        });
    }
    generateOtpCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map