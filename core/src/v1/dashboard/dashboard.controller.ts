import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardOverviewResponseDto } from './dto/dashboard-overview.dto';

@ApiTags('Dashboard')
@Controller('v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get dashboard overview analytics and KPIs',
    description:
      'Returns overall KPIs, weekly & monthly payment totals, top active loan customers, and status summaries.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard overview fetched successfully.',
    type: DashboardOverviewResponseDto,
  })
  async getOverview() {
    return await this.dashboardService.getOverview();
  }

  @Get('payments')
  @ApiOperation({
    summary: 'Get scheduled payments filtered by week or month',
    description:
      'Returns payment table items due in current week or a specified month with customer details.',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['week', 'month'],
    description: 'Period filter type (default is "week")',
  })
  @ApiQuery({
    name: 'month',
    required: false,
    type: String,
    description: 'Specific month in YYYY-MM format (e.g. 2026-08)',
  })
  @ApiResponse({
    status: 200,
    description: 'Filterable payments fetched successfully.',
  })
  async getPayments(
    @Query('period') period?: string,
    @Query('month') month?: string,
  ) {
    return await this.dashboardService.getPaymentsByPeriod(period, month);
  }
}
