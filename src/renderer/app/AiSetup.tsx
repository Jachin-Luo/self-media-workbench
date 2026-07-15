import { useState, type ChangeEvent, type ReactNode } from 'react';
import {
  aiConnectionInputSchema,
  type AiConfigStatus,
  type AiConnectionTestResult,
  type AiConnectionInput,
} from '../../shared/ai/schema';

interface AiSetupProps {
  initialConfig: Extract<AiConfigStatus, { setupState: 'unconfigured' }>['config'];
  onComplete(status: AiConfigStatus, result?: AiConnectionTestResult): void;
}

export function AiSetup({ initialConfig, onComplete }: AiSetupProps) {
  const [form, setForm] = useState({ ...initialConfig, apiKey: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<AiConnectionTestResult | null>(null);

  function updateTextField(event: ChangeEvent<HTMLInputElement>): void {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateNumberField(event: ChangeEvent<HTMLInputElement>): void {
    setForm((current) => ({ ...current, [event.target.name]: Number(event.target.value) }));
  }

  async function testAndComplete(): Promise<void> {
    const parsedInput = aiConnectionInputSchema.safeParse(form);
    if (!parsedInput.success) {
      setError(parsedInput.error.issues[0]?.message ?? '请检查 AI 配置。');
      return;
    }

    setBusy(true);
    setError(null);
    setTestResult(null);

    try {
      const result = await window.desktopApi.testAiConnection(parsedInput.data);
      setTestResult(result);
      if (!result.ok) return;

      const status = await window.desktopApi.saveAiConfig(parsedInput.data);
      onComplete(status, result);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'AI 配置保存失败');
    } finally {
      setBusy(false);
    }
  }

  async function skipSetup(): Promise<void> {
    setBusy(true);
    setError(null);

    try {
      onComplete(await window.desktopApi.skipAiSetup());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '无法跳过 AI 配置');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
        首次启动 · 第 2 步
      </span>
      <h1 className="mt-3 text-3xl font-bold tracking-tight">配置 AI 模型</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        支持通用 OpenAI 兼容接口。此步骤可以跳过，API Key 将由系统加密保存。
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2" label="Base URL">
          <input
            className="input"
            name="baseUrl"
            onChange={updateTextField}
            placeholder="https://api.example.com/v1"
            value={form.baseUrl}
          />
        </Field>
        <Field className="sm:col-span-2" label="API Key">
          <input
            autoComplete="off"
            className="input"
            name="apiKey"
            onChange={updateTextField}
            placeholder="输入 API Key"
            type="password"
            value={form.apiKey}
          />
        </Field>
        <Field className="sm:col-span-2" label="模型名">
          <input
            className="input"
            name="model"
            onChange={updateTextField}
            placeholder="输入兼容接口支持的模型名"
            value={form.model}
          />
        </Field>
        <Field label="上下文窗口">
          <input
            className="input"
            min={1024}
            name="contextWindowTokens"
            onChange={updateNumberField}
            type="number"
            value={form.contextWindowTokens}
          />
        </Field>
        <Field label="最大输出 Token">
          <input
            className="input"
            min={1}
            name="maxOutputTokens"
            onChange={updateNumberField}
            type="number"
            value={form.maxOutputTokens}
          />
        </Field>
      </div>

      {testResult && !testResult.ok ? (
        <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{testResult.message}</p>
      ) : null}
      {error ? <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <button
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          disabled={busy}
          onClick={() => void skipSetup()}
        >
          暂不配置
        </button>
        <button
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          disabled={busy}
          onClick={() => void testAndComplete()}
        >
          {busy ? '正在测试…' : '测试并完成'}
        </button>
      </div>
    </>
  );
}

function Field({
  children,
  className = '',
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`grid gap-2 text-sm font-medium text-slate-700 ${className}`}>
      {label}
      {children}
    </label>
  );
}
