import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoginType, UserRole, UserPosition } from '../user.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique name/username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Name/Username is required' })
  name!: string;

  @ApiProperty({
    enum: LoginType,
    description: 'Type of login mechanism',
    example: LoginType.EMAIL,
  })
  @IsEnum(LoginType, { message: 'Invalid login type' })
  @IsNotEmpty()
  loginType!: LoginType;

  // --- Conditional Validations based on loginType ---
  // Phone is required ONLY if loginType is PHONE_NUMBER
  @ApiPropertyOptional({
    description: 'User phone number (Required for PHONE_NUMBER login type)',
    example: '+1234567890',
  })
  @ValidateIf((o) => o.loginType === LoginType.PHONE_NUMBER)
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required for phone login' })
  phone?: string;
  // Email is required ONLY if loginType is EMAIL
  @ApiPropertyOptional({
    description: 'User email (Required for EMAIL login type)',
    example: 'user@example.com',
  })
  @ValidateIf((o) => o.loginType === LoginType.EMAIL)
  @IsEmail({}, { message: 'A valid email address is required' })
  @IsNotEmpty({ message: 'Email is required for email login' })
  email?: string;

  // Password is required ONLY if loginType is EMAIL
  @ApiPropertyOptional({
    description: 'User password (Required for EMAIL login type)',
    example: 'password123',
  })

  // Google Account ID is required ONLY if loginType is GOOGLE
  @ApiPropertyOptional({
    description: 'Google Account ID (Required for GOOGLE login type)',
    example: 'google-oauth-id-123',
  })
  @ValidateIf((o) => o.loginType === LoginType.GOOGLE)
  @IsString()
  @IsNotEmpty({ message: 'Google account ID is required' })
  googleAccount?: string;

  // Google Account ID is required ONLY if loginType is GOOGLE
  @ApiPropertyOptional({
    description: 'Username (Required for USERNAME login type)',
    example: 'hoe_dev',
  })
  @ValidateIf((o) => o.loginType === LoginType.USERNAME)
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username?: string;

  // Apple ID is required ONLY if loginType is APPLE
  @ApiPropertyOptional({
    description: 'Apple ID (Required for APPLE login type)',
    example: 'apple-id-123',
  })
  @ValidateIf((o) => o.loginType === LoginType.APPLE)
  @IsString()
  @IsNotEmpty({ message: 'Apple ID is required' })
  appleId?: string;

  // Facebook ID is required ONLY if loginType is FACEBOOK
  @ApiPropertyOptional({
    description: 'Facebook ID (Required for FACEBOOK login type)',
    example: 'facebook-id-123',
  })
  @ValidateIf((o) => o.loginType === LoginType.FACEBOOK)
  @IsString()
  @IsNotEmpty({ message: 'Facebook ID is required' })
  facebookId?: string;

  // Telegram fields are required ONLY if loginType is TELEGRAM
  @ApiPropertyOptional({
    description: 'Telegram chat ID (Required for TELEGRAM login type)',
    example: '123456789',
  })
  @ValidateIf((o) => o.loginType === LoginType.TELEGRAM)
  @IsString()
  @IsNotEmpty({ message: 'Telegram chat ID is required' })
  telegramChatId?: string;
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required for email login' })
  password!: string;
  @ApiPropertyOptional({
    description: 'Telegram username (Required for TELEGRAM login type)',
    example: 'john_telegram',
  })
  @ValidateIf((o) => o.loginType === LoginType.TELEGRAM)
  @IsString()
  @IsNotEmpty({ message: 'Telegram username is required' })
  telegramUsername?: string;

  // --- Optional Fields ---

  @ApiPropertyOptional({
    description: 'Profile image URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Profile image must be a valid URL' })
  image?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'System role assigned to the user',
    default: UserRole.DEVELOPER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole; // Optional because entity defaults to DEVELOPER
}
