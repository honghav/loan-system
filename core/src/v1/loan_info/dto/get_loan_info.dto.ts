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
import { User } from 'src/v1/users/user.entity';
import {
  LoanInformationPaymentType,
  LoanInformationStatus,
} from '../loan_infor.entity';
import { Customer } from 'src/v1/customer/customer.enitity';

export class GetLoanInfoDto {
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
    description: 'Search text for filtering loans (e.g. by loan purpose)',
    example: 'Business Expansion',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by loan status',
    enum: LoanInformationStatus,
  })
  @IsOptional()
  @IsEnum(LoanInformationStatus, { message: 'Invalid loan information status' })
  status?: LoanInformationStatus;

  @ApiPropertyOptional({
    description: 'Filter by loan payment type',
    enum: LoanInformationPaymentType,
  })
  @IsOptional()
  @IsEnum(LoanInformationPaymentType, {
    message: 'Invalid loan information payment type',
  })
  paymentType?: LoanInformationPaymentType;

  @ApiPropertyOptional({
    description: 'Filter by assigned User UUID',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'userId must be a valid UUID' })
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Loan Type UUID',
    example: 'b1ffbc88-8b0a-3ef7-aa5c-5aa8ac270a22',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'loanTypeId must be a valid UUID' })
  loanTypeId?: string;

  @ApiPropertyOptional({
    description: 'Filter by Customer UUID',
    example: 'c2eebc77-7a0a-2ef6-994b-4aa7ac160a33',
  })
  @IsOptional()
  @IsString()
  @IsUUID('4', { message: 'customerId must be a valid UUID' })
  customerId?: string;

  @ApiPropertyOptional({
    description:
      'Filter loans with start date on or after this date (YYYY-MM-DD)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({
    description:
      'Filter loans with end date on or before this date (YYYY-MM-DD)',
    example: '2026-12-31',
  })
  @IsOptional()
  @IsString()
  endDate?: string;

  user?: User;
  customer?: Customer; // Assuming Customer entity is defined elsewhere in your project. Make sure to import it if it's in a different file.
}
