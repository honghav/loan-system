import { ApiProperty } from '@nestjs/swagger';
import { ProjectWithProgress } from '../../projects/project.service';
import { Task } from '../../tasks/entities/task.entity';
import { Activity } from '../../activities/entities/activity.entity';

export class ProjectStatisticsDto {
  @ApiProperty({ example: 10 })
  totalProjects: number;

  @ApiProperty({ example: 4 })
  activeProjects: number;

  @ApiProperty({ example: 3 })
  completedProjects: number;

  @ApiProperty({ example: 2 })
  onHoldProjects: number;

  @ApiProperty({ example: 1 })
  planningProjects: number;

  @ApiProperty({ example: 0 })
  archivedProjects: number;
}

export class TaskStatisticsDto {
  @ApiProperty({ example: 50 })
  totalTasks: number;

  @ApiProperty({ example: 15 })
  todoTasks: number;

  @ApiProperty({ example: 20 })
  inProgressTasks: number;

  @ApiProperty({ example: 5 })
  blockedTasks: number;

  @ApiProperty({ example: 10 })
  completedTasks: number;

  @ApiProperty({ example: 3, description: 'Dynamically calculated overdue tasks count' })
  overdueTasks: number;
}

export class DashboardOverviewDto {
  @ApiProperty({ type: ProjectStatisticsDto })
  projectStats: ProjectStatisticsDto;

  @ApiProperty({ type: TaskStatisticsDto })
  taskStats: TaskStatisticsDto;

  @ApiProperty({ description: 'Active projects with progress percentages' })
  activeProjects: ProjectWithProgress[];

  @ApiProperty({ description: 'List of overdue tasks (due_date < NOW and status != DONE)' })
  overdueTasks: Task[];

  @ApiProperty({ description: 'Tasks due today' })
  todayTasks: Task[];

  @ApiProperty({ description: 'Upcoming tasks due within next 7 days' })
  upcomingTasks: Task[];

  @ApiProperty({ description: 'Recent audit activity log entries' })
  recentActivities: Activity[];
}
