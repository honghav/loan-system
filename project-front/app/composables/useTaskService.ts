import type {
  TaskDto,
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskStatusDto,
  TaskQueryDto,
  TaskStatus,
} from '~/model_dto/task.dto';
import type { PaginatedResponseDto, ApiResponseDto } from '~/model_dto/api.dto';

export function useTaskService() {
  const { apiFetch } = useV2Api();

  const getTasksByProject = async (
    projectId: string,
    query: TaskQueryDto = {},
  ): Promise<PaginatedResponseDto<TaskDto>> => {
    return await apiFetch<PaginatedResponseDto<TaskDto>>(
      `/projects/${projectId}/tasks`,
      {
        method: 'GET',
        params: query,
      },
    );
  };

  const getTaskById = async (id: string): Promise<TaskDto> => {
    const res = await apiFetch<ApiResponseDto<TaskDto>>(`/tasks/${id}`, {
      method: 'GET',
    });
    return res.data;
  };

  const createTask = async (
    projectId: string,
    dto: CreateTaskDto,
  ): Promise<TaskDto> => {
    const res = await apiFetch<ApiResponseDto<TaskDto>>(
      `/projects/${projectId}/tasks`,
      {
        method: 'POST',
        body: dto,
      },
    );
    return res.data;
  };

  const updateTask = async (
    id: string,
    dto: UpdateTaskDto,
  ): Promise<TaskDto> => {
    const res = await apiFetch<ApiResponseDto<TaskDto>>(`/tasks/${id}`, {
      method: 'PATCH',
      body: dto,
    });
    return res.data;
  };

  const updateTaskStatus = async (
    id: string,
    status: TaskStatus,
  ): Promise<TaskDto> => {
    const dto: UpdateTaskStatusDto = { status };
    const res = await apiFetch<ApiResponseDto<TaskDto>>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: dto,
    });
    return res.data;
  };

  const deleteTask = async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getTasksByProject,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
}

export default useTaskService;
