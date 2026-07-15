# 技术架构

## 已确认技术栈

| 层级 | 技术 |
|---|---|
| 桌面框架 | Electron |
| 前端 | React + TypeScript |
| 前端构建 | Vite |
| UI | Tailwind CSS + shadcn/ui |
| 富文本编辑器 | TipTap |
| 本地数据库 | SQLite |
| SQLite 驱动 | better-sqlite3 |
| ORM | Drizzle ORM |
| 状态管理 | Zustand |
| 数据校验 | Zod |
| 打包发布 | Electron Forge |
| 凭据加密 | Electron safeStorage |
| 测试 | Vitest + Playwright |

选择 Electron 的主要原因是 Windows、macOS 渲染一致、Node.js 本地能力完整，并可用 TypeScript 统一主要开发语言。首版接受其安装包和内存占用高于 Tauri。

## 需要决策

- 本地服务是否独立进程运行。
- 数据访问层、任务队列和状态管理方案。
- Windows 与 macOS 打包、签名和升级方案。

## 已确认桌面行为

- 首版不使用系统托盘。
- 关闭主窗口即退出应用。
- 有运行中任务时，退出前需要用户确认。
- 使用单实例机制，第二次启动只激活已有主窗口。
- 异常退出后恢复自动保存的编辑稿。
- 运行中任务不自动续跑，启动后统一标记为已中断并允许手动重试。

## 数据目录

- 首次启动时要求用户选择业务数据目录。
- SQLite、上传图片、日志和应用内备份存放在所选目录。
- 不向应用安装目录写入运行数据，避免 Windows 权限、macOS 应用签名和升级覆盖问题。
- 操作系统默认应用数据目录仅保存数据目录指针等最小启动配置。
- API Key 使用 safeStorage 加密保存，不放入业务数据备份。
- 首版不提供直接修改数据目录；跨目录迁移使用整库备份与恢复。
- 每次启动验证目录存在、可读写，并确认数据库身份文件匹配。
- 验证失败时不创建空库，进入阻断式恢复页，提供重新选择、重试和退出。

### 工作区结构

```text
用户选择的目录/
└─ SelfMediaWorkbench/
   ├─ workspace.json
   ├─ database/app.db
   ├─ images/
   ├─ logs/
   ├─ backups/
   └─ temp/
```

- `workspace.json` 保存工作区 ID、格式版本和创建时间，用于识别已有工作区。
- `temp` 在正常退出和下次启动时清理。
- 数据库、图片和正式日志不得写入临时目录。

## 初步逻辑分层

```text
桌面界面
  → 应用服务层
    → 热点采集
    → AI 生成与任务调度
    → 素材/创作/分发管理
    → 统计与日志
  → 本地数据库与文件存储
  → 公共热点 API / OpenAI 兼容 API / 系统凭据库
```

## Electron 进程边界

```text
React Renderer
    ↓ 类型安全 IPC
Preload 白名单桥接
    ↓
Electron Main
    ├─ SQLite 数据访问
    ├─ 文件、图片与备份
    ├─ AI 请求与任务管理
    ├─ 热点 API 与正文读取
    └─ safeStorage
```

- 首版不启动本地 HTTP 服务。
- Renderer 只负责界面，不直接访问 Node.js、数据库和文件系统。
- Preload 只暴露明确允许的 IPC 方法，不暴露通用 ipcRenderer。
- AI 与热点请求在主进程任务服务中异步执行，首版不额外创建后台进程。

## 代码组织

```text
src/
├─ main/          # 数据库、AI、热点、文件、任务、IPC
├─ preload/       # 类型安全白名单桥接
├─ renderer/      # React UI
│  ├─ features/   # 按业务模块组织
│  ├─ components/
│  └─ stores/
└─ shared/        # IPC 类型、Zod Schema、枚举和 DTO

resources/        # 图标、内置提示词和数据库迁移
tests/            # 单元、集成和端到端测试
```

- 首版使用单应用仓库，不引入 Monorepo。
- Renderer 不得引用 Main 实现代码。
- Main 与 Renderer 只通过 Shared 中定义的类型、Schema 和 IPC 契约通信。
- 主进程和 Renderer 内部均按业务功能模块组织。

## 数据访问

- SQLite 只允许 Electron 主进程访问。
- 使用 better-sqlite3 驱动和 Drizzle ORM。
- 数据库开启 WAL 模式。
- Schema 使用 TypeScript 定义。
- 数据库升级使用编号迁移文件，并在应用启动时自动执行。
- 创作版本保存、项目删除、恢复等多表操作必须使用事务。
- Electron Forge 打包时配置原生 Node 模块自动解包。

## 持久化任务队列

- AI 任务默认最大并发数为 2。
- 状态包括等待中、运行中、成功、失败、已取消和已中断。
- 超时或服务端错误自动重试 2 次。
- HTTP 429 按服务端返回的等待时间延迟重试。
- 认证失败、余额不足和内容参数错误不自动重试。
- 应用启动时将遗留的运行中任务标记为已中断，由用户手动重试。

## 本地优先处理原则

- 能通过确定性代码完成的工作不调用 AI。
- 本地代码负责清洗、去重、排序、格式转换、字段校验、字数检查、Token 预算和状态计算。
- AI 只负责语义聚类判断、摘要、母稿和平台内容创作等需要语言理解的工作。
- UI 读取和编辑操作不依赖外部服务在线。
- 网络状态不作为进入应用的前置条件。
- 外部服务失败只影响对应功能，不阻断本地模块。

## 平台规格配置

- 每个平台使用内置 `PlatformSpec` 定义字段、必填规则、字符限制、图片规格、编辑器类型和复制顺序。
- UI、AI Schema、本地校验和分发展示共同读取同一份配置。
- 正式版用户不可编辑平台规格。
- 平台规则变化时随应用版本升级更新。
