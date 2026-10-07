export interface MetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  meta: MetaDto;
}

export interface ApiResponseDto<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponseDto {
  statusCode: number;
  message: string | string[];
  error?: string;
}
