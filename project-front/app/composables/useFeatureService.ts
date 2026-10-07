import type {
  FeatureDto,
  CreateFeatureDto,
  UpdateFeatureDto,
  FeatureQueryDto,
} from '~/model_dto/feature.dto';
import type { PaginatedResponseDto, ApiResponseDto } from '~/model_dto/api.dto';

export function useFeatureService() {
  const { apiFetch } = useV2Api();

  const getFeaturesByProject = async (
    projectId: string,
    query: FeatureQueryDto = {},
  ): Promise<PaginatedResponseDto<FeatureDto>> => {
    return await apiFetch<PaginatedResponseDto<FeatureDto>>(
      `/projects/${projectId}/features`,
      {
        method: 'GET',
        params: query,
      },
    );
  };

  const getFeatureById = async (id: string): Promise<FeatureDto> => {
    const res = await apiFetch<ApiResponseDto<FeatureDto>>(`/features/${id}`, {
      method: 'GET',
    });
    return res.data;
  };

  const createFeature = async (
    projectId: string,
    dto: CreateFeatureDto,
  ): Promise<FeatureDto> => {
    const res = await apiFetch<ApiResponseDto<FeatureDto>>(
      `/projects/${projectId}/features`,
      {
        method: 'POST',
        body: dto,
      },
    );
    return res.data;
  };

  const updateFeature = async (
    id: string,
    dto: UpdateFeatureDto,
  ): Promise<FeatureDto> => {
    const res = await apiFetch<ApiResponseDto<FeatureDto>>(`/features/${id}`, {
      method: 'PATCH',
      body: dto,
    });
    return res.data;
  };

  const deleteFeature = async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/features/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getFeaturesByProject,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature,
  };
}

export default useFeatureService;
