import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureQueryDto } from './dto/feature-query.dto';
import { ProjectService } from '../projects/project.service';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { ActivityService } from '../activities/activity.service';
import { ActivityAction } from '../../common/enums/activity-action.enum';
import { FeatureProgressSummaryDto } from '../../common/dto/progress-summary.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

export interface FeatureWithProgress extends Feature {
  progress: FeatureProgressSummaryDto;
}

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature, 'v2Connection')
    private readonly featureRepo: Repository<Feature>,
    @InjectRepository(Task, 'v2Connection')
    private readonly taskRepo: Repository<Task>,
    private readonly projectService: ProjectService,
    private readonly activityService: ActivityService,
  ) {}

  async create(projectId: string, dto: CreateFeatureDto): Promise<Feature> {
    await this.projectService.findEntityOnly(projectId);

    const feature = this.featureRepo.create({
      ...dto,
      projectId,
    });

    const saved = await this.featureRepo.save(feature);

    await this.activityService.logActivity({
      projectId,
      featureId: saved.id,
      action: ActivityAction.FEATURE_CREATED,
      description: `Feature "${saved.name}" was created`,
    });

    return saved;
  }

  async calculateFeatureProgress(featureId: string): Promise<FeatureProgressSummaryDto> {
    const totalTasks = await this.taskRepo.count({ where: { featureId } });
    const completedTasks = await this.taskRepo.count({
      where: { featureId, status: TaskStatus.DONE },
    });
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { featureId, totalTasks, completedTasks, progress };
  }

  async findAllByProject(
    projectId: string,
    query: FeatureQueryDto,
  ): Promise<PaginatedResponseDto<FeatureWithProgress>> {
    await this.projectService.findEntityOnly(projectId);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.featureRepo.createQueryBuilder('feature');
    qb.where('feature.projectId = :projectId', { projectId });

    if (query.search) {
      qb.andWhere(
        '(LOWER(feature.name) LIKE LOWER(:search) OR LOWER(feature.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query.status) {
      qb.andWhere('feature.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('feature.priority = :priority', { priority: query.priority });
    }

    qb.orderBy('feature.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [features, total] = await qb.getManyAndCount();

    const dataWithProgress: FeatureWithProgress[] = await Promise.all(
      features.map(async (feature) => {
        const progress = await this.calculateFeatureProgress(feature.id);
        return {
          ...feature,
          progress,
        };
      }),
    );

    return new PaginatedResponseDto(dataWithProgress, total, page, limit);
  }

  async findOne(id: string): Promise<FeatureWithProgress> {
    const feature = await this.featureRepo.findOne({
      where: { id },
      relations: { project: true },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID "${id}" not found`);
    }

    const progress = await this.calculateFeatureProgress(id);

    return {
      ...feature,
      progress,
    };
  }

  async findEntityOnly(id: string): Promise<Feature> {
    const feature = await this.featureRepo.findOne({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature with ID "${id}" not found`);
    }
    return feature;
  }

  async update(id: string, dto: UpdateFeatureDto): Promise<FeatureWithProgress> {
    const feature = await this.findEntityOnly(id);
    Object.assign(feature, dto);
    const updated = await this.featureRepo.save(feature);

    await this.activityService.logActivity({
      projectId: updated.projectId,
      featureId: updated.id,
      action: ActivityAction.FEATURE_UPDATED,
      description: `Feature "${updated.name}" was updated`,
    });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const feature = await this.findEntityOnly(id);
    await this.featureRepo.remove(feature);

    await this.activityService.logActivity({
      projectId: feature.projectId,
      featureId: null,
      action: ActivityAction.FEATURE_DELETED,
      description: `Feature "${feature.name}" was deleted`,
    });

    return { message: `Feature "${id}" successfully deleted` };
  }
}
