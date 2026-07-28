import { ref, computed } from 'vue';
import { apiFetch } from '~/composables/apiFetchTwo';

export interface SqlQueryDTO {
  sql: string;
  parameters?: any[];
  duration?: number;
}

export interface GetAuditLogResponseDTO {
  id: string;
  method: string;
  url: string;
  statusCode: number;
  durationMs: number;
  requestBody: any;
  responseBody: any;
  sqlQueries: SqlQueryDTO[];
  createdAt: string;
}

export interface AuditLogMetaDTO {
  total: number;
  page: number;
  lastPage: number;
}

export interface GetAuditLogDTO {
  logId: string;
  logMethod: string;
  logUrl: string;
  logStatusCode: number;
  logDurationMs: number;
  logRequestBody: any;
  logResponseBody: any;
  logSqlQueries: SqlQueryDTO[];
  logCreatedAt: string;
}

export const mapperAuditLog = (
  data: GetAuditLogResponseDTO,
): GetAuditLogDTO => ({
  logId: data.id,
  logMethod: data.method,
  logUrl: data.url,
  logStatusCode: data.statusCode,
  logDurationMs: data.durationMs,
  logRequestBody: data.requestBody,
  logResponseBody: data.responseBody,
  logSqlQueries: data.sqlQueries || [],
  logCreatedAt: data.createdAt,
});

// Holds RAW API Response
export const auditLogResponse = ref<GetAuditLogResponseDTO[]>([]);
export const auditLogMeta = ref<AuditLogMetaDTO>({
  total: 0,
  page: 1,
  lastPage: 1,
});
export const isAuditLogLoading = ref<boolean>(false);

// Automatically updates whenever auditLogResponse changes
export const auditLogData = computed<GetAuditLogDTO[]>(() =>
  auditLogResponse.value.map(mapperAuditLog),
);

export async function getAuditLogService(
  page: number = 1,
  limit: number = 20,
  method?: string,
): Promise<void> {
  isAuditLogLoading.value = true;
  try {
    let endpoint = `api/audit-logs?page=${page}&limit=${limit}`;
    if (method && method !== 'ALL') {
      endpoint += `&method=${method}`;
    }
    const res: any = await apiFetch('GET', endpoint);

    if (res && res.data) {
      auditLogResponse.value = res.data;
      if (res.meta) {
        auditLogMeta.value = {
          total: res.meta.total,
          page: res.meta.page,
          lastPage: res.meta.lastPage,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching audit log data:', error);
  } finally {
    isAuditLogLoading.value = false;
  }
}

export async function clearAllAuditLogsService(): Promise<boolean> {
  try {
    await apiFetch('DELETE', 'api/audit-logs');
    auditLogResponse.value = [];
    auditLogMeta.value = { total: 0, page: 1, lastPage: 1 };
    return true;
  } catch (error) {
    console.error('Error clearing audit logs:', error);
    return false;
  }
}

export async function delete24hAuditLogsService(): Promise<boolean> {
  try {
    await apiFetch('DELETE', 'api/audit-logs/24h');
    await getAuditLogService(1, 20);
    return true;
  } catch (error) {
    console.error('Error purging 24h audit logs:', error);
    return false;
  }
}

