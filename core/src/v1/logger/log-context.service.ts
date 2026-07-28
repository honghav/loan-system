// log-context.service.ts
import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface QueryLog {
  sql: string;
  parameters?: any[];
  duration?: number;
}

export interface RequestContext {
  queries: QueryLog[];
}

@Injectable()
export class LogContextService {
  private static asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  run(fn: () => Promise<any>) {
    return LogContextService.asyncLocalStorage.run({ queries: [] }, fn);
  }

  static addQuery(queryLog: QueryLog) {
    const store = LogContextService.asyncLocalStorage.getStore();
    if (store) {
      store.queries.push(queryLog);
    }
  }

  getQueries(): QueryLog[] {
    return LogContextService.asyncLocalStorage.getStore()?.queries || [];
  }
}
