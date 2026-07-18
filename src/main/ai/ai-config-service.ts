import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';
import {
  aiConfigStatusSchema,
  aiConnectionInputSchema,
  aiConnectionTestResultSchema,
  aiProviderConfigSchema,
  defaultContextWindowTokens,
  defaultMaxOutputTokens,
  type AiConfigStatus,
  type AiConnectionInput,
  type AiConnectionTestResult,
  type AiProviderConfig,
} from '../../shared/ai/schema';
import type { WorkspaceStatus } from '../../shared/workspace/schema';
import type { EncryptedCredentialStore } from './credential-store';

interface WorkspaceStatusReader {
  getStatus(): Promise<WorkspaceStatus>;
}

export interface AiCallRecorderInput {
  feature: string;
  model: string;
  durationMs: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  status: 'success' | 'failed';
  errorCode?: string;
  createdAt: string;
}

export interface AiCallRecorder {
  record(input: AiCallRecorderInput): void | Promise<void>;
}

const storedAiConfigSchema = z.discriminatedUnion('setupState', [
  z.object({ setupState: z.literal('skipped') }),
  z.object({
    setupState: z.literal('configured'),
    config: aiProviderConfigSchema,
  }),
]);

const chatCompletionResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({ content: z.unknown().optional() }).optional(),
        text: z.string().optional(),
      }),
    )
    .min(1),
  usage: z
    .object({
      prompt_tokens: z.number().int().nonnegative().optional(),
      completion_tokens: z.number().int().nonnegative().optional(),
      total_tokens: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

export class AiConfigService {
  constructor(
    private readonly workspaceStatusReader: WorkspaceStatusReader,
    private readonly credentialStore: EncryptedCredentialStore,
    private readonly fetchImplementation: typeof fetch = fetch,
    private readonly timeoutMs = 15_000,
    private readonly callRecorder?: AiCallRecorder,
  ) {}

  async getStatus(): Promise<AiConfigStatus> {
    const configPath = await this.getConfigPath();
    let rawConfig: string;

    try {
      rawConfig = await readFile(configPath, 'utf8');
    } catch (error) {
      if (hasErrorCode(error, 'ENOENT')) return unconfiguredStatus();
      throw new Error('无法读取 AI 配置。');
    }

    const storedConfig = parseJson(storedAiConfigSchema, rawConfig);
    if (!storedConfig) return unconfiguredStatus();
    if (storedConfig.setupState === 'skipped') {
      return { setupState: 'skipped', config: null, hasApiKey: false };
    }

    let hasApiKey = false;
    try {
      hasApiKey = Boolean(await this.credentialStore.getApiKey());
    } catch {
      hasApiKey = false;
    }
    if (!hasApiKey) {
      return {
        setupState: 'unconfigured',
        config: storedConfig.config,
        hasApiKey: false,
      };
    }

    return aiConfigStatusSchema.parse({
      setupState: 'configured',
      config: storedConfig.config,
      hasApiKey: true,
    });
  }

  async saveConfig(input: AiConnectionInput): Promise<AiConfigStatus> {
    const parsedInput = aiConnectionInputSchema.parse(input);
    const config: AiProviderConfig = {
      baseUrl: parsedInput.baseUrl,
      model: parsedInput.model,
      contextWindowTokens: parsedInput.contextWindowTokens,
      maxOutputTokens: parsedInput.maxOutputTokens,
    };

    await this.credentialStore.saveApiKey(parsedInput.apiKey);
    await this.writeStoredConfig({ setupState: 'configured', config });

    return { setupState: 'configured', config, hasApiKey: true };
  }

  async skipSetup(): Promise<AiConfigStatus> {
    await this.writeStoredConfig({ setupState: 'skipped' });
    return { setupState: 'skipped', config: null, hasApiKey: false };
  }

  async testConnection(input: AiConnectionInput): Promise<AiConnectionTestResult> {
    const parsedInput = aiConnectionInputSchema.parse(input);
    const startedAt = Date.now();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImplementation(buildChatCompletionsUrl(parsedInput.baseUrl), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${parsedInput.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: parsedInput.model,
          messages: [{ role: 'user', content: 'Reply with OK.' }],
          max_tokens: 8,
          stream: false,
        }),
        signal: controller.signal,
      });

      const latencyMs = Date.now() - startedAt;
      const rawBody = await response.text();
      const responseBody = parseUnknownJson(rawBody);

      if (!response.ok) {
        return this.recordConnectionTest(parsedInput, aiConnectionTestResultSchema.parse({
          ok: false,
          message: extractErrorMessage(responseBody, response.status),
          latencyMs,
          statusCode: response.status,
        }), `http-${response.status}`);
      }

      const completion = chatCompletionResponseSchema.safeParse(responseBody);
      if (!completion.success) {
        return this.recordConnectionTest(parsedInput, {
          ok: false,
          message: '接口返回成功，但响应格式不是兼容的 Chat Completions 结构。',
          latencyMs,
        }, 'invalid-response');
      }

      const inputTokens = completion.data.usage?.prompt_tokens ?? 0;
      const outputTokens = completion.data.usage?.completion_tokens ?? 0;

      return this.recordConnectionTest(parsedInput, aiConnectionTestResultSchema.parse({
        ok: true,
        responseText: extractResponseText(completion.data.choices[0]) || '连接成功',
        latencyMs,
        usage: {
          inputTokens,
          outputTokens,
          totalTokens: completion.data.usage?.total_tokens ?? inputTokens + outputTokens,
        },
      }));
    } catch (error) {
      const timedOut = error instanceof Error && error.name === 'AbortError';
      return this.recordConnectionTest(parsedInput, {
        ok: false,
        message: timedOut ? '连接超时。' : '无法连接到 AI 接口。',
        latencyMs: Date.now() - startedAt,
      }, timedOut ? 'timeout' : 'network-error');
    } finally {
      clearTimeout(timeout);
    }
  }

  private async recordConnectionTest(
    input: AiConnectionInput,
    result: AiConnectionTestResult,
    errorCode?: string,
  ): Promise<AiConnectionTestResult> {
    try {
      await this.callRecorder?.record({
        feature: 'connection-test',
        model: input.model,
        durationMs: result.latencyMs,
        inputTokens: result.ok ? result.usage.inputTokens : 0,
        outputTokens: result.ok ? result.usage.outputTokens : 0,
        totalTokens: result.ok ? result.usage.totalTokens : 0,
        status: result.ok ? 'success' : 'failed',
        errorCode,
        createdAt: new Date().toISOString(),
      });
    } catch {
      // A statistics write failure must not replace the connection result.
    }
    return result;
  }

  private async getConfigPath(): Promise<string> {
    const workspaceStatus = await this.workspaceStatusReader.getStatus();
    if (workspaceStatus.status !== 'ready') throw new Error('工作区未就绪，无法读取 AI 配置。');
    return path.join(workspaceStatus.rootPath, 'settings', 'ai-config.json');
  }

  private async writeStoredConfig(config: z.infer<typeof storedAiConfigSchema>): Promise<void> {
    const configPath = await this.getConfigPath();
    await mkdir(path.dirname(configPath), { recursive: true });
    await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  }
}

