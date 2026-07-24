import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from '../loan_infor.entity';
import { CreatePaymenttable } from 'src/v1/payment_table/dto/create_payment_table.dto';

export class CreateLoanInformation {
  @ApiProperty({
    description: 'The principal loan amount',
    example: '1000.00',
  })
  @IsString()
  @IsNotEmpty()
  amount!: string;

  @ApiPropertyOptional({
    description: 'The purpose of taking the loan',
    example: 'Business expansion',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  purposeOfLoan?: string | null;

  @ApiPropertyOptional({
    description: 'Associated processing fee for the loan',
    example: '50.00',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  loanFee?: string | null;

  @ApiPropertyOptional({
    description: 'Penalty interest rate percentage',
    example: '2.50',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  penaltyRate?: string | null;

  @ApiProperty({
    description: 'Start date of the loan (ISO date string or Date object)',
    example: '2026-01-01',
  })
  @IsNotEmpty()
  startDate!: Date;

  @ApiPropertyOptional({
    description: 'End date of the loan (ISO date string or Date object)',
    example: '2026-12-31',
    nullable: true,
  })
  @IsOptional()
  endDate?: Date | null;

  @ApiPropertyOptional({
    description: 'Status of the loan information',
    enum: LoanInformationStatus,
    default: LoanInformationStatus.IN_PAYMENT,
    example: LoanInformationStatus.IN_PAYMENT,
  })
  @IsOptional()
  @IsEnum(LoanInformationStatus, { message: 'Invalid Loan Information status' })
  status!: LoanInformationStatus;

  @ApiPropertyOptional({
    description: 'Payment type of the loan',
    enum: LoanInformationPaymentType,
    default: LoanInformationPaymentType.INSTALLMENT_PAYMENT,
    example: LoanInformationPaymentType.INSTALLMENT_PAYMENT,
  })
  @IsOptional()
  @IsEnum(LoanInformationPaymentType, {
    message: 'Invalid Loan Information Payment Type',
  })
  paymentType!: LoanInformationPaymentType;

  @ApiPropertyOptional({
    description: 'UUID of the user (officer/staff) assigned to this loan',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  userId?: string | null;

  @ApiPropertyOptional({
    description: 'UUID of the associated loan type',
    example: 'b1ffbc88-8b0a-3ef7-aa5c-5aa8ac270a22',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  loanTypeId?: string | null;

  @ApiPropertyOptional({
    description: 'UUID of the customer borrowing',
    example: 'c2eebc77-7a0a-2ef6-994b-4aa7ac160a33',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  customerId?: string | null;

}
