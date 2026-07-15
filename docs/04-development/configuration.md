# 配置说明

| 配置类别 | 内容 | 保存位置 |
|---|---|---|
| AI 接口 | Base URL、模型名、上下文窗口、最大输出 Token | 应用配置 |
| AI 凭据 | API Key | 系统凭据库 |
| 提示词 | 内置模板和模板版本 | 应用资源 |
| 调试 | 调试模式开关 | 应用配置 |
| 数据 | 数据库、图片、日志和应用内备份 | 用户首次启动选择的目录 |
| 启动配置 | 业务数据目录指针 | 操作系统应用数据目录 |

数据库采用 SQLite WAL 模式；better-sqlite3 原生模块由 Electron Forge 自动解包配置处理。

业务数据目录固定包含 `workspace.json`、`database`、`images`、`logs`、`backups` 和 `temp`。

操作系统应用数据目录中的 `startup-config.json` 只保存工作区绝对路径：

```json
{
  "workspacePath": "D:\\Content\\SelfMediaWorkbench"
}
```

`workspace.json` 保存 UUID 工作区标识、格式版本和创建时间。当前格式版本为 `1`。

启动时只验证已配置工作区，不自动补建缺失目录；目录不存在、不可读写、标识无效或格式版本不兼容时进入阻断式恢复页。

AI 普通配置写入工作区 `settings/ai-config.json`，包含 Base URL、模型名、上下文窗口和最大输出 Token。默认值为 32,000 和 8,000 Token。

API Key 通过 Electron `safeStorage` 加密，密文单独写入操作系统应用数据目录的 `credentials/ai-api-key.bin`，不进入工作区、普通配置或备份。
