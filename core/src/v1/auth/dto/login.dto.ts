import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginType } from 'src/v1/users/user.entity';
export class LoginDto {
  @ApiProperty({
    enum: LoginType,
    description: 'Type of login mechanism',
    example: LoginType.EMAIL,
  })
  @IsEnum(LoginType, { message: 'Invalid login type' })
  @IsNotEmpty({ message: 'Login type is required' })
  loginType!: LoginType;

  // --- Conditional Validations based on loginType ---

  // Email is required ONLY if loginType is EMAIL
  @ApiPropertyOptional({ example: 'admin@example.com' })
  @ValidateIf((o) => o.loginType === LoginType.EMAIL)
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required for email login' })
  email?: string;

  // Password is required ONLY if loginType is EMAIL or USERNAME
  @ApiPropertyOptional({ example: 'password123' })
  @ValidateIf(
    (o) =>
      o.loginType === LoginType.EMAIL || o.loginType === LoginType.USERNAME,
  )
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password?: string;

  // Phone is required ONLY if loginType is PHONE_NUMBER
  @ApiPropertyOptional({ example: '+1234567890' })
  @ValidateIf((o) => o.loginType === LoginType.PHONE_NUMBER)
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required for phone login' })
  phone?: string;

  // Username is required ONLY if loginType is USERNAME
  @ApiPropertyOptional({ example: 'admin' })
  @ValidateIf((o) => o.loginType === LoginType.USERNAME)
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username?: string;

  // Google Account ID is required ONLY if loginType is GOOGLE
  @ApiPropertyOptional({ example: 'google-oauth-id-123' })
  @ValidateIf((o) => o.loginType === LoginType.GOOGLE)
  @IsString()
  @IsNotEmpty({ message: 'Google account ID is required' })
  googleAccount?: string;

  // Apple ID is required ONLY if loginType is APPLE
  @ApiPropertyOptional({ example: 'apple-id-123' })
  @ValidateIf((o) => o.loginType === LoginType.APPLE)
  @IsString()
  @IsNotEmpty({ message: 'Apple ID is required' })
  appleId?: string;

  // Facebook ID is required ONLY if loginType is FACEBOOK
  @ApiPropertyOptional({ example: 'facebook-id-123' })
  @ValidateIf((o) => o.loginType === LoginType.FACEBOOK)
  @IsString()
  @IsNotEmpty({ message: 'Facebook ID is required' })
  facebookId?: string;

  // Telegram Chat ID is required ONLY if loginType is TELEGRAM
  @ApiPropertyOptional({ example: '123456789' })
  @ValidateIf((o) => o.loginType === LoginType.TELEGRAM)
  @IsString()
  @IsNotEmpty({ message: 'Telegram chat ID is required' })
  telegramUsername?: string;
}
