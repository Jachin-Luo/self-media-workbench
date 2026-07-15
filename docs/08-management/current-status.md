# 当前开发状态

> 最近更新：2026-07-16  
> 当前阶段：M1 首次启动与 AI 配置

## 项目决策

- 产品：个人本地自媒体创作桌面应用。
- 首发系统：Windows 优先，保持 macOS 兼容。
- 开源方式：完全开源，MIT License。
- GitHub：https://github.com/Jachin-Luo/self-media-workbench
- 默认分支：`main`。
- 技术栈：Electron、React、TypeScript、Vite、Tailwind CSS、shadcn/ui、TipTap、SQLite、better-sqlite3、Drizzle ORM、Zustand、Zod、Vitest、Playwright。
- 工程边界：Renderer 不直接访问 Node.js；Main 与 Renderer 通过 Preload 白名单 IPC 和 Shared Schema 通信。

## 已完成

- M0 产品需求、信息架构、页面规格和异常流程已收敛。
- 第二轮交互原型完成。
- 原型自动化回归脚本通过：`node prototype/regression.test.js`。
- Git 仓库、MIT License、GitHub 公开仓库和首次提交已完成。
- Electron Forge + Vite + React + TypeScript 正式工程初始化完成。
- `main`、`preload`、`renderer`、`shared` 分层和基础类型安全 IPC 已建立。
- 类型检查、Vitest、原型回归和 Windows x64 Electron 打包已通过。
- M1 初始化代码已提交并推送到 `origin/main`。
- 工作区状态模型、Shared Schema、Main IPC 和 Preload 白名单 API 已完成。
- 首次启动目录选择、工作区初始化、路径持久化和启动验证链路已完成。
- 工作区异常恢复页和 4 个服务测试已完成，界面回归与 Windows 打包通过。

## 正在进行

- 准备首次启动向导第二步的 AI 配置模型和凭据存储方案。

## 下一步

1. 定义 AI 接口配置 Schema 和 IPC 契约。
2. 接入系统凭据保护和测试连接。
3. 完成可跳过的首次启动第二步。

## 恢复工作方式

新会话开始时优先阅读：

1. 本文件。
2. `docs/08-management/roadmap.md`。
3. `docs/decision-log.md`。
4. `docs/03-technical/architecture.md`。
5. `docs/04-development/development-guide.md`。
