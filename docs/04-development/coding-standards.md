# 编码规范

主要代码使用 TypeScript；桌面端采用 Electron 主进程、preload 和 React renderer 分层。

- 单应用仓库，不建立多包 Monorepo。
- `main`、`preload`、`renderer`、`shared` 之间保持单向依赖。
- 业务代码按热点、素材、创作、分发、统计、日志和设置划分 feature。
- IPC 参数和返回值必须经过 Shared Zod Schema 校验。
- 平台字段和规则只能定义在 Shared PlatformSpec 中，页面和提示词不得复制维护同类常量。

待项目初始化后补充：

- 目录和模块边界。
- 命名、类型、错误处理和日志规范。
- UI 组件与状态管理规范。
- 数据库访问和迁移规范。
- 测试覆盖要求。
- 提交信息与代码审查要求。
