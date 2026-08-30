import { Controller, Get, Query } from '@nestjs/common';
import { CloudflareService } from './cloudflare.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Cloudflare')
@Controller(['v1/cloudflare', 'cloudflare'])
export class CloudflareController {
  constructor(private readonly cloudflareService: CloudflareService) {}

  @Get('r2-dashboard')
  @ApiOperation({ summary: 'Get Cloudflare R2 dashboard metrics (Bucket Size, Class A & Class B Operations)' })
  @ApiQuery({ name: 'daysBack', required: false, type: Number, description: 'Days back for operations analytics (default 30)' })
  async getR2DashboardMetrics(@Query('daysBack') daysBack?: number) {
    const days = daysBack ? Number(daysBack) : 30;
    const metrics = await this.cloudflareService.getR2DashboardMetrics(days);
    return {
      success: true,
      data: metrics,
    };
  }
}
