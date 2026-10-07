import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';

@ApiTags('Dashboard')
@Controller('api/v2/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get aggregated personal project dashboard metrics, overdue tasks, active progress, and recent activities',
  })
  @ApiOkResponse({
    description: 'Dashboard overview metrics retrieved successfully.',
    type: DashboardOverviewDto,
  })
  async getDashboardOverview(): Promise<{ data: DashboardOverviewDto }> {
    const data = await this.dashboardService.getDashboardOverview();
    return { data };
  }
}
