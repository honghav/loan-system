import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

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
}

@Injectable()
export class CloudflareService {
  private readonly logger = new Logger(CloudflareService.name);

  constructor(private readonly configService: ConfigService) {}

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get Cloudflare R2 Dashboard Metrics (Bucket Size, Class A & B Operations)
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
      };
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

          const bucketSizeBytes = storageGroup.payloadSize || 0;
          const objectCount = storageGroup.objectCount || 0;

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
          };
        } else if (json?.errors?.length) {
          this.logger.warn(`Cloudflare GraphQL Error: ${json.errors[0]?.message}`);
        }
      } catch (err: any) {
        this.logger.warn(`GraphQL API call failed: ${err.message}`);
      }
    }

    // Attempt 2: Fallback to S3 ListObjectsV2 API
    if (accountId && accessKeyId && secretAccessKey) {
      try {
        const s3Client = new S3Client({
          region: 'auto',
          endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
          credentials: { accessKeyId, secretAccessKey },
        });

        let totalSizeBytes = 0;
        let objectCount = 0;
        let continuationToken: string | undefined = undefined;

        do {
          const command = new ListObjectsV2Command({
            Bucket: bucketName,
            ContinuationToken: continuationToken,
          });
          const res: ListObjectsV2CommandOutput = await s3Client.send(command);
          if (res.Contents) {
            for (const item of res.Contents) {
              totalSizeBytes += item.Size || 0;
              objectCount += 1;
            }
          }
          continuationToken = res.NextContinuationToken;
        } while (continuationToken);

        return {
          bucketName,
          bucketSizeBytes: totalSizeBytes,
          bucketSizeFormatted: this.formatBytes(totalSizeBytes),
          objectCount,
          classAOperations: 0,
          classBOperations: 0,
          publicUrl,
          accountId,
          status: 'partial',
          warning: 'Fetched bucket size via S3 API. Operational request counts require Cloudflare API Token with "Account Analytics: Read" permission.',
        };
      } catch (err: any) {
        this.logger.error(`S3 fallback list objects failed: ${err.message}`);
      }
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
    };
  }
}
