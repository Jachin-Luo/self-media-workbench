import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const appSettings = sqliteTable('app_settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const operationLogs = sqliteTable(
  'operation_logs',
  {
    id: text('id').primaryKey(),
    level: text('level').notNull(),
    module: text('module').notNull(),
    action: text('action').notNull(),
    summary: text('summary').notNull(),
    detailsJson: text('details_json'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('operation_logs_created_at_idx').on(table.createdAt)],
);

export const errorLogs = sqliteTable(
  'error_logs',
  {
    id: text('id').primaryKey(),
    module: text('module').notNull(),
    errorCode: text('error_code'),
    message: text('message').notNull(),
    stack: text('stack'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('error_logs_created_at_idx').on(table.createdAt)],
);

export const aiCalls = sqliteTable(
  'ai_calls',
  {
    id: text('id').primaryKey(),
    taskId: text('task_id'),
    feature: text('feature').notNull(),
    model: text('model').notNull(),
    durationMs: integer('duration_ms').notNull(),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    totalTokens: integer('total_tokens').notNull().default(0),
    status: text('status').notNull(),
    errorCode: text('error_code'),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    index('ai_calls_created_at_idx').on(table.createdAt),
    index('ai_calls_feature_idx').on(table.feature),
  ],
);

export const dailyTokenUsage = sqliteTable('daily_token_usage', {
  usageDate: text('usage_date').primaryKey(),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  totalTokens: integer('total_tokens').notNull().default(0),
  updatedAt: text('updated_at').notNull(),
});

export const databaseSchema = {
  appSettings,
  operationLogs,
  errorLogs,
  aiCalls,
  dailyTokenUsage,
};
