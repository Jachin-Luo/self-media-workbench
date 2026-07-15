import { contextBridge, ipcRenderer } from 'electron';
import { appInfoChannel, appInfoSchema, type AppInfo } from '../shared/ipc/app-info';

export interface DesktopApi {
  getAppInfo(): Promise<AppInfo>;
}

const desktopApi: DesktopApi = {
  async getAppInfo() {
    const result: unknown = await ipcRenderer.invoke(appInfoChannel);
    return appInfoSchema.parse(result);
  },
};

contextBridge.exposeInMainWorld('desktopApi', desktopApi);

