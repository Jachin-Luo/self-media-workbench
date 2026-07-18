import { mkdirSync } from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle, type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { databaseSchema } from './schema';

export interface DatabaseContext {
  sqlite: Database.Database;
  db: BetterSQLite3Database<typeof databaseSchema>;
  close(): void;
}

export interface OpenDatabaseOptions {
  databasePath: string;
  migrationsFolder: string;
}

export function openDatabase(options: OpenDatabaseOptions): DatabaseContext {
  mkdirSync(path.dirname(options.databasePath), { recursive: true });
  const sqlite = new Database(options.databasePath);

  try {
    sqlite.pragma('foreign_keys = ON');
    sqlite.pragma('busy_timeout = 5000');
    sqlite.pragma('synchronous = NORMAL');
    sqlite.pragma('journal_mode = WAL');

    const db = drizzle(sqlite, { schema: databaseSchema });
    migrate(db, { migrationsFolder: options.migrationsFolder });

    return {
      sqlite,
      db,
      close: () => sqlite.close(),
    };
  } catch (error) {
    sqlite.close();
    throw error;
  }
}