function unconfiguredStatus(): AiConfigStatus {
  return {
    setupState: 'unconfigured',
    config: {
      baseUrl: '',
      model: '',
      contextWindowTokens: defaultContextWindowTokens,
      maxOutputTokens: defaultMaxOutputTokens,
    },
    hasApiKey: false,
  };
}

function buildChatCompletionsUrl(baseUrl: string): string {
  const url = new URL(baseUrl);
  const normalizedPath = url.pathname.replace(/\/+$/, '');
  url.pathname = normalizedPath.endsWith('/chat/completions')
    ? normalizedPath
    : `${normalizedPath}/chat/completions`;
  url.search = '';
  url.hash = '';
  return url.toString();
}

function extractResponseText(
  choice: z.infer<typeof chatCompletionResponseSchema>['choices'][number] | undefined,
): string {
  if (!choice) return '';
  const content = choice.message?.content;
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        typeof part === 'object' && part !== null && 'text' in part && typeof part.text === 'string'
          ? part.text
          : '',
      )
      .join('')
      .trim();
  }
  return choice.text?.trim() ?? '';
}

function extractErrorMessage(body: unknown, statusCode: number): string {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const error = body.error;
    if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
      return error.message.slice(0, 500);
    }
  }
  return `AI 接口返回 HTTP ${statusCode}。`;
}

function parseUnknownJson(value: string): unknown {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function parseJson<T>(schema: z.ZodType<T>, value: string): T | null {
  const parsed = parseUnknownJson(value);
  const result = schema.safeParse(parsed);
  return result.success ? result.data : null;
}

function hasErrorCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code;
}
