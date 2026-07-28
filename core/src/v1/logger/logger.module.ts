import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './logger.entity';
import { AuditLogController } from './audit-log.controller';
import { AuditLogInterceptor } from './audit-log.interceptor';
import { LogContextService } from './log-context.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditLogController],
  providers: [
    LogContextService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
  ],
  exports: [LogContextService],
})
export class LoggerModule {}

