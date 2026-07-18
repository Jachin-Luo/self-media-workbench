import { randomUUID } from 'node:crypto';
import type { DatabaseContext } from '../open-database';
import { errorLogs, operationLogs } from '../schema';

export interface OperationLogInput {
  level: string;
  module: string;
  action: string;
  summary: string;
  details?: unknown;
  createdAt?: string;
}

export interface ErrorLogInput {
  module: string;
  errorCode?: string;
  message: string;
  stack?: string;
  createdAt?: string;
}

export class LogRepository {
  constructor(private readonly context: DatabaseContext) {}

  recordOperation(input: OperationLogInput): string {
    const id = randomUUID();
    this.context.db
      .insert(operationLogs)
      .values({
        id,
        level: input.level,
        module: input.module,
        action: input.action,
        summary: input.summary,
        detailsJson: input.details === undefined ? null : JSON.stringify(input.details),
        createdAt: input.createdAt ?? new Date().toISOString(),
      })
      .run();
    return id;
  }

  recordError(input: ErrorLogInput): string {
    const id = randomUUID();
    this.context.db
      .insert(errorLogs)
      .values({
        id,
        module: input.module,
        errorCode: input.errorCode ?? null,
        message: input.message,
        stack: input.stack ?? null,
        createdAt: input.createdAt ?? new Date().toISOString(),
      })
      .run();
    return id;
  }
}
