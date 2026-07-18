import { eq } from 'drizzle-orm';
import type { DatabaseContext } from '../open-database';
import { appSettings } from '../schema';

export class AppSettingsRepository {
  constructor(private readonly context: DatabaseContext) {}

  get(key: string): unknown | null {
    const row = this.context.db
      .select({ valueJson: appSettings.valueJson })
      .from(appSettings)
      .where(eq(appSettings.key, key))
      .get();

    if (!row) return null;
    return JSON.parse(row.valueJson) as unknown;
  }

  set(key: string, value: unknown, updatedAt = new Date().toISOString()): void {
    const valueJson = JSON.stringify(value);
    if (valueJson === undefined) throw new Error('应用配置必须是可序列化的 JSON 值。');

    this.context.db
      .insert(appSettings)
      .values({ key, valueJson, updatedAt })
      .onConflictDoUpdate({
        target: appSettings.key,
        set: { valueJson, updatedAt },
      })
      .run();
  }
}
