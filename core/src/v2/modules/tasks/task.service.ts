import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { ProjectService } from '../projects/project.service';
import { FeatureService } from '../features/feature.service';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { ActivityService } from '../activities/activity.service';
import { ActivityAction } from '../../common/enums/activity-action.enum';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task, 'v2Connection')
    private readonly taskRepo: Repository<Task>,
    private readonly projectService: ProjectService,
    private readonly featureService: FeatureService,
    private readonly activityService: ActivityService,
  ) {}

  async create(projectId: string, dto: CreateTaskDto): Promise<Task> {
    await this.projectService.findEntityOnly(projectId);

    if (dto.featureId) {
      const feature = await this.featureService.findEntityOnly(dto.featureId);
      if (feature.projectId !== projectId) {
        throw new BadRequestException(
          `Feature "${dto.featureId}" does not belong to Project "${projectId}"`,
        );
      }
    }

    const initialStatus = dto.status || TaskStatus.TODO;
    const completedAt = initialStatus === TaskStatus.DONE ? new Date() : null;

    const task = this.taskRepo.create({
      ...dto,
      projectId,
      status: initialStatus,
      completedAt,
    });

    const saved = await this.taskRepo.save(task);

    const action =
      initialStatus === TaskStatus.DONE
        ? ActivityAction.TASK_COMPLETED
        : ActivityAction.TASK_CREATED;

    await this.activityService.logActivity({
      projectId,
      featureId: saved.featureId,
      taskId: saved.id,
      action,
      description: `Task "${saved.title}" was created with status "${saved.status}"`,
    });

    return saved;
  }

  async findAllByProject(
    projectId: string,
    query: TaskQueryDto,
  ): Promise<PaginatedResponseDto<Task>> {
    await this.projectService.findEntityOnly(projectId);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.taskRepo.createQueryBuilder('task');
    qb.where('task.projectId = :projectId', { projectId });

    if (query.search) {
      qb.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }

    if (query.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }

    if (query.featureId) {
      qb.andWhere('task.featureId = :featureId', { featureId: query.featureId });
    }

    if (query.dueDate) {
      qb.andWhere('task.dueDate <= :dueDate', { dueDate: query.dueDate });
    }

    qb.orderBy('task.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: { project: true, feature: true },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    const oldStatus = task.status;

    if (dto.featureId && dto.featureId !== task.featureId) {
      const feature = await this.featureService.findEntityOnly(dto.featureId);
      if (feature.projectId !== task.projectId) {
        throw new BadRequestException(
          `Feature "${dto.featureId}" does not belong to Project "${task.projectId}"`,
        );
      }
    }

    if (dto.status && dto.status !== task.status) {
      if (dto.status === TaskStatus.DONE) {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }
    }

    Object.assign(task, dto);
    const updated = await this.taskRepo.save(task);

    if (dto.status && dto.status !== oldStatus) {
      const action =
        dto.status === TaskStatus.DONE
          ? ActivityAction.TASK_COMPLETED
          : ActivityAction.TASK_STATUS_CHANGED;

      await this.activityService.logActivity({
        projectId: updated.projectId,
        featureId: updated.featureId,
        taskId: updated.id,
        action,
        description: `Task "${updated.title}" status changed from "${oldStatus}" to "${updated.status}"`,
      });
    } else {
      await this.activityService.logActivity({
        projectId: updated.projectId,
        featureId: updated.featureId,
        taskId: updated.id,
        action: ActivityAction.TASK_UPDATED,
        description: `Task "${updated.title}" details were updated`,
      });
    }

    return updated;
  }

  async updateStatus(id: string, dto: UpdateTaskStatusDto): Promise<Task> {
    const task = await this.findOne(id);
    const oldStatus = task.status;

    if (task.status !== dto.status) {
      task.status = dto.status;
      if (dto.status === TaskStatus.DONE) {
        task.completedAt = new Date();
      } else {
        task.completedAt = null;
      }

      const updated = await this.taskRepo.save(task);

      const action =
        dto.status === TaskStatus.DONE
          ? ActivityAction.TASK_COMPLETED
          : ActivityAction.TASK_STATUS_CHANGED;

      await this.activityService.logActivity({
        projectId: updated.projectId,
        featureId: updated.featureId,
        taskId: updated.id,
        action,
        description: `Task "${updated.title}" status changed from "${oldStatus}" to "${updated.status}"`,
      });

      return updated;
    }

    return task;
  }

  async remove(id: string): Promise<{ message: string }> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);

    await this.activityService.logActivity({
      projectId: task.projectId,
      featureId: task.featureId,
      taskId: null,
      action: ActivityAction.TASK_DELETED,
      description: `Task "${task.title}" was deleted`,
    });

    return { message: `Task "${id}" successfully deleted` };
  }
}
