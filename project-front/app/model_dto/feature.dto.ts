export enum FeatureStatus {
  PLANNED = 'PLANNED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface FeatureDto {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  status: FeatureStatus;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
  completedTaskCount?: number;
}

export interface CreateFeatureDto {
  name: string;
  description?: string;
  status?: FeatureStatus;
}

export interface UpdateFeatureDto {
  name?: string;
  description?: string;
  status?: FeatureStatus;
}

export interface FeatureQueryDto {
  search?: string;
  status?: FeatureStatus;
  page?: number;
  limit?: number;
}
