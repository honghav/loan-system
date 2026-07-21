import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PaymentStatus } from '../payment_table.entity';

export class GetPaymenttable {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by Loan Information UUID',
    example: '4eef31e2-cf02-4cd1-9540-82c6edf3127b',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'loanInformationId must be a valid UUID' })
  loanInformationId?: string;

  @ApiPropertyOptional({
    description: 'Filter payment schedules due on or after this date (YYYY-MM-DD)',
    example: '2026-05-01',
  })
  @IsOptional()
  @IsString()
  paymentRequiredDate?: string;

  @ApiPropertyOptional({
    description: 'Filter actual payments made on or after this date (YYYY-MM-DD)',
    example: '2026-05-01',
  })
  @IsOptional()
  @IsString()
  payDate?: string;

    @IsOptional()
    @IsEnum(PaymentStatus, {
      message: 'Invalid Payment Status',
    })
    status!: PaymentStatus;
  
}
