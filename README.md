# dsh-connector 🧩 MCP 连接器（设置页版）

> 基于上游 [duhu2000/dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)（企查查 QCC 团队发起并维护，MIT 协议）的完整移植。
> **功能完全一致**，唯一差别：**配置页从侧栏启动按钮 + 居中弹框，移入 DSH「设置」对话框**。
> 当前同步至上游 `v0.2.32`。

在 DeepSeek Harness Desktop 中浏览和安装不同厂商的 MCP 连接器、连接 MCP Server，
通过 OAuth 2.0 PKCE / API Key / JSON 导入接入服务，发现工具与 Prompt，扩展 AI 技能，
并管理已安装连接 —— 全部能力继承自上游 `dsh-mcp-connector`。

## 与上游的差异

| | 上游 `dsh-mcp-connector` | 本插件 `dsh-connector` |
|---|---|---|
| 配置页入口 | 侧栏「🧩 MCP连接器」按钮 → 居中弹框 | **设置对话框 → 左栏「MCP 连接器」分区** |
| 插件标识 | cordis name `mcp-connector` | cordis name `dsh-connector` |
| 连接器目录 / 市场 | 公共 Registry（jsDelivr CDN） | 同上游（完全共用） |
| 对话工具 | `mcp_connector_catalog / connect / configure / …` | 完全一致 |
| 存储域 | `mcp_connector` | 同名（替换安装后连接数据自动继承） |
| 版本检查源 | npm `dsh-mcp-connector` | 本仓库 Releases |

配置页注册在 DSH 设置对话框的公开插槽 `settings.section`（与官方「模型」「插件」分区同一机制）；
同源 iframe 加载宿主端 `/mcp-connector/ui/` SPA，市场、连接、详情、示例 Prompt 带入会话等功能不受影响。

## 功能（继承自上游）

- 图形化市场：9 类业务分类分章节展示，精选位保留企查查卡片、北大法宝和 Wind；
- 图形化添加：手动 HTTP/stdio、`mcpServers` JSON、连接器描述 URL 三种入口；
- 三种接入：OAuth 2.0 PKCE（动态注册兼容公共客户端与机密客户端）、自定义 HTTP/stdio、JSON 导入；
- 连接器详情：精选 Prompt 一键带入新会话；工具按 Server 分组展示；
- 生命周期管理：连接持久化、重启恢复、启停、断开、OAuth 自动刷新/退避恢复与撤销；
- 跨进程 Token 轮换保护：OAuth grant 同步写入本机受限权限 journal，多 Host 并发刷新不再互相覆盖（同步自上游 0.2.32）；
- 目录运营：内置目录 + 远程 registry + 本地上下架覆盖（`published` / `featured`）；
- 平滑迁移：显式扫描复制两个旧企查查 OAuth 插件授权，旧插件冲突时阻断重复连接；
- 对话工具：`mcp_connector_catalog`、`connect`、`configure`、`import_json`、`install_from_url`、
  `status`、`health_check`、`set_enabled`、`disconnect`、`refresh_catalog`、`publish`、`tools_list`。

## 安装

要求：DeepSeek Harness Desktop / web profile，Node.js ≥ 20。

```bash
dsh plugin --profile web add github:zhouStar7/dsh-connector
```

从本仓库使用一键脚本：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zhouStar7/dsh-connector/main/install.sh)
```

### 从上游 dsh-mcp-connector 迁移

两个插件共用同一个存储域（`mcp_connector`）与受管条目前缀（`mcp-*`），请先移除上游再安装：

```bash
dsh plugin --profile web remove dsh-mcp-connector
dsh plugin --profile web add github:zhouStar7/dsh-connector
```

已配置的连接、OAuth 凭证与上下架覆盖都会自动沿用。安装后**完全退出并重启 DeepSeek Harness Desktop**
（`dsh web` 用户需先停止原进程再启动）。

## 使用

1. 重启后点击 DSH 左下角「⚙️ 设置」（或侧栏设置按钮）打开设置对话框；
2. 在左栏选择「**MCP 连接器**」分区即可浏览市场、添加与管理连接；
3. 对话中同样可直接说「列出连接器」「连接 XX」「查看工具清单」触发对话工具。

## 开发

```bash
pnpm install
pnpm run lint          # node --check 全量语法检查
pnpm run dev:ui        # 独立调试配置页 SPA（http://127.0.0.1:8799/mcp-connector/ui/）
pnpm run registry:validate
```

本地验证打包内容：

```bash
npm pack --dry-run
```

同步到运行中的 profile：

```bash
dsh plugin --profile web add github:zhouStar7/dsh-connector
```

## 致谢与许可

- 上游项目：[duhu2000/dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector) 由企查查（Qichacha/QCC）团队发起并维护，MIT License；
- 上游公共 Registry：[duhu2000/dsh-mcp-connector-registry](https://github.com/duhu2000/dsh-mcp-connector-registry)；
- 本项目的改动部分同样以 [MIT](LICENSE) 发布。

问题反馈：[Issues](https://github.com/zhouStar7/dsh-connector/issues) ·
用户手册（含完整界面说明）：[docs/USER-GUIDE.md](docs/USER-GUIDE.md)
