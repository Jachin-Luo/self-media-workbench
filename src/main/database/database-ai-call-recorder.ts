import type { AiCallRecorder, AiCallRecorderInput } from '../ai/ai-config-service';
import type { DatabaseManager } from './database-manager';
import { AiUsageRepository } from './repositories/ai-usage-repository';

export class DatabaseAiCallRecorder implements AiCallRecorder {
  constructor(
    private readonly databaseManager: DatabaseManager,
    private readonly timeZone = 'Asia/Hong_Kong',
  ) {}

  record(input: AiCallRecorderInput): void {
    new AiUsageRepository(this.databaseManager.getContext()).record({
      ...input,
      usageDate: formatUsageDate(new Date(input.createdAt), this.timeZone),
    });
  }
}

export function formatUsageDate(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
