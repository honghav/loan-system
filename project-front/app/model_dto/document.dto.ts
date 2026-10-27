import type { ProjectDto } from './project.dto';

export interface DocumentDto {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: ProjectDto;
}

export interface CreateDocumentDto {
  name: string;
  description?: string;
  content?: string;
}

export interface UpdateDocumentDto {
  name?: string;
  description?: string;
  content?: string;
}

export interface DocumentQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}
