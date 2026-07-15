import { useEffect, useState } from 'react';
import type { AppInfo } from '../../shared/ipc/app-info';

export function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.desktopApi.getAppInfo().then(setAppInfo).catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : '读取应用信息失败');
    });
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-8 py-10 text-slate-900">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-xl bg-indigo-600 text-xl font-bold text-white">自</div>
          <div>
            <h1 className="text-2xl font-bold">自媒体工作台</h1>
            <p className="text-sm text-slate-500">M1 正式工程骨架</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatusCard label="运行环境" value={appInfo?.platform ?? '读取中'} />
          <StatusCard label="应用版本" value={appInfo?.version ?? '读取中'} />
          <StatusCard label="进程通信" value={error ? '失败' : appInfo ? '正常' : '检查中'} />
        </div>

        {error ? <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="font-semibold">下一开发目标</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">首次启动、工作区目录选择与验证。</p>
        </div>
      </section>
    </main>
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

