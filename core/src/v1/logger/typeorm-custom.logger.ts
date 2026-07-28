// typeorm-custom.logger.ts
import { Logger as TypeOrmLogger } from 'typeorm';
import { LogContextService } from './log-context.service';

export class CustomTypeOrmLogger implements TypeOrmLogger {
  logQuery(query: string, parameters?: any[]) {
    // Ignore internal audit log insert queries to prevent infinite recursion
    if (query.includes('audit_logs')) return;

    LogContextService.addQuery({
      sql: query,
      parameters: parameters || [],
    });
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    LogContextService.addQuery({
      sql: `[ERROR: ${error}] ${query}`,
      parameters: parameters || [],
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    LogContextService.addQuery({
      sql: query,
      parameters: parameters || [],
      duration: time,
    });
  }

  logSchemaBuild(message: string) {}
  logMigration(message: string) {}
  log(level: 'log' | 'info' | 'warn', message: any) {}
}
