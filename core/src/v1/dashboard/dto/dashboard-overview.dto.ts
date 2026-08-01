import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TopActiveCustomerDto {
  @ApiProperty()
  customerId!: string;

  @ApiProperty()
  customerName!: string;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  image?: string;

  @ApiPropertyOptional()
  telegramUsername?: string;

  @ApiProperty()
  loanId!: string;

  @ApiPropertyOptional()
  loanNumber?: string;

  @ApiProperty()
  loanAmount!: number;

  @ApiProperty()
  loanStatus!: string;

  @ApiProperty()
  startDate!: Date;

  @ApiPropertyOptional()
  endDate?: Date | null;
}

export class DashboardKpiDto {
  @ApiProperty()
  totalCustomers!: number;

  @ApiProperty()
  totalActiveLoans!: number;

  @ApiProperty()
  totalCompletedLoans!: number;

  @ApiProperty()
  totalDisbursedAmount!: number;

  @ApiProperty()
  thisWeekPaymentTotal!: number;

  @ApiProperty()
  thisWeekPaymentCount!: number;

  @ApiProperty()
  thisMonthPaymentTotal!: number;

  @ApiProperty()
  thisMonthPaymentCount!: number;

  @ApiProperty()
  totalOverdueAmount!: number;

  @ApiProperty()
  totalOverdueCount!: number;

  @ApiProperty()
  totalCollectedAmount!: number;
}

export class StatusBreakdownDto {
  @ApiProperty()
  status!: string;

  @ApiProperty()
  count!: number;

  @ApiProperty()
  totalAmount!: number;
}

export class DashboardOverviewResponseDto {
  @ApiProperty({ type: DashboardKpiDto })
  kpi!: DashboardKpiDto;

  @ApiProperty({ type: [TopActiveCustomerDto] })
  topActiveLoanCustomers!: TopActiveCustomerDto[];

  @ApiProperty({ type: [StatusBreakdownDto] })
  loanStatusSummary!: StatusBreakdownDto[];

  @ApiProperty({ type: [StatusBreakdownDto] })
  paymentStatusSummary!: StatusBreakdownDto[];
}
