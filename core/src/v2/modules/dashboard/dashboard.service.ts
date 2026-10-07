import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Repository, Between } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { Task } from '../tasks/entities/task.entity';
import { ProjectStatus } from '../../common/enums/project-status.enum';
import { TaskStatus } from '../../common/enums/task-status.enum';
import { ProjectService, ProjectWithProgress } from '../projects/project.service';
import { ActivityService } from '../activities/activity.service';
import {
  DashboardOverviewDto,
  ProjectStatisticsDto,
  TaskStatisticsDto,
} from './dto/dashboard-overview.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Project, 'v2Connection')
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Task, 'v2Connection')
    private readonly taskRepo: Repository<Task>,
    private readonly projectService: ProjectService,
    private readonly activityService: ActivityService,
  ) {}

  async getDashboardOverview(): Promise<DashboardOverviewDto> {
    const now = new Date();

    // 1. Calculate Project Statistics
    const totalProjects = await this.projectRepo.count();
    const activeProjectsCount = await this.projectRepo.count({
      where: { status: ProjectStatus.IN_PROGRESS },
    });
    const completedProjects = await this.projectRepo.count({
      where: { status: ProjectStatus.COMPLETED },
    });
    const onHoldProjects = await this.projectRepo.count({
      where: { status: ProjectStatus.ON_HOLD },
    });
    const planningProjects = await this.projectRepo.count({
      where: { status: ProjectStatus.PLANNING },
    });
    const archivedProjects = await this.projectRepo.count({
      where: { status: ProjectStatus.ARCHIVED },
    });

    const projectStats: ProjectStatisticsDto = {
      totalProjects,
      activeProjects: activeProjectsCount,
      completedProjects,
      onHoldProjects,
      planningProjects,
      archivedProjects,
    };

    // 2. Calculate Task Statistics
    const totalTasks = await this.taskRepo.count();
    const todoTasks = await this.taskRepo.count({
      where: { status: TaskStatus.TODO },
    });
    const inProgressTasks = await this.taskRepo.count({
      where: { status: TaskStatus.IN_PROGRESS },
    });
    const blockedTasks = await this.taskRepo.count({
      where: { status: TaskStatus.BLOCKED },
    });
    const completedTasks = await this.taskRepo.count({
      where: { status: TaskStatus.DONE },
    });

    // Dynamically calculate overdue tasks count (dueDate < NOW and status != DONE)
    const overdueTasksCount = await this.taskRepo.count({
      where: {
        dueDate: LessThan(now),
        status: Not(TaskStatus.DONE),
      },
    });

    const taskStats: TaskStatisticsDto = {
      totalTasks,
      todoTasks,
      inProgressTasks,
      blockedTasks,
      completedTasks,
      overdueTasks: overdueTasksCount,
    };

    // 3. Active Projects with Progress
    const activeProjectsEntities = await this.projectRepo.find({
      where: { status: ProjectStatus.IN_PROGRESS },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    const activeProjects: ProjectWithProgress[] = await Promise.all(
      activeProjectsEntities.map(async (project) => {
        const progress = await this.projectService.calculateProjectProgress(
          project.id,
        );
        return {
          ...project,
          progress,
        };
      }),
    );

    // 4. Overdue Tasks List
    const overdueTasks = await this.taskRepo.find({
      where: {
        dueDate: LessThan(now),
        status: Not(TaskStatus.DONE),
      },
      order: { dueDate: 'ASC' },
      take: 10,
      relations: { project: true, feature: true },
    });

    // 5. Today's Tasks (Due Today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayTasks = await this.taskRepo.find({
      where: {
        dueDate: Between(startOfToday, endOfToday),
        status: Not(TaskStatus.DONE),
      },
      order: { dueDate: 'ASC' },
      relations: { project: true },
    });

    // 6. Upcoming Tasks (Due in next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    const upcomingTasks = await this.taskRepo.find({
      where: {
        dueDate: Between(endOfToday, nextWeek),
        status: Not(TaskStatus.DONE),
      },
      order: { dueDate: 'ASC' },
      take: 10,
      relations: { project: true },
    });

    // 7. Recent Activities Log
    const recentActivities = await this.activityService.getRecentActivities(10);

    return {
      projectStats,
      taskStats,
      activeProjects,
      overdueTasks,
      todayTasks,
      upcomingTasks,
      recentActivities,
    };
  }
}
