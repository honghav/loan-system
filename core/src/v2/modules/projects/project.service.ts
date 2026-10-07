import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectQueryDto } from './dto/project-query.dto';
import { Task } from '../tasks/entities/task.entity';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { ActivityService } from '../activities/activity.service';
import { ActivityAction } from '../../common/enums/activity-action.enum';
import { ProgressSummaryDto } from '../../common/dto/progress-summary.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

export interface ProjectWithProgress extends Project {
  progress: ProgressSummaryDto;
}

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project, 'v2Connection')
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Task, 'v2Connection')
    private readonly taskRepo: Repository<Task>,
    private readonly activityService: ActivityService,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepo.create(dto);
    const saved = await this.projectRepo.save(project);

    await this.activityService.logActivity({
      projectId: saved.id,
      action: ActivityAction.PROJECT_CREATED,
      description: `Project "${saved.name}" was created`,
    });

    return saved;
  }

  async calculateProjectProgress(projectId: string): Promise<ProgressSummaryDto> {
    const totalTasks = await this.taskRepo.count({ where: { projectId } });
    const completedTasks = await this.taskRepo.count({
      where: { projectId, status: TaskStatus.DONE },
    });
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return { totalTasks, completedTasks, progress };
  }

  async findAll(query: ProjectQueryDto): Promise<PaginatedResponseDto<ProjectWithProgress>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.projectRepo.createQueryBuilder('project');

    if (query.search) {
      qb.andWhere(
        '(LOWER(project.name) LIKE LOWER(:search) OR LOWER(project.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query.status) {
      qb.andWhere('project.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('project.priority = :priority', { priority: query.priority });
    }

    qb.orderBy('project.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [projects, total] = await qb.getManyAndCount();

    const dataWithProgress: ProjectWithProgress[] = await Promise.all(
      projects.map(async (project) => {
        const progress = await this.calculateProjectProgress(project.id);
        return {
          ...project,
          progress,
        };
      }),
    );

    return new PaginatedResponseDto(dataWithProgress, total, page, limit);
  }

  async findOne(id: string): Promise<ProjectWithProgress> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    const progress = await this.calculateProjectProgress(id);
    return {
      ...project,
      progress,
    };
  }

  async findEntityOnly(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }
    return project;
  }

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectWithProgress> {
    const project = await this.findEntityOnly(id);
    Object.assign(project, dto);
    const updated = await this.projectRepo.save(project);

    await this.activityService.logActivity({
      projectId: updated.id,
      action: ActivityAction.PROJECT_UPDATED,
      description: `Project "${updated.name}" was updated`,
    });

    return await this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    const project = await this.findEntityOnly(id);
    await this.projectRepo.remove(project);
    return { message: `Project "${id}" successfully deleted` };
  }
}
