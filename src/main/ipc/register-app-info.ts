import { app, ipcMain } from 'electron';
import { appInfoChannel, appInfoSchema } from '../../shared/ipc/app-info';

export function registerAppInfoHandler(): void {
  ipcMain.handle(appInfoChannel, () =>
    appInfoSchema.parse({
      name: app.getName(),
      version: app.getVersion(),
      platform: process.platform,
    }),
  );
}

