import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export interface TableSizeInfo {
  tableName: string;
  totalSizeBytes: number;
  formattedSize: string;
  dataSizeBytes: number;
  formattedDataSize: string;
  indexSizeBytes: number;
  formattedIndexSize: string;
  rowCount: number;
}

export interface StorageFileInfo {
  name: string;
  relativePath: string;
  url: string;
  folder: string;
  sizeBytes: number;
  formattedSize: string;
  extension: string;
  modifiedAt: Date;
}

export interface StorageFolderInfo {
  folderName: string;
  fileCount: number;
  totalSizeBytes: number;
  formattedSize: string;
}

@Injectable()
export class SizeDataService {
  constructor(private dataSource: DataSource) {}

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async getSizeData() {
    // 1. Calculate Database Metrics
    let dbTotalSizeBytes = 0;
    const tableSizes: TableSizeInfo[] = [];

    try {
      // Get database total size
      const dbSizeResult = await this.dataSource.query(`
        SELECT pg_database_size(current_database()) AS total_size;
      `);
      if (dbSizeResult && dbSizeResult[0]) {
        dbTotalSizeBytes = Number(dbSizeResult[0].total_size || 0);
      }
    } catch (err) {
      console.error('Error fetching overall DB size:', err);
    }

    // Collect all table names from TypeORM entity metadata & pg_tables
    const tableNamesSet = new Set<string>();

    for (const metadata of this.dataSource.entityMetadatas) {
      if (metadata.tableName) {
        tableNamesSet.add(metadata.tableName);
      }
    }

    try {
      const pgTables = await this.dataSource.query(
        `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
      );
      if (Array.isArray(pgTables)) {
        for (const row of pgTables) {
          if (row.tablename) {
            tableNamesSet.add(row.tablename);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching pg_tables:', err);
    }

    for (const tableName of Array.from(tableNamesSet)) {
      let totalSizeBytes = 0;
      let dataSizeBytes = 0;
      let indexSizeBytes = 0;
      let rowCount = 0;

      try {
        const countRes = await this.dataSource.query(
          `SELECT COUNT(*) as count FROM "${tableName}"`,
        );
        rowCount = Number(countRes[0]?.count || 0);
      } catch {
        rowCount = 0;
      }

      try {
        const sizeRes = await this.dataSource.query(`
          SELECT
            pg_total_relation_size('"' || '${tableName}' || '"') as total_bytes,
            pg_relation_size('"' || '${tableName}' || '"') as data_bytes,
            pg_indexes_size('"' || '${tableName}' || '"') as index_bytes
        `);
        if (sizeRes && sizeRes[0]) {
          totalSizeBytes = Number(sizeRes[0].total_bytes || 0);
          dataSizeBytes = Number(sizeRes[0].data_bytes || 0);
          indexSizeBytes = Number(sizeRes[0].index_bytes || 0);
        }
      } catch {
        totalSizeBytes = 0;
      }

      tableSizes.push({
        tableName,
        totalSizeBytes,
        formattedSize: this.formatBytes(totalSizeBytes),
        dataSizeBytes,
        formattedDataSize: this.formatBytes(dataSizeBytes),
        indexSizeBytes,
        formattedIndexSize: this.formatBytes(indexSizeBytes),
        rowCount,
      });
    }

    tableSizes.sort(
      (a, b) =>
        b.totalSizeBytes - a.totalSizeBytes || b.rowCount - a.rowCount,
    );

    // 2. Calculate Storage Folder Metrics
    const storageRootDir = path.join(process.cwd(), 'storage');
    if (!fs.existsSync(storageRootDir)) {
      fs.mkdirSync(storageRootDir, { recursive: true });
    }

    let storageTotalSizeBytes = 0;
    const filesList: StorageFileInfo[] = [];
    const folderStatsMap = new Map<string, { count: number; bytes: number }>();

    const scanDirectory = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDirectory(fullPath);
        } else if (entry.isFile()) {
          const stats = fs.statSync(fullPath);
          const sizeBytes = stats.size;
          storageTotalSizeBytes += sizeBytes;

          const relPath = path
            .relative(process.cwd(), fullPath)
            .replace(/\\/g, '/');
          const relativeStoragePath = `/${relPath}`; // e.g. /storage/customers/file.jpg

          const relToStorage = path
            .relative(storageRootDir, fullPath)
            .replace(/\\/g, '/');
          const folderParts = relToStorage.split('/');
          const folderName = folderParts.length > 1 ? folderParts[0] : 'root';

          const ext =
            path.extname(entry.name).toLowerCase().replace('.', '') || 'file';

          filesList.push({
            name: entry.name,
            relativePath: relativeStoragePath,
            url: relativeStoragePath,
            folder: folderName,
            sizeBytes,
            formattedSize: this.formatBytes(sizeBytes),
            extension: ext,
            modifiedAt: stats.mtime,
          });

          const currentFolder = folderStatsMap.get(folderName) || {
            count: 0,
            bytes: 0,
          };
          folderStatsMap.set(folderName, {
            count: currentFolder.count + 1,
            bytes: currentFolder.bytes + sizeBytes,
          });
        }
      }
    };

    scanDirectory(storageRootDir);

    const folderStatsList: StorageFolderInfo[] = Array.from(
      folderStatsMap.entries(),
    ).map(([folderName, data]) => ({
      folderName,
      fileCount: data.count,
      totalSizeBytes: data.bytes,
      formattedSize: this.formatBytes(data.bytes),
    }));

    // 3. Count database attachments (Customers / Users images)
    let customerImagesCount = 0;
    let userImagesCount = 0;

    try {
      const custRes = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM "customers" WHERE image IS NOT NULL AND image != ''`,
      );
      customerImagesCount = Number(custRes[0]?.count || 0);
    } catch {}

    try {
      const userRes = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM "users" WHERE image IS NOT NULL AND image != ''`,
      );
      userImagesCount = Number(userRes[0]?.count || 0);
    } catch {}

    // Sort files by modified date descending
    filesList.sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    );

    const totalCombinedSizeBytes = dbTotalSizeBytes + storageTotalSizeBytes;

    return {
      success: true,
      data: {
        database: {
          totalSizeBytes: dbTotalSizeBytes,
          formattedTotalSize: this.formatBytes(dbTotalSizeBytes),
          tables: tableSizes,
        },
        storage: {
          totalSizeBytes: storageTotalSizeBytes,
          formattedTotalSize: this.formatBytes(storageTotalSizeBytes),
          totalFiles: filesList.length,
          folders: folderStatsList,
          files: filesList,
        },
        summary: {
          totalCombinedSizeBytes,
          formattedCombinedSize: this.formatBytes(totalCombinedSizeBytes),
          customerImagesCount,
          userImagesCount,
        },
      },
    };
  }
}
