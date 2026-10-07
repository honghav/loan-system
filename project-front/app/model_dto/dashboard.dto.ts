import type { ProjectDto } from './project.dto';
import type { TaskDto } from './task.dto';
import type { ActivityDto } from './activity.dto';

export interface ProjectStatisticsDto {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  planningProjects: number;
  archivedProjects: number;
}

export interface TaskStatisticsDto {
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  blockedTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface DashboardOverviewDto {
  projectStats: ProjectStatisticsDto;
  taskStats: TaskStatisticsDto;
  activeProjects: ProjectDto[];
  overdueTasks: TaskDto[];
  todayTasks: TaskDto[];
  upcomingTasks: TaskDto[];
  recentActivities: ActivityDto[];
}
