import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActivityService } from './activity.service';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { Activity } from './entities/activity.entity';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@ApiTags('Activities')
@Controller('api/v2/projects/:projectId/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get project activity log sorted newest to oldest' })
  @ApiOkResponse({ description: 'Paginated list of activity entries.' })
  async findByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query: ActivityQueryDto,
  ): Promise<PaginatedResponseDto<Activity>> {
    return await this.activityService.findByProject(projectId, query);
  }
}
