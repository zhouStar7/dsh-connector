# Changelog

本项目的变更记录。上游版本的完整历史见
[duhu2000/dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector/blob/main/CHANGELOG.md)。

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
