import { contextBridge, ipcRenderer } from 'electron';
import { appInfoChannel, appInfoSchema, type AppInfo } from '../shared/ipc/app-info';
import {
  workspaceGetStatusChannel,
  workspaceQuitChannel,
  workspaceRetryChannel,
  workspaceSelectChannel,
  workspaceSelectionResultSchema,
  workspaceStatusSchema,
  type WorkspaceSelectionResult,
  type WorkspaceStatus,
} from '../shared/workspace/schema';

export interface DesktopApi {
  getAppInfo(): Promise<AppInfo>;
  getWorkspaceStatus(): Promise<WorkspaceStatus>;
  selectWorkspace(): Promise<WorkspaceSelectionResult>;
  retryWorkspace(): Promise<WorkspaceStatus>;
  quitApp(): void;
}

const desktopApi: DesktopApi = {
  async getAppInfo() {
    const result: unknown = await ipcRenderer.invoke(appInfoChannel);
    return appInfoSchema.parse(result);
  },
  async getWorkspaceStatus() {
    const result: unknown = await ipcRenderer.invoke(workspaceGetStatusChannel);
    return workspaceStatusSchema.parse(result);
  },
  async selectWorkspace() {
    const result: unknown = await ipcRenderer.invoke(workspaceSelectChannel);
    return workspaceSelectionResultSchema.parse(result);
  },
  async retryWorkspace() {
    const result: unknown = await ipcRenderer.invoke(workspaceRetryChannel);
    return workspaceStatusSchema.parse(result);
  },
  quitApp() {
    ipcRenderer.send(workspaceQuitChannel);
  },
};

contextBridge.exposeInMainWorld('desktopApi', desktopApi);
