import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly publicUrl: string;

    constructor(private readonly configService: ConfigService) {
        const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
        const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('R2_SECRET_ACCESS_KEY');

        this.bucketName = this.configService.get<string>('R2_BUCKET_NAME') || '';
        this.publicUrl = this.configService.get<string>('R2_PUBLIC_URL') || '';

        // S3Client configured for Cloudflare R2 endpoint
        this.s3Client = new S3Client({
            region: 'auto', // Cloudflare R2 requires 'auto' region
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
    }

    /**
     * Upload file buffer directly to R2
     */
    async uploadFile(
        file: Express.Multer.File,
        folder: string = 'documents',
    ): Promise<{ key: string; url: string }> {
        const timestamp = Date.now();
        const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const key = `${folder}/${timestamp}_${cleanFileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        const url = `${this.publicUrl}/${key}`;
        return { key, url };
    }

    /**
     * Upload raw Buffer directly to R2
     */
    async uploadBuffer(
        buffer: Buffer,
        mimeType: string,
        folder: string = 'documents',
        customFilename?: string,
    ): Promise<{ key: string; url: string }> {
        const timestamp = Date.now();
        const extension = mimeType.split('/')[1] || 'bin';
        const fileName = customFilename || `${timestamp}_file.${extension}`;
        const key = `${folder}/${fileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: buffer,
            ContentType: mimeType,
        });

        await this.s3Client.send(command);

        const url = `${this.publicUrl}/${key}`;
        return { key, url };
    }

    /**
     * Delete an object from R2 by key
     */
    async deleteFile(key: string): Promise<boolean> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            return true;
        } catch (error: any) {
            this.logger.error(`Failed to delete file ${key} from R2`, error.stack);
            throw error;
        }
    }

    /**
     * Generate a Presigned Upload URL (Direct frontend upload to R2)
     */
    async getPresignedUploadUrl(
        fileName: string,
        contentType: string,
        folder: string = 'uploads',
        expiresInSeconds: number = 3600,
    ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
        const key = `${folder}/${Date.now()}_${fileName}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: expiresInSeconds,
        });

        return {
            uploadUrl,
            key,
            publicUrl: `${this.publicUrl}/${key}`,
        };
    }
}
