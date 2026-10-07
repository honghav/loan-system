export enum ActivityAction {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  FEATURE_CREATED = 'FEATURE_CREATED',
  FEATURE_UPDATED = 'FEATURE_UPDATED',
  FEATURE_DELETED = 'FEATURE_DELETED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_STATUS_CHANGED = 'TASK_STATUS_CHANGED',
  TASK_DELETED = 'TASK_DELETED',
}

export interface ActivityDto {
  id: string;
  projectId: string;
  featureId?: string | null;
  taskId?: string | null;
  action: ActivityAction;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ActivityQueryDto {
  action?: ActivityAction;
  page?: number;
  limit?: number;
}
