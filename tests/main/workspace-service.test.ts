import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { WorkspaceService } from '../../src/main/workspace/workspace-service';
import {
  workspaceDirectoryName,
  workspaceRequiredDirectories,
} from '../../src/shared/workspace/schema';

describe('WorkspaceService', () => {
  let testRoot: string;
  let startupConfigPath: string;
  let service: WorkspaceService;

  beforeEach(async () => {
    testRoot = await mkdtemp(path.join(os.tmpdir(), 'self-media-workbench-'));
    startupConfigPath = path.join(testRoot, 'system', 'startup-config.json');
    service = new WorkspaceService(startupConfigPath);
  });

  afterEach(async () => {
    await rm(testRoot, { recursive: true, force: true });
  });

  it('reports an unconfigured state before a directory is selected', async () => {
    await expect(service.getStatus()).resolves.toEqual({ status: 'unconfigured' });
  });

  it('creates and persists a valid workspace below the selected parent directory', async () => {
    const selectedParent = path.join(testRoot, 'selected');
    await mkdir(selectedParent);

    const status = await service.initializeFromParent(selectedParent);

    expect(status.status).toBe('ready');
    if (status.status !== 'ready') throw new Error('Expected a ready workspace.');

    expect(status.rootPath).toBe(path.join(selectedParent, workspaceDirectoryName));
    await expect(stat(path.join(status.rootPath, 'workspace.json'))).resolves.toBeDefined();

    for (const directory of workspaceRequiredDirectories) {
      await expect(stat(path.join(status.rootPath, directory))).resolves.toMatchObject({});
    }

    const persistedConfig = JSON.parse(await readFile(startupConfigPath, 'utf8')) as unknown;
    expect(persistedConfig).toEqual({ workspacePath: status.rootPath });
    await expect(service.getStatus()).resolves.toEqual(status);
  });

  it('does not recreate a configured workspace that disappears', async () => {
    const selectedParent = path.join(testRoot, 'selected');
    await mkdir(selectedParent);
    const initialized = await service.initializeFromParent(selectedParent);
    if (initialized.status !== 'ready') throw new Error('Expected a ready workspace.');

    await rm(initialized.rootPath, { recursive: true });

    await expect(service.getStatus()).resolves.toMatchObject({
      status: 'unavailable',
      rootPath: initialized.rootPath,
      reason: 'missing',
    });
    await expect(access(initialized.rootPath)).rejects.toBeDefined();
  });

  it('refuses to adopt an existing directory without a workspace marker', async () => {
    const selectedParent = path.join(testRoot, 'selected');
    const workspaceRoot = path.join(selectedParent, workspaceDirectoryName);
    await mkdir(workspaceRoot, { recursive: true });
    await writeFile(path.join(workspaceRoot, 'unrelated.txt'), 'existing data', 'utf8');

    await expect(service.initializeFromParent(selectedParent)).resolves.toMatchObject({
      status: 'unavailable',
      rootPath: workspaceRoot,
      reason: 'marker-missing',
    });
    await expect(access(startupConfigPath)).rejects.toBeDefined();
  });
});
