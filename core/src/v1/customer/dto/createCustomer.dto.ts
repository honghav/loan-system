import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The full name of the customer',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @ApiPropertyOptional({
    description: 'The contact phone number',
    example: '+1234567890',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Telegram linking token or status flag',
    example: 'linked_account_01',
  })
  @IsString()
  @IsOptional()
  telegramLinked?: string;
  
  @ApiPropertyOptional({
    description: 'The image of the customer',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'The citizen ID of the customer',
    example: '123456789',
  })
  @IsString()
  @IsOptional()
  citizenId?: string;
 
  @ApiPropertyOptional({
    description: 'The user ID of the customer',
    example: 'user_12345',
  })
  @IsString()
  @IsOptional()
 userId?: string;

  @ApiPropertyOptional({
    description: 'The Telegram handle/username without the @ symbol',
    example: 'john_tg',
  })
  @IsString()
  @IsOptional()
  telegramUsername?: string;

  @ApiPropertyOptional({
    description: 'The unique Telegram chat ID used for sending direct messages',
    example: '987654321',
  })
  @IsString()
  @IsOptional()
  telegramChatId?: string;
}
