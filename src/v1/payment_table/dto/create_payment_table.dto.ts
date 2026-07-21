import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymenttable {
  @ApiProperty({
    description: 'Payment required due date (ISO 8601 date string)',
    example: '2026-05-01',
  })
  @IsNotEmpty()
  paymentRequiredDate!: Date;

  // @ApiPropertyOptional({
  //   description: 'Actual date when payment was made',
  //   example: '2026-05-01',
  //   nullable: true,
  // })
  // @IsOptional()
  // payDate?: Date | null;

  @ApiPropertyOptional({
    description: 'Total payment amount required/paid for this period',
    example: 89.27,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  totalPayment?: number | null;

  @ApiPropertyOptional({
    description: 'Beginning balance before this payment period',
    example: 1000.0,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  beginningBalance?: number | null;

  @ApiPropertyOptional({
    description: 'Principal amount reduced in this payment period',
    example: 77.27,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  principal?: number | null;

  @ApiPropertyOptional({
    description: 'Interest amount paid in this payment period',
    example: 12.0,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  interest?: number | null;

  @ApiPropertyOptional({
    description: 'Remaining balance after this payment period',
    example: 922.73,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  remainingBalance?: number | null;

  @ApiPropertyOptional({
    description: 'UUID of the associated Loan Information record',
    example: '4eef31e2-cf02-4cd1-9540-82c6edf3127b',
    nullable: true,
  })
  @IsString()
  @IsUUID('4', { message: 'loanInformationId must be a valid UUID' })
  @IsOptional()
  loanInformationId?: string | null;
}
