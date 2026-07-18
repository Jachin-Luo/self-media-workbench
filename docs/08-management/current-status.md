# 当前开发状态

> 最近更新：2026-07-18
> 当前阶段：M1 应用配置与日志数据接入

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
- AI 配置 Schema、Main IPC、Preload API 和首次启动第二步已完成。
- API Key 使用 safeStorage 加密保存；普通配置写入工作区，支持测试连接与跳过配置。
- 类型检查、11 项 Vitest、原型回归、Windows 打包和首次启动界面回归通过。
- better-sqlite3、Drizzle ORM、首个编号迁移和数据库管理器已完成。
- 数据库启动自动启用 WAL、外键和超时配置，并在工作区选择后立即初始化。
- `app_settings`、操作日志、错误日志、AI 调用和每日 Token 基础表及仓储已完成。
- AI 连接测试 Token 已接入数据库统计；17 项 Vitest、Drizzle 校验和真实 Windows 打包回归通过。

## 正在进行

- 准备将现有配置和运行日志接入数据库仓储。

## 下一步

1. 将普通 AI 配置迁移到 `app_settings`。
2. 接入工作区、AI 配置和启动错误日志。
3. 增加日志查询与保留期清理服务。

## 恢复工作方式

新会话开始时优先阅读：

1. 本文件。
2. `docs/08-management/roadmap.md`。
3. `docs/decision-log.md`。
4. `docs/03-technical/architecture.md`。
5. `docs/04-development/development-guide.md`。
