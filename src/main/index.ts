import path from 'node:path';
import { app, BrowserWindow, safeStorage } from 'electron';
import { AiConfigService } from './ai/ai-config-service';
import { EncryptedCredentialStore } from './ai/credential-store';
import { registerAiConfigHandlers } from './ipc/register-ai-config';
import { registerAppInfoHandler } from './ipc/register-app-info';
import { registerWorkspaceHandlers } from './ipc/register-workspace';
import { WorkspaceService } from './workspace/workspace-service';

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 640,
    show: false,
    backgroundColor: '#f5f6f8',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once('ready-to-show', () => mainWindow?.show());

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
}

app.on('second-instance', () => {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
});

app.whenReady().then(() => {
  const userDataPath = app.getPath('userData');
  const workspaceService = new WorkspaceService(path.join(userDataPath, 'startup-config.json'));
  const credentialStore = new EncryptedCredentialStore(
    path.join(userDataPath, 'credentials', 'ai-api-key.bin'),
    safeStorage,
  );

  registerAppInfoHandler();
  registerWorkspaceHandlers(workspaceService);
  registerAiConfigHandlers(new AiConfigService(workspaceService, credentialStore));
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
