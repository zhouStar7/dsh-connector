# Changelog

本项目的变更记录。上游版本的完整历史见
[duhu2000/dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector/blob/main/CHANGELOG.md)。

## 0.4.0 - 2026-08-31

同步上游 `dsh-mcp-connector@0.2.32`（0.2.25 → 0.2.32 共 8 个版本）。

### 继承自上游

- **跨进程 OAuth Token 轮换保护**（重大）：新增 `lib/grant-journal.js`，OAuth grant
  同步写入本机受限权限 journal；刷新时加锁并从 journal 重读，若另一 DSH Host
  已完成轮换则直接采纳新 Token，避免并发刷新互相覆盖导致掉登录；
- 配置页 SPA：两列自适应布局增强、连接顺利后的社区支持入口（可关闭）；
- 新增 `CONTRIBUTING.md`、`docs/FIRST-CONTRIBUTION.md`、`docs/PLUGIN-UPDATE.md`
  与市场截图素材（docs/screenshots）。

### fork 差异保持不变

- 配置页仍为 **DSH 设置对话框分区**（`settings.section`），无侧栏启动器；
- 插件标识 `dsh-connector`、存储域 `mcp_connector` 与上游数据互通；
- 版本检查指向本仓库 Releases。

## 0.3.0 - 2026-08-27

基于上游 `dsh-mcp-connector@0.2.24`（MIT）移植。

### Changed

- **配置页移入设置对话框**：注册公开插槽 `settings.section`（id `mcp-connector`），
  分区内以同源 iframe 加载 `/mcp-connector/ui/` SPA；不再注入侧栏启动按钮与
  `shell.overlay` 居中弹框。
- 插件标识更名：包名与 cordis name 改为 `dsh-connector`；MCP initialize 阶段的
  clientInfo.name 同步更新。
- 版本检查源指向本仓库（`zhouStar7/dsh-connector` Releases / npm `dsh-connector`）。

### Unchanged（功能兼容性）

- 存储域 `mcp_connector`、受管 mcp-client 条目前缀 `mcp-*`、web 路由前缀
  `/mcp-connector/*` 与全部对话工具保持与上游一致，替换安装后连接数据自动继承；
  连接器市场继续使用上游公共 Registry。
