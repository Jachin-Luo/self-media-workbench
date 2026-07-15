import { constants } from 'node:fs';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import {
  workspaceDirectoryName,
  workspaceFormatVersion,
  workspaceMarkerSchema,
  workspaceRequiredDirectories,
  type WorkspaceMarker,
  type WorkspaceStatus,
} from '../../shared/workspace/schema';

const startupConfigSchema = z.object({
  workspacePath: z.string().min(1),
});

export class WorkspaceService {
  constructor(private readonly startupConfigPath: string) {}

  async getStatus(): Promise<WorkspaceStatus> {
    let rawConfig: string;

    try {
      rawConfig = await readFile(this.startupConfigPath, 'utf8');
    } catch (error) {
      if (hasErrorCode(error, 'ENOENT')) return { status: 'unconfigured' };
      return unavailable(null, 'startup-config-invalid', '无法读取工作区启动配置。');
    }

    const config = parseJson(startupConfigSchema, rawConfig);
    if (!config) return unavailable(null, 'startup-config-invalid', '工作区启动配置已损坏。');

    return this.validate(config.workspacePath);
  }

  async initializeFromParent(parentPath: string): Promise<WorkspaceStatus> {
    const rootPath = path.join(path.resolve(parentPath), workspaceDirectoryName);

    if (await exists(rootPath)) {
      const status = await this.validate(rootPath);
      if (status.status === 'ready') await this.persistWorkspacePath(rootPath);
      return status;
    }

    try {
      await mkdir(rootPath);
      for (const directory of workspaceRequiredDirectories) {
        await mkdir(path.join(rootPath, directory));
      }

      const marker: WorkspaceMarker = {
        id: randomUUID(),
        formatVersion: workspaceFormatVersion,
        createdAt: new Date().toISOString(),
      };

      await writeFile(path.join(rootPath, 'workspace.json'), `${JSON.stringify(marker, null, 2)}\n`, {
        encoding: 'utf8',
        flag: 'wx',
      });
      await this.persistWorkspacePath(rootPath);

      return { status: 'ready', rootPath, marker };
    } catch {
      return unavailable(rootPath, 'initialization-failed', '无法在所选目录创建工作区，请检查目录权限。');
    }
  }

  async retry(): Promise<WorkspaceStatus> {
    return this.getStatus();
  }

  private async validate(rootPath: string): Promise<WorkspaceStatus> {
    let rootStat;

    try {
      rootStat = await stat(rootPath);
    } catch (error) {
      if (hasErrorCode(error, 'ENOENT')) return unavailable(rootPath, 'missing', '工作区目录不存在。');
      return unavailable(rootPath, 'not-readable', '无法读取工作区目录。');
    }

    if (!rootStat.isDirectory()) return unavailable(rootPath, 'not-directory', '工作区路径不是目录。');

    try {
      await access(rootPath, constants.R_OK);
    } catch {
      return unavailable(rootPath, 'not-readable', '工作区目录不可读。');
    }

    try {
      await access(rootPath, constants.W_OK);
    } catch {
      return unavailable(rootPath, 'not-writable', '工作区目录不可写。');
    }

    let rawMarker: string;
    try {
      rawMarker = await readFile(path.join(rootPath, 'workspace.json'), 'utf8');
    } catch (error) {
      if (hasErrorCode(error, 'ENOENT')) return unavailable(rootPath, 'marker-missing', '缺少工作区标识文件。');
      return unavailable(rootPath, 'marker-invalid', '无法读取工作区标识文件。');
    }

    const marker = parseJson(workspaceMarkerSchema, rawMarker);
    if (!marker) return unavailable(rootPath, 'marker-invalid', '工作区标识文件格式无效。');
    if (marker.formatVersion !== workspaceFormatVersion) {
      return unavailable(rootPath, 'unsupported-format', '工作区格式版本与当前应用不兼容。');
    }

    for (const directory of workspaceRequiredDirectories) {
      try {
        const directoryStat = await stat(path.join(rootPath, directory));
        if (!directoryStat.isDirectory()) throw new Error('not-directory');
      } catch {
        return unavailable(rootPath, 'structure-invalid', `工作区缺少有效的 ${directory} 目录。`);
      }
    }

    return { status: 'ready', rootPath, marker };
  }

  private async persistWorkspacePath(rootPath: string): Promise<void> {
    await mkdir(path.dirname(this.startupConfigPath), { recursive: true });
    await writeFile(
      this.startupConfigPath,
      `${JSON.stringify({ workspacePath: path.resolve(rootPath) }, null, 2)}\n`,
      'utf8',
    );
  }
}

function unavailable(
  rootPath: string | null,
  reason: Extract<WorkspaceStatus, { status: 'unavailable' }>['reason'],
  message: string,
): WorkspaceStatus {
  return { status: 'unavailable', rootPath, reason, message };
}

function parseJson<T>(schema: z.ZodType<T>, value: string): T | null {
  try {
    const result = schema.safeParse(JSON.parse(value));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

async function exists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT')) return false;
    throw error;
  }
}

function hasErrorCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}
