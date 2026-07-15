import { z } from 'zod';

export const defaultContextWindowTokens = 32_000;
export const defaultMaxOutputTokens = 8_000;

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => ['http:', 'https:'].includes(new URL(value).protocol), 'Base URL 必须使用 HTTP 或 HTTPS。');

export const aiProviderConfigSchema = z.object({
  baseUrl: httpUrlSchema,
  model: z.string().trim().min(1, '模型名不能为空。'),
  contextWindowTokens: z.number().int().min(1_024).max(10_000_000),
  maxOutputTokens: z.number().int().min(1).max(1_000_000),
});

export type AiProviderConfig = z.infer<typeof aiProviderConfigSchema>;

export const aiConnectionInputSchema = aiProviderConfigSchema.extend({
  apiKey: z.string().trim().min(1, 'API Key 不能为空。'),
});

export type AiConnectionInput = z.infer<typeof aiConnectionInputSchema>;

const aiConfigDraftSchema = z.object({
  baseUrl: z.string(),
  model: z.string(),
  contextWindowTokens: z.number().int(),
  maxOutputTokens: z.number().int(),
});

export const aiConfigStatusSchema = z.discriminatedUnion('setupState', [
  z.object({
    setupState: z.literal('unconfigured'),
    config: aiConfigDraftSchema,
    hasApiKey: z.boolean(),
  }),
  z.object({
    setupState: z.literal('skipped'),
    config: z.null(),
    hasApiKey: z.literal(false),
  }),
  z.object({
    setupState: z.literal('configured'),
    config: aiProviderConfigSchema,
    hasApiKey: z.literal(true),
  }),
]);

export type AiConfigStatus = z.infer<typeof aiConfigStatusSchema>;

export const aiTokenUsageSchema = z.object({
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  totalTokens: z.number().int().nonnegative(),
});

export const aiConnectionTestResultSchema = z.discriminatedUnion('ok', [
  z.object({
    ok: z.literal(true),
    responseText: z.string(),
    latencyMs: z.number().int().nonnegative(),
    usage: aiTokenUsageSchema,
  }),
  z.object({
    ok: z.literal(false),
    message: z.string().min(1),
    latencyMs: z.number().int().nonnegative(),
    statusCode: z.number().int().optional(),
  }),
]);

export type AiConnectionTestResult = z.infer<typeof aiConnectionTestResultSchema>;

export const aiGetConfigStatusChannel = 'ai:get-config-status' as const;
export const aiSaveConfigChannel = 'ai:save-config' as const;
export const aiTestConnectionChannel = 'ai:test-connection' as const;
export const aiSkipSetupChannel = 'ai:skip-setup' as const;
