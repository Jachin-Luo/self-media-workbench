import { ipcMain } from 'electron';
import {
  aiConfigStatusSchema,
  aiConnectionInputSchema,
  aiConnectionTestResultSchema,
  aiGetConfigStatusChannel,
  aiSaveConfigChannel,
  aiSkipSetupChannel,
  aiTestConnectionChannel,
} from '../../shared/ai/schema';
import type { AiConfigService } from '../ai/ai-config-service';

export function registerAiConfigHandlers(aiConfigService: AiConfigService): void {
  ipcMain.handle(aiGetConfigStatusChannel, async () =>
    aiConfigStatusSchema.parse(await aiConfigService.getStatus()),
  );

  ipcMain.handle(aiSaveConfigChannel, async (_event, input: unknown) =>
    aiConfigStatusSchema.parse(await aiConfigService.saveConfig(aiConnectionInputSchema.parse(input))),
  );

  ipcMain.handle(aiTestConnectionChannel, async (_event, input: unknown) =>
    aiConnectionTestResultSchema.parse(
      await aiConfigService.testConnection(aiConnectionInputSchema.parse(input)),
    ),
  );

  ipcMain.handle(aiSkipSetupChannel, async () =>
    aiConfigStatusSchema.parse(await aiConfigService.skipSetup()),
  );
}
