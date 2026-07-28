// audit-log.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogContextService } from './log-context.service';
import { AuditLog } from './logger.entity';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(
    private readonly logContext: LogContextService,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();

    // Prevent logging audit log retrieval calls
    if (request.url.startsWith('/api/audit-logs')) {
      return next.handle();
    }

    const { method, url, body } = request;
    const startTime = Date.now();

    const sanitize = (data: any) => {
      if (!data || typeof data !== 'object') return data;
      try {
        const copy = JSON.parse(JSON.stringify(data));
        const sensitiveKeys = ['password', 'token', 'access_token', 'secret', 'oldpassword', 'confirmpassword'];
        const mask = (obj: any) => {
          if (!obj || typeof obj !== 'object') return;
          for (const key of Object.keys(obj)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
              obj[key] = '***REDACTED***';
            } else if (typeof obj[key] === 'object') {
              mask(obj[key]);
            }
          }
        };
        mask(copy);
        return copy;
      } catch {
        return data;
      }
    };

    return new Observable((subscriber) => {
      this.logContext.run(async () => {
        next
          .handle()
          .pipe(
            tap({
              next: async (responseBody) => {
                const response = http.getResponse();
                const durationMs = Date.now() - startTime;
                const sqlQueries = this.logContext.getQueries();

                await this.saveLog({
                  method,
                  url,
                  statusCode: response.statusCode,
                  durationMs,
                  requestBody: sanitize(body) || null,
                  responseBody: sanitize(responseBody) || null,
                  sqlQueries,
                });
              },
            }),
            catchError(async (err) => {
              const statusCode =
                err instanceof HttpException
                  ? err.getStatus()
                  : HttpStatus.INTERNAL_SERVER_ERROR;
              const responseBody =
                err instanceof HttpException
                  ? err.getResponse()
                  : { message: err.message || 'Internal Server Error' };
              const durationMs = Date.now() - startTime;
              const sqlQueries = this.logContext.getQueries();

              await this.saveLog({
                method,
                url,
                statusCode,
                durationMs,
                requestBody: sanitize(body) || null,
                responseBody: sanitize(responseBody) || null,
                sqlQueries,
              });

              throw err;
            }),
          )
          .subscribe(subscriber);
      });
    });
  }

  private async saveLog(logData: Partial<AuditLog>) {
    try {
      const logEntry = this.auditLogRepo.create(logData);
      await this.auditLogRepo.save(logEntry);
    } catch (error) {
      console.error('Failed to save audit log entry:', error);
    }
  }
}

