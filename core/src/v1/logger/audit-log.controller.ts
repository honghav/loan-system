// audit-log.controller.ts
import { Controller, Get, Delete, Query, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AuditLog } from './logger.entity';

@Controller('v1/api/audit-logs')
export class AuditLogController {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
  ) { }

  @Get()
  async getLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('method') method?: string,
  ) {
    // Auto purge logs older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await this.auditLogRepo.delete({
      createdAt: LessThan(twentyFourHoursAgo),
    });

    const queryBuilder = this.auditLogRepo.createQueryBuilder('log');

    if (method && method !== 'ALL') {
      queryBuilder.where('log.method = :method', { method });
    }

    const [logs, total] = await queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .skip((Number(page) - 1) * Number(limit))
      .take(Number(limit))
      .getManyAndCount();

    return {
      data: logs,
      meta: {
        total,
        page: Number(page),
        lastPage: Math.ceil(total / Number(limit)) || 1,
      },
    };
  }

  @Get('stats')
  async getStats() {
    // Top 3 URL paths
    const topUrls = await this.auditLogRepo
      .createQueryBuilder('log')
      .select('log.url', 'url')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy('log.url')
      .orderBy('count', 'DESC')
      .limit(3)
      .getRawMany();

    // Top Methods
    const topMethods = await this.auditLogRepo
      .createQueryBuilder('log')
      .select('log.method', 'method')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy('log.method')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      topUrls: topUrls.map(u => ({ url: u.url, count: Number(u.count) })),
      topMethods: topMethods.map(m => ({ method: m.method, count: Number(m.count) })),
    };
  }

  @Get(':id')
  async getLogById(@Param('id') id: string) {
    return this.auditLogRepo.findOneBy({ id });
  }

  @Delete('24h')
  async deleteOldLogs() {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await this.auditLogRepo.delete({
      createdAt: LessThan(twentyFourHoursAgo),
    });
    return {
      message: 'Successfully purged audit logs older than 24 hours',
      affected: result.affected || 0,
    };
  }

  @Delete()
  async clearAllLogs() {
    await this.auditLogRepo.clear();
    return {
      message: 'Successfully cleared all audit logs',
    };
  }
}

