import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { count, eq } from 'drizzle-orm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { formatUsageDate } from '../../src/main/database/database-ai-call-recorder';
import { openDatabase, type DatabaseContext } from '../../src/main/database/open-database';
import { AiUsageRepository } from '../../src/main/database/repositories/ai-usage-repository';
import { AppSettingsRepository } from '../../src/main/database/repositories/app-settings-repository';
import { LogRepository } from '../../src/main/database/repositories/log-repository';
import {
  aiCalls,
  appSettings,
  dailyTokenUsage,
  errorLogs,
  operationLogs,
} from '../../src/main/database/schema';

describe('database foundation', () => {
  let testRoot: string;
  let databasePath: string;
  let context: DatabaseContext;

  beforeEach(async () => {
    testRoot = await mkdtemp(path.join(os.tmpdir(), 'self-media-database-'));
    databasePath = path.join(testRoot, 'database', 'app.db');
    context = openDatabase({
      databasePath,
      migrationsFolder: path.resolve('drizzle'),
    });
  });

  afterEach(async () => {
    context.close();
    await rm(testRoot, { recursive: true, force: true });
  });

  it('applies migrations and enables WAL and foreign keys', () => {
    expect(context.sqlite.pragma('journal_mode', { simple: true })).toBe('wal');
    expect(context.sqlite.pragma('foreign_keys', { simple: true })).toBe(1);

    const tableNames = context.sqlite
      .prepare("select name from sqlite_master where type = 'table'")
      .all()
      .map((row) => (row as { name: string }).name);

    expect(tableNames).toEqual(
      expect.arrayContaining([
        'app_settings',
        'operation_logs',
        'error_logs',
        'ai_calls',
        'daily_token_usage',
      ]),
    );
  });

  it('can reopen an already migrated database', () => {
    context.close();
    context = openDatabase({ databasePath, migrationsFolder: path.resolve('drizzle') });

    expect(context.db.select({ total: count() }).from(appSettings).get()?.total).toBe(0);
  });

  it('stores and updates JSON application settings', () => {
    const repository = new AppSettingsRepository(context);
    repository.set('appearance', { theme: 'system' }, '2026-07-18T00:00:00.000Z');
    repository.set('appearance', { theme: 'dark' }, '2026-07-18T00:01:00.000Z');

    expect(repository.get('appearance')).toEqual({ theme: 'dark' });
    expect(context.db.select().from(appSettings).all()).toHaveLength(1);
  });

  it('records operation and error logs', () => {
    const repository = new LogRepository(context);
    repository.recordOperation({
      level: 'info',
      module: 'workspace',
      action: 'initialize',
      summary: '工作区初始化完成',
      details: { formatVersion: 1 },
    });
    repository.recordError({
      module: 'ai',
      errorCode: 'AUTHENTICATION_FAILED',
      message: '测试连接失败',
    });

    expect(context.db.select().from(operationLogs).all()).toHaveLength(1);
    expect(context.db.select().from(errorLogs).all()).toHaveLength(1);
  });

  it('records AI calls and accumulates daily token usage transactionally', () => {
    const repository = new AiUsageRepository(context);
    repository.record({
      feature: 'connection-test',
      model: 'test-model',
      durationMs: 120,
      inputTokens: 5,
      outputTokens: 1,
      totalTokens: 6,
      status: 'success',
      usageDate: '2026-07-18',
    });
    repository.record({
      feature: 'connection-test',
      model: 'test-model',
      durationMs: 80,
      inputTokens: 3,
      outputTokens: 2,
      totalTokens: 5,
      status: 'success',
      usageDate: '2026-07-18',
    });

    expect(context.db.select().from(aiCalls).all()).toHaveLength(2);
    expect(
      context.db
        .select()
        .from(dailyTokenUsage)
        .where(eq(dailyTokenUsage.usageDate, '2026-07-18'))
        .get(),
    ).toMatchObject({ inputTokens: 8, outputTokens: 3, totalTokens: 11 });
  });

  it('groups daily token usage by the configured local timezone', () => {
    expect(formatUsageDate(new Date('2026-07-17T16:30:00.000Z'), 'Asia/Hong_Kong')).toBe(
      '2026-07-18',
    );
  });
});
