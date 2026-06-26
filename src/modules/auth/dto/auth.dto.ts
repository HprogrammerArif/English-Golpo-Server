import { IsOptional, IsString, IsEmail, MinLength, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Rafi Ahmed' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: '+8801712345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'rafi@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'securepassword' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ enum: ['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB'] })
  @IsOptional()
  @IsIn(['KIDS', 'SPOKEN', 'IELTS', 'ADMISSION', 'JOB', 'VOCAB'])
  learningPath?: string;
}

export class PhoneLoginDto {
  @ApiProperty({ example: '+8801712345678' })
  @IsString()
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+8801712345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  code: string;
}

export class SsoLoginDto {
  @ApiProperty({ description: 'Google ID token from client' })
  @IsString()
  idToken: string;

  @ApiProperty({ enum: ['google', 'apple'] })
  @IsIn(['google', 'apple'])
  provider: 'google' | 'apple';
}
