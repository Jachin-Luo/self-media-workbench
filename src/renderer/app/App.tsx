import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { AppInfo } from '../../shared/ipc/app-info';
import type { WorkspaceStatus } from '../../shared/workspace/schema';

export function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([window.desktopApi.getAppInfo(), window.desktopApi.getWorkspaceStatus()])
      .then(([nextAppInfo, nextWorkspace]) => {
        setAppInfo(nextAppInfo);
        setWorkspace(nextWorkspace);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : '应用初始化失败');
      });
  }, []);

  async function selectWorkspace(): Promise<void> {
    setBusy(true);
    setError(null);

    try {
      const result = await window.desktopApi.selectWorkspace();
      if (result.status === 'selected') setWorkspace(result.workspace);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '选择工作区失败');
    } finally {
      setBusy(false);
    }
  }

  async function retryWorkspace(): Promise<void> {
    setBusy(true);
    setError(null);

    try {
      setWorkspace(await window.desktopApi.retryWorkspace());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '重新验证工作区失败');
    } finally {
      setBusy(false);
    }
  }

  if (!workspace) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <p className="text-sm text-slate-500">正在检查应用环境和工作区…</p>
          {error ? <ErrorMessage message={error} /> : null}
        </div>
      </PageShell>
    );
  }

  if (workspace.status === 'unconfigured') {
    return (
      <PageShell>
        <StepLabel>首次启动 · 第 1 步</StepLabel>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">选择业务数据目录</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          应用将在所选目录内创建 SelfMediaWorkbench，用于保存数据库、图片、日志和备份。
        </p>
        <DirectoryList />
        {error ? <ErrorMessage message={error} /> : null}
        <div className="mt-8 flex justify-end">
          <PrimaryButton disabled={busy} onClick={() => void selectWorkspace()}>
            {busy ? '正在验证…' : '选择目录'}
          </PrimaryButton>
        </div>
      </PageShell>
    );
  }

  if (workspace.status === 'unavailable') {
    return (
      <PageShell>
        <StepLabel tone="danger">工作区不可用</StepLabel>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">无法进入应用</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{workspace.message}</p>
        {workspace.rootPath ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">当前工作区</p>
            <p className="mt-2 break-all font-mono text-sm text-slate-700">{workspace.rootPath}</p>
          </div>
        ) : null}
        {error ? <ErrorMessage message={error} /> : null}
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <SecondaryButton onClick={() => window.desktopApi.quitApp()}>退出应用</SecondaryButton>
          <SecondaryButton disabled={busy} onClick={() => void selectWorkspace()}>
            重新选择
          </SecondaryButton>
          <PrimaryButton disabled={busy} onClick={() => void retryWorkspace()}>
            {busy ? '正在验证…' : '重试'}
          </PrimaryButton>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <StepLabel tone="success">工作区已就绪</StepLabel>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">自媒体工作台</h1>
          <p className="mt-3 text-sm text-slate-500">首次启动目录链路已完成。</p>
        </div>
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white">
          自
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatusCard label="运行环境" value={appInfo?.platform ?? '未知'} />
        <StatusCard label="应用版本" value={appInfo?.version ?? '未知'} />
        <StatusCard label="工作区格式" value={`v${workspace.marker.formatVersion}`} />
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-500">业务数据目录</p>
        <p className="mt-2 break-all font-mono text-sm text-slate-700">{workspace.rootPath}</p>
      </div>
    </PageShell>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-100 px-8 py-10 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {children}
      </section>
    </main>
  );
}

function StepLabel({
  children,
  tone = 'default',
}: {
  children: ReactNode;
  tone?: 'default' | 'danger' | 'success';
}) {
  const styles = {
    default: 'bg-indigo-50 text-indigo-700',
    danger: 'bg-red-50 text-red-700',
    success: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[tone]}`}>
      {children}
    </span>
  );
}

function DirectoryList() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {['database · 本地数据库', 'images · 项目图片', 'logs · 运行日志', 'backups · 应用内备份'].map((item) => (
        <div key={item} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600">
          {item}
        </div>
      ))}
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</p>;
}

function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}
