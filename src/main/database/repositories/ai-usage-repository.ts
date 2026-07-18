import { randomUUID } from 'node:crypto';
import { sql } from 'drizzle-orm';
import type { DatabaseContext } from '../open-database';
import { aiCalls, dailyTokenUsage } from '../schema';

export interface AiCallRecordInput {
  feature: string;
  model: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  status: 'success' | 'failed';
  errorCode?: string;
  taskId?: string;
  createdAt?: string;
  usageDate: string;
}

export class AiUsageRepository {
  constructor(private readonly context: DatabaseContext) {}

  record(input: AiCallRecordInput): string {
    const id = randomUUID();
    const createdAt = input.createdAt ?? new Date().toISOString();

    this.context.db.transaction((transaction) => {
      transaction
        .insert(aiCalls)
        .values({
          id,
          taskId: input.taskId ?? null,
          feature: input.feature,
          model: input.model,
          durationMs: input.durationMs,
          inputTokens: input.inputTokens,
          outputTokens: input.outputTokens,
          totalTokens: input.totalTokens,
          status: input.status,
          errorCode: input.errorCode ?? null,
          createdAt,
        })
        .run();

      transaction
        .insert(dailyTokenUsage)
        .values({
          usageDate: input.usageDate,
          inputTokens: input.inputTokens,
          outputTokens: input.outputTokens,
          totalTokens: input.totalTokens,
          updatedAt: createdAt,
        })
        .onConflictDoUpdate({
          target: dailyTokenUsage.usageDate,
          set: {
            inputTokens: sql`${dailyTokenUsage.inputTokens} + ${input.inputTokens}`,
            outputTokens: sql`${dailyTokenUsage.outputTokens} + ${input.outputTokens}`,
            totalTokens: sql`${dailyTokenUsage.totalTokens} + ${input.totalTokens}`,
            updatedAt: createdAt,
          },
        })
        .run();
    });

    return id;
  }
}
