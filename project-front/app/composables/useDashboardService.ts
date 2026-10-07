import type { DashboardOverviewDto } from '~/model_dto/dashboard.dto';
import type { ApiResponseDto } from '~/model_dto/api.dto';

export function useDashboardService() {
  const { apiFetch } = useV2Api();

  const getDashboardOverview = async (): Promise<DashboardOverviewDto> => {
    const res = await apiFetch<ApiResponseDto<DashboardOverviewDto>>('/dashboard', {
      method: 'GET',
    });
    return res.data;
  };

  return {
    getDashboardOverview,
  };
}

export default useDashboardService;
