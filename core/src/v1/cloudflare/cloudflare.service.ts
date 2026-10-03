import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

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

export interface R2FolderItem {
  path: string;
  name: string;
  fileCount: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  files: R2FileItem[];
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

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);

  constructor(private readonly configService: ConfigService) { }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Fetch all R2 bucket objects and build folder structures containing their respective files
   */
  private async fetchR2ObjectsAndFolders(
    accountId: string,
    bucketName: string,
    accessKeyId: string,
    secretAccessKey: string,
    publicUrl: string,
  ): Promise<{
    folders: R2FolderItem[];
    totalSizeBytes: number;
    objectCount: number;
  }> {
    const s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    const files: R2FileItem[] = [];
    const folderMap = new Map<string, { fileCount: number; totalSizeBytes: number }>();
    let totalSizeBytes = 0;
    let objectCount = 0;
    let continuationToken: string | undefined = undefined;

    const baseUrl = publicUrl ? publicUrl.replace(/\/$/, '') : '';

    do {
      const command = new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      });
      const res: ListObjectsV2CommandOutput = await s3Client.send(command);
      if (res.Contents) {
        for (const item of res.Contents) {
          if (!item.Key) continue;

          const size = item.Size || 0;
          totalSizeBytes += size;
          objectCount += 1;

          const isFolderPlaceholder = item.Key.endsWith('/') && size === 0;
          const keyParts = item.Key.split('/').filter(Boolean);
          const fileName = keyParts[keyParts.length - 1] || item.Key;

          let parentFolder = '/';
          if (keyParts.length > 1) {
            parentFolder = keyParts.slice(0, -1).join('/');
          }

          if (!isFolderPlaceholder) {
            files.push({
              key: item.Key,
              name: fileName,
              sizeBytes: size,
              sizeFormatted: this.formatBytes(size),
              lastModified: item.LastModified,
              etag: item.ETag ? item.ETag.replace(/"/g, '') : undefined,
              url: baseUrl ? `${baseUrl}/${item.Key}` : undefined,
              folderPath: parentFolder,
            });
          }

          // Aggregate folder stats for ancestor folders
          if (keyParts.length > 1 || isFolderPlaceholder) {
            const folderParts = isFolderPlaceholder ? keyParts : keyParts.slice(0, -1);
            let currentPath = '';
            for (const part of folderParts) {
              currentPath = currentPath ? `${currentPath}/${part}` : part;
              const existing = folderMap.get(currentPath) || { fileCount: 0, totalSizeBytes: 0 };
              if (!isFolderPlaceholder) {
                existing.fileCount += 1;
                existing.totalSizeBytes += size;
              }
              folderMap.set(currentPath, existing);
            }
          } else if (!isFolderPlaceholder) {
            // Root level file
            const existing = folderMap.get('/') || { fileCount: 0, totalSizeBytes: 0 };
            existing.fileCount += 1;
            existing.totalSizeBytes += size;
            folderMap.set('/', existing);
          }
        }
      }
      continuationToken = res.NextContinuationToken;
    } while (continuationToken);

    const folders: R2FolderItem[] = Array.from(folderMap.entries()).map(([path, data]) => {
      const pathParts = path.split('/');
      const name = path === '/' ? '/' : (pathParts[pathParts.length - 1] || path);
      return {
        path,
        name,
        fileCount: data.fileCount,
        totalSizeBytes: data.totalSizeBytes,
        totalSizeFormatted: this.formatBytes(data.totalSizeBytes),
        files: files.filter((f) => f.folderPath === path),
      };
    });

    return {
      folders,
      totalSizeBytes,
      objectCount,
    };
  }

  /**
   * Get Cloudflare R2 Dashboard Metrics (Bucket Size, Class A & B Operations, Folders with Files)
   */
  async getR2DashboardMetrics(daysBack: number = 30): Promise<R2MetricsResponse> {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID') || '';
    const bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';
    const apiToken = this.configService.get<string>('CLOUDFLEAR_API_TOKEN') || '';
    const publicUrl = this.configService.get<string>('R2_PUBLIC_URL') || '';
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID') || '';
    const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY') || '';

    if (!bucketName) {
      return {
        bucketName: 'N/A',
        bucketSizeFormatted: '0 B',
        bucketSizeBytes: 0,
        objectCount: 0,
        classAOperations: 0,
        classBOperations: 0,
        publicUrl,
        accountId,
        status: 'error',
        warning: 'R2_BUCKET_NAME is not configured in .env',
        folders: [],
      };
    }

    let folders: R2FolderItem[] = [];
    let s3SizeBytes = 0;
    let s3ObjectCount = 0;
    let hasS3Data = false;

    // Fetch files & folders list via S3 API if credentials are provided
    if (accountId && accessKeyId && secretAccessKey) {
      try {
        const s3Data = await this.fetchR2ObjectsAndFolders(
          accountId,
          bucketName,
          accessKeyId,
          secretAccessKey,
          publicUrl,
        );
        folders = s3Data.folders;
        s3SizeBytes = s3Data.totalSizeBytes;
        s3ObjectCount = s3Data.objectCount;
        hasS3Data = true;
      } catch (err: any) {
        this.logger.warn(`Failed to fetch R2 objects via S3 client: ${err.message}`);
      }
    }

    // Attempt 1: Cloudflare GraphQL Analytics API
    if (accountId && apiToken) {
      try {
        const now = new Date();
        const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

        const query = `
          query GetR2Metrics($accountTag: String!, $bucketName: String!, $datetimeStart: Time!, $datetimeEnd: Time!) {
            viewer {
              accounts(filter: { accountTag: $accountTag }) {
                r2StorageAdaptiveGroups(limit: 10, filter: { bucketName: $bucketName }) {
                  max {
                    payloadSize
                    objectCount
                  }
                  dimensions {
                    bucketName
                  }
                }
                r2OperationsAdaptiveGroups(
                  limit: 1000,
                  filter: {
                    bucketName: $bucketName,
                    datetime_geq: $datetimeStart,
                    datetime_leq: $datetimeEnd
                  }
                ) {
                  sum {
                    requests
                  }
                  dimensions {
                    actionType
                  }
                }
              }
            }
          }
        `;

        const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
            variables: {
              accountTag: accountId,
              bucketName,
              datetimeStart: startDate.toISOString(),
              datetimeEnd: now.toISOString(),
            },
          }),
        });

        const json = await res.json();

        if (json?.data?.viewer?.accounts?.[0]) {
          const accountData = json.data.viewer.accounts[0];
          const storageGroup = accountData.r2StorageAdaptiveGroups?.[0]?.max || {};
          const opsGroups = accountData.r2OperationsAdaptiveGroups || [];

          const bucketSizeBytes = storageGroup.payloadSize ?? (hasS3Data ? s3SizeBytes : 0);
          const objectCount = storageGroup.objectCount ?? (hasS3Data ? s3ObjectCount : 0);

          const classAActions = new Set([
            'PutObject', 'CopyObject', 'CreateMultipartUpload',
            'CompleteMultipartUpload', 'UploadPart', 'ListObjects',
            'ListObjectsV2', 'ListBuckets', 'PutBucket'
          ]);

          const classBActions = new Set([
            'GetObject', 'HeadObject', 'HeadBucket'
          ]);

          let classAOperations = 0;
          let classBOperations = 0;

          for (const group of opsGroups) {
            const action = group.dimensions?.actionType;
            const count = group.sum?.requests || 0;

            if (classAActions.has(action)) {
              classAOperations += count;
            } else if (classBActions.has(action)) {
              classBOperations += count;
            }
          }

          return {
            bucketName,
            bucketSizeBytes,
            bucketSizeFormatted: this.formatBytes(bucketSizeBytes),
            objectCount,
            classAOperations,
            classBOperations,
            publicUrl,
            accountId,
            status: 'ok',
            folders,
          };
        } else if (json?.errors?.length) {
          this.logger.warn(`Cloudflare GraphQL Error: ${json.errors[0]?.message}`);
        }
      } catch (err: any) {
        this.logger.warn(`GraphQL API call failed: ${err.message}`);
      }
    }

    // Attempt 2: Fallback to S3 ListObjectsV2 API data
    if (hasS3Data) {
      return {
        bucketName,
        bucketSizeBytes: s3SizeBytes,
        bucketSizeFormatted: this.formatBytes(s3SizeBytes),
        objectCount: s3ObjectCount,
        classAOperations: 0,
        classBOperations: 0,
        publicUrl,
        accountId,
        status: 'partial',
        warning: 'Fetched bucket size, folders, and files via S3 API. Operational request counts require Cloudflare API Token with "Account Analytics: Read" permission.',
        folderCount: folders.length,
        folders,
      };
    }

    return {
      bucketName,
      bucketSizeBytes: 0,
      bucketSizeFormatted: '0 B',
      objectCount: 0,
      classAOperations: 0,
      classBOperations: 0,
      publicUrl,
      accountId,
      status: 'error',
      warning: 'Unable to connect to Cloudflare R2. Please check your environment configuration.',
      folders: [],
    };
  }
}
