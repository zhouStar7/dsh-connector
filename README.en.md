# dsh-connector 🧩 MCP Connector (Settings-page edition)

> A full port of upstream [duhu2000/dsh-mcp-connector](https://github.com/duhu2000/dsh-mcp-connector)
> (initiated & maintained by the Qichacha/QCC team, MIT licensed).
> Currently synced to upstream `v0.2.32`.
> **Feature set is identical** — the only change: the configuration page moved from a sidebar
> launcher + centered modal into the **DSH Settings dialog**.

Browse & install vendor MCP connectors, connect MCP servers via OAuth 2.0 PKCE, API keys,
JSON import or connector descriptor URLs, discover tools & prompts, and manage installed
connections — all capabilities are inherited from upstream.

## Difference from upstream

| | Upstream `dsh-mcp-connector` | This plugin `dsh-connector` |
|---|---|---|
| Config entry | Sidebar launcher → modal overlay | **Settings dialog → "MCP Connector" section** |
| Plugin id | cordis name `mcp-connector` | cordis name `dsh-connector` |
| Catalog / market | Public registry (jsDelivr CDN) | Shared with upstream (identical) |
| Conversation tools | `mcp_connector_catalog / connect / configure / …` | Identical |
| Storage domain | `mcp_connector` | Same name (data survives replacement) |

The config page registers on the public `settings.section` slot (same mechanism as the stock
"Models" / "Plugins" sections) and loads the host-served SPA at `/mcp-connector/ui/` in a
same-origin iframe — market browsing, connecting, details and one-click prompt sessions all work as before.

## Install

Requires DeepSeek Harness Desktop / web profile, Node.js ≥ 20.

```bash
dsh plugin --profile web add github:zhouStar7/dsh-connector
```

### Migrating from upstream

Both plugins share storage (`mcp_connector`) and managed entry prefix (`mcp-*`) — remove the
upstream plugin first:

```bash
dsh plugin --profile web remove dsh-mcp-connector
dsh plugin --profile web add github:zhouStar7/dsh-connector
```

Existing connections, OAuth credentials and catalog overrides carry over automatically.
Fully restart DeepSeek Harness afterwards.

## Usage

Open the settings trigger in the sidebar rail → pick "**MCP Connector**" in the settings nav.
Conversation tools keep working exactly like upstream ("list connectors", "connect ...", "list tools").

## License & credits

Upstream © dsh-mcp-connector contributors (Qichacha/QCC), MIT. Local changes also MIT — see [LICENSE](LICENSE).
