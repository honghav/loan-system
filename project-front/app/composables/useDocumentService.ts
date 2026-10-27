import type {
  DocumentDto,
  CreateDocumentDto,
  UpdateDocumentDto,
  DocumentQueryDto,
} from '~/model_dto/document.dto';
import type { PaginatedResponseDto, ApiResponseDto } from '~/model_dto/api.dto';

export function useDocumentService() {
  const { apiFetch } = useV2Api();

  const getDocumentsByProject = async (
    projectId: string,
    query: DocumentQueryDto = {},
  ): Promise<PaginatedResponseDto<DocumentDto>> => {
    return await apiFetch<PaginatedResponseDto<DocumentDto>>(
      `/projects/${projectId}/documents`,
      {
        method: 'GET',
        params: query,
      },
    );
  };

  const getDocumentById = async (id: string): Promise<DocumentDto> => {
    const res = await apiFetch<ApiResponseDto<DocumentDto>>(`/documents/${id}`, {
      method: 'GET',
    });
    return res.data;
  };

  const createDocument = async (
    projectId: string,
    dto: CreateDocumentDto,
  ): Promise<DocumentDto> => {
    const res = await apiFetch<ApiResponseDto<DocumentDto>>(
      `/projects/${projectId}/documents`,
      {
        method: 'POST',
        body: dto,
      },
    );
    return res.data;
  };

  const updateDocument = async (
    id: string,
    dto: UpdateDocumentDto,
  ): Promise<DocumentDto> => {
    const res = await apiFetch<ApiResponseDto<DocumentDto>>(`/documents/${id}`, {
      method: 'PATCH',
      body: dto,
    });
    return res.data;
  };

  const deleteDocument = async (id: string): Promise<{ message: string }> => {
    return await apiFetch<{ message: string }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    getDocumentsByProject,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
  };
}

export default useDocumentService;
