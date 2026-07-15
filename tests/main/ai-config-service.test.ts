import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AiConfigService } from '../../src/main/ai/ai-config-service';
import { EncryptedCredentialStore, type CredentialCipher } from '../../src/main/ai/credential-store';
import { WorkspaceService } from '../../src/main/workspace/workspace-service';
import { defaultContextWindowTokens, defaultMaxOutputTokens } from '../../src/shared/ai/schema';

const testInput = {
  baseUrl: 'https://api.example.com/v1',
  apiKey: 'sk-secret-value',
  model: 'test-model',
  contextWindowTokens: 32_000,
  maxOutputTokens: 8_000,
};

describe('AiConfigService', () => {
  let testRoot: string;
  let workspaceRoot: string;
  let workspaceService: WorkspaceService;
  let credentialPath: string;
  let credentialStore: EncryptedCredentialStore;

  beforeEach(async () => {
    testRoot = await mkdtemp(path.join(os.tmpdir(), 'self-media-ai-config-'));
    const selectedParent = path.join(testRoot, 'selected');
    await mkdir(selectedParent);

    workspaceService = new WorkspaceService(path.join(testRoot, 'system', 'startup-config.json'));
    const workspaceStatus = await workspaceService.initializeFromParent(selectedParent);
    if (workspaceStatus.status !== 'ready') throw new Error('Expected a ready workspace.');
    workspaceRoot = workspaceStatus.rootPath;

    credentialPath = path.join(testRoot, 'system', 'credentials', 'ai-api-key.bin');
    credentialStore = new EncryptedCredentialStore(credentialPath, fakeCipher);
  });

  afterEach(async () => {
    await rm(testRoot, { recursive: true, force: true });
  });

  it('returns default values before setup is completed', async () => {
    const service = new AiConfigService(workspaceService, credentialStore);

    await expect(service.getStatus()).resolves.toEqual({
      setupState: 'unconfigured',
      config: {
        baseUrl: '',
        model: '',
        contextWindowTokens: defaultContextWindowTokens,
        maxOutputTokens: defaultMaxOutputTokens,
      },
      hasApiKey: false,
    });
  });

  it('persists the skipped setup state without credentials', async () => {
    const service = new AiConfigService(workspaceService, credentialStore);

    await expect(service.skipSetup()).resolves.toEqual({
      setupState: 'skipped',
      config: null,
      hasApiKey: false,
    });
    await expect(service.getStatus()).resolves.toEqual({
      setupState: 'skipped',
      config: null,
      hasApiKey: false,
    });
  });

  it('stores ordinary configuration separately from the encrypted API key', async () => {
    const service = new AiConfigService(workspaceService, credentialStore);

    await expect(service.saveConfig(testInput)).resolves.toMatchObject({
      setupState: 'configured',
      config: { baseUrl: testInput.baseUrl, model: testInput.model },
      hasApiKey: true,
    });

    const configText = await readFile(path.join(workspaceRoot, 'settings', 'ai-config.json'), 'utf8');
    const credentialBytes = await readFile(credentialPath);

    expect(configText).not.toContain(testInput.apiKey);
    expect(credentialBytes.toString('utf8')).not.toBe(testInput.apiKey);
    await expect(credentialStore.getApiKey()).resolves.toBe(testInput.apiKey);
    await expect(service.getStatus()).resolves.toMatchObject({ setupState: 'configured' });
  });

  it('tests the Chat Completions endpoint and returns latency and token usage', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'OK' } }],
          usage: { prompt_tokens: 5, completion_tokens: 1, total_tokens: 6 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const service = new AiConfigService(workspaceService, credentialStore, fetchMock);

    await expect(service.testConnection(testInput)).resolves.toMatchObject({
      ok: true,
      responseText: 'OK',
      usage: { inputTokens: 5, outputTokens: 1, totalTokens: 6 },
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/v1/chat/completions');
    const request = fetchMock.mock.calls[0]?.[1];
    expect(new Headers(request?.headers).get('Authorization')).toBe(`Bearer ${testInput.apiKey}`);
    expect(JSON.parse(String(request?.body))).toMatchObject({
      model: testInput.model,
      messages: [{ role: 'user', content: 'Reply with OK.' }],
    });
  });

  it('returns provider error messages without persisting the failed configuration', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'Invalid API key' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const service = new AiConfigService(workspaceService, credentialStore, fetchMock);

    await expect(service.testConnection(testInput)).resolves.toMatchObject({
      ok: false,
      message: 'Invalid API key',
      statusCode: 401,
    });
    await expect(service.getStatus()).resolves.toMatchObject({ setupState: 'unconfigured' });
  });
});

const fakeCipher: CredentialCipher = {
  isEncryptionAvailable: () => true,
  encryptString: (value) => Buffer.from(`encrypted:${value}`, 'utf8'),
  decryptString: (value) => value.toString('utf8').replace(/^encrypted:/, ''),
};
