import type {
  ProjectDto,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectQueryDto,
} from '~/model_dto/project.dto';
import type { PaginatedResponseDto, ApiResponseDto } from '~/model_dto/api.dto';

export function useProjectService() {
  const { apiFetch } = useV2Api();

  const getProjects = async (
    query: ProjectQueryDto = {},
  ): Promise<PaginatedResponseDto<ProjectDto>> => {
    return await apiFetch<PaginatedResponseDto<ProjectDto>>('/projects', {
      method: 'GET',
      params: query,
    });
  };

  const getProjectById = async (id: string): Promise<ProjectDto> => {
    const res = await apiFetch<ApiResponseDto<ProjectDto>>(`/projects/${id}`, {
      method: 'GET',
    });
    return res.data;
  };

  const createProject = async (dto: CreateProjectDto): Promise<ProjectDto> => {
    const res = await apiFetch<ApiResponseDto<ProjectDto>>('/projects', {
      method: 'POST',
      body: dto,
    });
    return res.data;
  };

  const updateProject = async (
    id: string,
    dto: UpdateProjectDto,
  ): Promise<ProjectDto> => {
    const res = await apiFetch<ApiResponseDto<ProjectDto>>(`/projects/${id}`, {
      method: 'PATCH',
      body: dto,
    });
    return res.data;
  };

  const deleteProject = async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
}

export default useProjectService;
