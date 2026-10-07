export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface ProgressSummaryDto {
  totalTasks: number;
  completedTasks: number;
  progress: number; // 0 - 100 %
}

export interface ProjectDto {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string;
  targetDate?: string;
  createdAt: string;
  updatedAt: string;
  progress?: ProgressSummaryDto;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  targetDate?: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  targetDate?: string;
}

export interface ProjectQueryDto {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  page?: number;
  limit?: number;
}
