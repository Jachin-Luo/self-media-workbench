import { app, dialog, ipcMain } from 'electron';
import {
  workspaceGetStatusChannel,
  workspaceQuitChannel,
  workspaceRetryChannel,
  workspaceSelectChannel,
  workspaceSelectionResultSchema,
  workspaceStatusSchema,
} from '../../shared/workspace/schema';
import type { WorkspaceService } from '../workspace/workspace-service';

export function registerWorkspaceHandlers(
  workspaceService: WorkspaceService,
  onWorkspaceReady?: (rootPath: string) => void | Promise<void>,
): void {
  ipcMain.handle(workspaceGetStatusChannel, async () =>
    workspaceStatusSchema.parse(await workspaceService.getStatus()),
  );

  ipcMain.handle(workspaceSelectChannel, async () => {
    const result = await dialog.showOpenDialog({
      title: '选择业务数据目录',
      buttonLabel: '选择此目录',
      properties: ['openDirectory', 'createDirectory'],
    });

    if (result.canceled || !result.filePaths[0]) {
      return workspaceSelectionResultSchema.parse({ status: 'cancelled' });
    }

    const workspace = await workspaceService.initializeFromParent(result.filePaths[0]);
    if (workspace.status === 'ready') await onWorkspaceReady?.(workspace.rootPath);

    return workspaceSelectionResultSchema.parse({
      status: 'selected',
      workspace,
    });
  });

  ipcMain.handle(workspaceRetryChannel, async () =>
    workspaceStatusSchema.parse(await workspaceService.retry()),
  );

  ipcMain.on(workspaceQuitChannel, () => app.quit());
}
