import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityAction } from '../../common/enums/activity-action.enum';
import { ActivityQueryDto } from './dto/activity-query.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

export interface LogActivityParams {
  projectId: string;
  featureId?: string | null;
  taskId?: string | null;
  action: ActivityAction;
  description: string;
}

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity, 'v2Connection')
    private readonly activityRepo: Repository<Activity>,
  ) {}

  async logActivity(params: LogActivityParams): Promise<Activity> {
    const activity = this.activityRepo.create({
      projectId: params.projectId,
      featureId: params.featureId || null,
      taskId: params.taskId || null,
      action: params.action,
      description: params.description,
    });
    return await this.activityRepo.save(activity);
  }

  async findByProject(
    projectId: string,
    query: ActivityQueryDto,
  ): Promise<PaginatedResponseDto<Activity>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.activityRepo.findAndCount({
      where: { projectId },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return await this.activityRepo.find({
      order: { createdAt: 'DESC' },
      take: limit,
      relations: { project: true },
    });
  }
}
