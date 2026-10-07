import type { ActivityDto, ActivityQueryDto } from '~/model_dto/activity.dto';
import type { PaginatedResponseDto } from '~/model_dto/api.dto';

export function useActivityService() {
  const { apiFetch } = useV2Api();

  const getProjectActivities = async (
    projectId: string,
    query: ActivityQueryDto = {},
  ): Promise<PaginatedResponseDto<ActivityDto>> => {
    return await apiFetch<PaginatedResponseDto<ActivityDto>>(
      `/projects/${projectId}/activities`,
      {
        method: 'GET',
        params: query,
      },
    );
  };

  return {
    getProjectActivities,
  };
}

export default useActivityService;
