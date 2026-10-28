import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Display name or full name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+85512345678',
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL or Base64 string',
    example: 'data:image/png;base64,...',
  })
  @IsOptional()
  @IsString({ message: 'Image must be a string' })
  image?: string;

  @ApiPropertyOptional({
    description: 'Telegram username',
    example: 'john_dev',
  })
  @IsOptional()
  @IsString({ message: 'Telegram username must be a string' })
  telegramUsername?: string;

  @ApiPropertyOptional({
    description: 'Telegram Chat ID',
    example: '123456789',
  })
  @IsOptional()
  @IsString({ message: 'Telegram chat ID must be a string' })
  telegramChatId?: string;

  @ApiPropertyOptional({
    description: 'Telegram Linked identifier or flag',
    example: 'true',
  })
  @IsOptional()
  @IsString({ message: 'Telegram linked must be a string' })
  telegramLinked?: string;
}
