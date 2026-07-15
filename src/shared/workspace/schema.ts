import { z } from 'zod';

export const workspaceDirectoryName = 'SelfMediaWorkbench' as const;
export const workspaceFormatVersion = 1 as const;
export const workspaceRequiredDirectories = ['database', 'images', 'logs', 'backups', 'temp'] as const;

export const workspaceMarkerSchema = z.object({
  id: z.string().uuid(),
  formatVersion: z.number().int().positive(),
  createdAt: z.string().datetime(),
});

export type WorkspaceMarker = z.infer<typeof workspaceMarkerSchema>;

export const workspaceUnavailableReasonSchema = z.enum([
  'startup-config-invalid',
  'missing',
  'not-directory',
  'not-readable',
  'not-writable',
  'marker-missing',
  'marker-invalid',
  'unsupported-format',
  'structure-invalid',
  'initialization-failed',
]);

export const workspaceStatusSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('unconfigured'),
  }),
  z.object({
    status: z.literal('ready'),
    rootPath: z.string().min(1),
    marker: workspaceMarkerSchema,
  }),
  z.object({
    status: z.literal('unavailable'),
    rootPath: z.string().min(1).nullable(),
    reason: workspaceUnavailableReasonSchema,
    message: z.string().min(1),
  }),
]);

export type WorkspaceStatus = z.infer<typeof workspaceStatusSchema>;

export const workspaceSelectionResultSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('cancelled') }),
  z.object({
    status: z.literal('selected'),
    workspace: workspaceStatusSchema,
  }),
]);

export type WorkspaceSelectionResult = z.infer<typeof workspaceSelectionResultSchema>;

export const workspaceGetStatusChannel = 'workspace:get-status' as const;
export const workspaceSelectChannel = 'workspace:select' as const;
export const workspaceRetryChannel = 'workspace:retry' as const;
export const workspaceQuitChannel = 'workspace:quit' as const;
