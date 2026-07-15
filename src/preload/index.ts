import { contextBridge, ipcRenderer } from 'electron';
import {
  aiConfigStatusSchema,
  aiConnectionInputSchema,
  aiConnectionTestResultSchema,
  aiGetConfigStatusChannel,
  aiSaveConfigChannel,
  aiSkipSetupChannel,
  aiTestConnectionChannel,
  type AiConfigStatus,
  type AiConnectionInput,
  type AiConnectionTestResult,
} from '../shared/ai/schema';
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
  getAiConfigStatus(): Promise<AiConfigStatus>;
  testAiConnection(input: AiConnectionInput): Promise<AiConnectionTestResult>;
  saveAiConfig(input: AiConnectionInput): Promise<AiConfigStatus>;
  skipAiSetup(): Promise<AiConfigStatus>;
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
  async getAiConfigStatus() {
    const result: unknown = await ipcRenderer.invoke(aiGetConfigStatusChannel);
    return aiConfigStatusSchema.parse(result);
  },
  async testAiConnection(input) {
    const result: unknown = await ipcRenderer.invoke(
      aiTestConnectionChannel,
      aiConnectionInputSchema.parse(input),
    );
    return aiConnectionTestResultSchema.parse(result);
  },
  async saveAiConfig(input) {
    const result: unknown = await ipcRenderer.invoke(
      aiSaveConfigChannel,
      aiConnectionInputSchema.parse(input),
    );
    return aiConfigStatusSchema.parse(result);
  },
  async skipAiSetup() {
    const result: unknown = await ipcRenderer.invoke(aiSkipSetupChannel);
    return aiConfigStatusSchema.parse(result);
  },
};

contextBridge.exposeInMainWorld('desktopApi', desktopApi);
