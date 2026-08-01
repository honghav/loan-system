import { ref } from 'vue';
import { apiFetch } from '~/composables/apiFetchTwo';

export interface TableSizeDTO {
  tableName: string;
  totalSizeBytes: number;
  formattedSize: string;
  dataSizeBytes?: number;
  formattedDataSize?: string;
  indexSizeBytes?: number;
  formattedIndexSize?: string;
  rowCount: number;
}

export interface StorageFileDTO {
  name: string;
  relativePath: string;
  url: string;
  folder: string;
  sizeBytes: number;
  formattedSize: string;
  extension: string;
  modifiedAt: string;
}

export interface StorageFolderDTO {
  folderName: string;
  fileCount: number;
  totalSizeBytes: number;
  formattedSize: string;
}

export interface SizeDataInfoDTO {
  database: {
    totalSizeBytes: number;
    formattedTotalSize: string;
    tables: TableSizeDTO[];
  };
  storage: {
    totalSizeBytes: number;
    formattedTotalSize: string;
    totalFiles: number;
    folders: StorageFolderDTO[];
    files: StorageFileDTO[];
  };
  summary: {
    totalCombinedSizeBytes: number;
    formattedCombinedSize: string;
    customerImagesCount: number;
    userImagesCount: number;
  };
}

export const sizeDataState = ref<SizeDataInfoDTO | null>(null);
export const isSizeDataLoading = ref<boolean>(false);

export async function getSizeDataService(): Promise<void> {
  isSizeDataLoading.value = true;
  try {
    let res: any;
    try {
      res = await apiFetch('GET', 'v1/size_data');
    } catch {
      res = await apiFetch('GET', 'size_data');
    }
    if (res && res.data) {
      sizeDataState.value = res.data;
    }
  } catch (error) {
    console.error('Error fetching size data:', error);
  } finally {
    isSizeDataLoading.value = false;
  }
}
