import { z } from 'zod';

export const appInfoChannel = 'app:get-info' as const;

export const appInfoSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  platform: z.enum(['win32', 'darwin', 'linux']),
});

export type AppInfo = z.infer<typeof appInfoSchema>;

