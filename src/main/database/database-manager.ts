import path from 'node:path';
import { openDatabase, type DatabaseContext } from './open-database';

export class DatabaseManager {
  private context: DatabaseContext | null = null;
  private workspaceRoot: string | null = null;

  constructor(private readonly migrationsFolder: string) {}

  initialize(workspaceRoot: string): DatabaseContext {
    const resolvedRoot = path.resolve(workspaceRoot);
    if (this.context && this.workspaceRoot === resolvedRoot) return this.context;

    this.close();
    this.context = openDatabase({
      databasePath: path.join(resolvedRoot, 'database', 'app.db'),
      migrationsFolder: this.migrationsFolder,
    });
    this.workspaceRoot = resolvedRoot;
    return this.context;
  }

  getContext(): DatabaseContext {
    if (!this.context) throw new Error('数据库尚未初始化。');
    return this.context;
  }

  close(): void {
    this.context?.close();
    this.context = null;
    this.workspaceRoot = null;
  }
}
