"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailLoginDto = exports.SsoLoginDto = exports.VerifyOtpDto = exports.PhoneLoginDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterDto {
    name;
    phone;
    email;
    password;
    learningPath;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Rafi Ahmed' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+8801712345678' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'rafi@example.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'securepassword' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB']),
    __metadata("design:type", String)
], RegisterDto.prototype, "learningPath", void 0);
class PhoneLoginDto {
    phone;
}
exports.PhoneLoginDto = PhoneLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+8801712345678' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PhoneLoginDto.prototype, "phone", void 0);
class VerifyOtpDto {
    phone;
    code;
}
exports.VerifyOtpDto = VerifyOtpDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+8801712345678' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1234' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "code", void 0);
class SsoLoginDto {
    idToken;
    provider;
}
exports.SsoLoginDto = SsoLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Google ID token from client' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SsoLoginDto.prototype, "idToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['google', 'apple'] }),
    (0, class_validator_1.IsIn)(['google', 'apple']),
    __metadata("design:type", String)
], SsoLoginDto.prototype, "provider", void 0);
class EmailLoginDto {
    email;
    password;
}
exports.EmailLoginDto = EmailLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@englishgolpo.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], EmailLoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin123' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EmailLoginDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map