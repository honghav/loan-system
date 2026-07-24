import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/v1/users/user.entity';

export class GetLoanTypeDTO {
  @ApiPropertyOptional({
    description: 'Name of frequency',
    example: 'weekly',
  })
  @IsString()
  @IsNotEmpty()
  frequency!: string;

  @ApiPropertyOptional({
    description: 'how to frequency day need to loop',
    example: '7',
  })
  @IsString()
  @IsNotEmpty()
  frequency_day!: number;
  @ApiPropertyOptional({
    description: 'The Description of loan type',
    example: 'week ',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The Id of customer',
    example: 'uuid',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  user?: User;
}
