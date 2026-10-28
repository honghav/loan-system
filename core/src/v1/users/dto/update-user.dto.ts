import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { LoginType, UserRole, UserStatus } from '../user.entity';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Display name or full name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Unique username for login',
    example: 'john_doe',
  })
  @IsOptional()
  @IsString({ message: 'Username must be a string' })
  username?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+85512345678',
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Google account identifier',
    example: 'google-oauth-123',
  })
  @IsOptional()
  @IsString()
  googleAccount?: string;

  @ApiPropertyOptional({
    description: 'Apple ID',
    example: 'apple-123',
  })
  @IsOptional()
  @IsString()
  appleId?: string;

  @ApiPropertyOptional({
    description: 'Facebook ID',
    example: 'facebook-123',
  })
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiPropertyOptional({
    description: 'Telegram chat ID',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  telegramChatId?: string;

  @ApiPropertyOptional({
    description: 'Telegram username',
    example: 'john_dev',
  })
  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @ApiPropertyOptional({
    description: 'Telegram linked identifier or flag',
    example: 'true',
  })
  @IsOptional()
  @IsString()
  telegramLinked?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL or Base64 string',
    example: 'data:image/png;base64,...',
  })
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;

  @ApiPropertyOptional({
    enum: LoginType,
    description: 'Type of login mechanism',
    example: LoginType.EMAIL,
  })
  @IsOptional()
  @IsEnum(LoginType, { message: 'Invalid login type' })
  loginType?: LoginType;

  @ApiPropertyOptional({
    enum: UserRole,
    description: 'System role assigned to user',
    example: UserRole.DEVELOPER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;

  @ApiPropertyOptional({
    enum: UserStatus,
    description: 'Account status',
    example: UserStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Invalid user status' })
  status?: UserStatus;
}
