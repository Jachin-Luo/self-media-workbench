# 开发指南

## 环境

- Node.js 24 或更高版本。
- pnpm 11。
- Windows 打包使用 Electron 42，better-sqlite3 使用对应 Electron ABI 的官方预编译包。

## 常用命令

```text
pnpm start
pnpm typecheck
pnpm test
pnpm package
pnpm db:generate
pnpm db:check
```

## 数据库迁移

1. 修改 `src/main/database/schema.ts`。
2. 运行 `pnpm db:generate` 生成新的编号迁移。
3. 检查生成的 SQL，不直接修改已提交且已发布的旧迁移。
4. 运行 `pnpm db:check` 和数据库测试。

应用打开已有工作区或首次创建工作区时自动执行迁移。数据库只允许 Main 进程访问，跨表写入使用事务。

## 原生模块

Electron Forge 打包时在临时目录下载 better-sqlite3 对应 Electron ABI 的官方预编译包，并将 `.node` 文件解包到 `app.asar.unpacked`。发布构建需要能够访问 better-sqlite3 的 GitHub Release 资源。
