export interface R2FileItem {
    key: string;
    name: string;
    sizeBytes: number;
    sizeFormatted: string;
    lastModified?: Date;
    etag?: string;
    url?: string;
    folderPath: string;
}

export interface R2FileItemDTO {
    cfStorageKey: string;
    cfStorageName: string;
    cfStorageSizeBytes: number;
    cfStorageSizeFormatted: string;
    cfStorageLastModified?: Date;
    cfStorageEtag?: string;
    cfStorageUrl?: string;
    cfStorageFolderPath: string;
}


export interface R2FolderItem {
    path: string;
    name: string;
    fileCount: number;
    totalSizeBytes: number;
    totalSizeFormatted: string;
    files: R2FileItem[];
}
export interface R2FolderItemDTO {
    cfStoragePath: string;
    cfStorageName: string;
    cfStorageFileCount: number;
    cfStorageTotalSizeBytes: number;
    cfStorageTotalSizeFormatted: string;
    cfStorageFiles: R2FileItemDTO[];
}

export interface R2MetricsResponse {
    bucketName: string;
    bucketSizeFormatted: string;
    bucketSizeBytes: number;
    objectCount: number;
    classAOperations: number;
    classBOperations: number;
    publicUrl: string;
    accountId: string;
    status: 'ok' | 'partial' | 'error';
    warning?: string;
    folderCount?: number;
    folders?: R2FolderItem[];
}
export interface R2MetricsDTO {
    cfStorageBucketName: string;
    cfStorageBucketSizeFormatted: string;
    cfStorageBucketSizeBytes: number;
    cfStorageObjectCount: number;
    cfStorageClassAOperations: number;
    cfStorageClassBOperations: number;
    cfStoragePublicUrl: string;
    cfStorageAccountId: string;
    cfStorageStatus: 'ok' | 'partial' | 'error';
    cfStorageWarning?: string;
    cfStorageFolderCount?: number;
    cfStorageFolders?: R2FolderItemDTO[];
}

export const mapperCloudFlearFile = (data: R2FileItem): R2FileItemDTO => {
    return {
        cfStorageKey: data.key,
        cfStorageName: data.name,
        cfStorageSizeBytes: data.sizeBytes,
        cfStorageSizeFormatted: data.sizeFormatted,
        cfStorageLastModified: data.lastModified,
        cfStorageEtag: data.etag,
        cfStorageUrl: data.url,
        cfStorageFolderPath: data.folderPath,
    }
}
export const mapperCloudFlearFolder = (data: R2FolderItem): R2FolderItemDTO => {
    return {
        cfStoragePath: data.path,
        cfStorageName: data.name,
        cfStorageFileCount: data.fileCount,
        cfStorageTotalSizeBytes: data.totalSizeBytes,
        cfStorageTotalSizeFormatted: data.totalSizeFormatted,
        cfStorageFiles: (data.files || []).map(mapperCloudFlearFile),
    }
}
export const mapperCloudFlearMetrics = (data: R2MetricsResponse): R2MetricsDTO => {
    return {
        cfStorageBucketName: data.bucketName,
        cfStorageBucketSizeFormatted: data.bucketSizeFormatted,
        cfStorageBucketSizeBytes: data.bucketSizeBytes,
        cfStorageObjectCount: data.objectCount,
        cfStorageClassAOperations: data.classAOperations,
        cfStorageClassBOperations: data.classBOperations,
        cfStoragePublicUrl: data.publicUrl,
        cfStorageAccountId: data.accountId,
        cfStorageStatus: data.status,
        cfStorageWarning: data.warning,
        cfStorageFolderCount: data.folderCount ?? data.folders?.length ?? 0,
        cfStorageFolders: data.folders?.map(mapperCloudFlearFolder),
    }
}
export const metricsResponse = ref<R2MetricsResponse[]>([]);
export async function fetchMetricCloudflearService() {
    try {
        const res: any = await apiFetch("GET", "cloudflare/r2-dashboard");
        metricsResponse.value = res.data;
    } catch (error) {
        console.error("Error fetching customer data:", error);
    }
}