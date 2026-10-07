import type { ProjectDto } from './project.dto';
import type { FeatureDto } from './feature.dto';

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  BLOCKED = 'BLOCKED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface TaskDto {
  id: string;
  projectId: string;
  featureId?: string | null;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: ProjectDto;
  feature?: FeatureDto;
}

export interface CreateTaskDto {
  featureId?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  featureId?: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface TaskQueryDto {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  featureId?: string;
  page?: number;
  limit?: number;
}
