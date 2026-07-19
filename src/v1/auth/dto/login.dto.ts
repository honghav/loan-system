import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginType } from '../../users/user.entity';

export class LoginDto {
  @ApiProperty({ enum: LoginType, example: LoginType.EMAIL })
  @IsEnum(LoginType)
  @IsNotEmpty()
  loginType!: LoginType;

  @ApiProperty({ required: false, example: 'admin@example.com' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false, example: 'admin' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ required: false, example: 'password123' })
  @IsString()
  @IsOptional()
  password?: string;
}
