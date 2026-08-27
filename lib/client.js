/**
 * dsh-connector 客户端半区：把「MCP连接器」配置页注册为 DSH 设置对话框的分区。
 *
 * 与上游 dsh-mcp-connector 的唯一差别在挂载位置：
 *   上游 —— 侧栏启动按钮 + shell.overlay 居中弹框（iframe）；
 *   本插件 —— settings.section 分区内同源 iframe 加载 /mcp-connector/ui/。
 * 配置能力（目录 / 三通道连接 / OAuth / JSON 导入 / URL 安装 / 工具清单 /
 * 示例 Prompt 带入新会话）与上游完全一致。
 */
window.__ModuleLoader__.load({
	id: "dsh-connector",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");

		/** 客户端所需服务：槽位、工作区、会话及对话输入机。 */
		const inject = [
			"slots",
			"sessions",
			"workspaces",
			"conversation"
		];
		const SECTION_ID = "mcp-connector";
		const SECTION_ORDER = 45;
		const PROMPT_REQUEST_TYPE = "mcp-connector:start-session";
		const PROMPT_RESULT_TYPE = "mcp-connector:start-session-result";
		const UI_PATH = "/mcp-connector/ui/";

		const STYLE_ID = "dsh-connector-settings";
		const sectionCss = `
.dshConnectorSection {
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
}

.dshConnectorSectionFrame {
	flex: 1;
	min-height: 420px;
	width: 100%;
	border: none;
	border-radius: 12px;
	background: transparent;
	colorScheme: light dark;
}
`;

		function installSectionStyles() {
			if (document.querySelector(`style[data-plugin="${STYLE_ID}"]`) !== null) return () => {};
			const style = document.createElement("style");
			style.dataset.plugin = STYLE_ID;
			style.textContent = sectionCss;
			document.head.append(style);
			return () => { style.remove(); };
		}

		/**
		 * 用 DSH 自身的工作区/会话/输入机把示例 Prompt 带入新会话。
		 * connectWorkspace 与 DSH 的「新会话」按钮同源：优先复用当前工作区的
		 * 空白会话，没有时创建一个；返回时 binding 已就绪，可在导航前写入草稿。
		 */
		async function startPromptSession(ctx, promptText) {
			if (typeof promptText !== "string" || promptText.trim() === "") {
				throw new Error("Prompt 不能为空");
			}
			const workspace = ctx.workspaces.list.getSnapshot();
			const current = ctx.sessions.list.getSnapshot().current;
			const currentWorkspaceId = current === void 0
				? void 0
				: workspace.items.find((item) => item.sessionIds.includes(current))?.workspaceId;
			const targetWorkspaceId = currentWorkspaceId ?? workspace.recentWorkspaceId;
			if (targetWorkspaceId === void 0) {
				throw new Error("请先选择一个工作空间，再使用示例 Prompt");
			}
			const sessionId = await ctx.workspaces.connectWorkspace(targetWorkspaceId);
			const conversation = ctx.get("conversation");
			if (conversation === void 0) {
				throw new Error("DSH 对话服务尚未就绪，请稍后重试");
			}
			conversation.input.shell(sessionId).setDraft(promptText);
			ctx.sessions.open(sessionId);
			return sessionId;
		}

		/**
		 * 全局桥：接收配置页（settings 分区内的 iframe）发出的示例 Prompt
		 * 请求。设置对话框无法被插件程序化关闭，成功后仅回执并打开会话。
		 */
		function installPromptBridge(ctx) {
			const onMessage = (event) => {
				if (event.origin !== window.location.origin) return;
				if (event.data?.type !== PROMPT_REQUEST_TYPE) return;
				const requestId = typeof event.data.requestId === "string" ? event.data.requestId : "";
				const prompt = event.data.prompt;
				const reply = (ok, message) => {
					const source = event.source;
					source?.postMessage?.({
						type: PROMPT_RESULT_TYPE,
						requestId,
						ok,
						message
					}, window.location.origin);
				};
				if (requestId === "" || typeof prompt !== "string") {
					reply(false, "无效的 Prompt 请求");
					return;
				}
				Promise.resolve(startPromptSession(ctx, prompt)).then(() => {
					reply(true, "已带入新会话，可关闭设置窗口查看");
				}, (error) => {
					const message = error instanceof Error ? error.message : String(error);
					console.error("[dsh-connector] start prompt session failed:", error);
					reply(false, message);
				});
			};
			window.addEventListener("message", onMessage);
			return () => { window.removeEventListener("message", onMessage); };
		}

		/** 设置分区组件：整块渲染配置页 iframe（浅/深色主题由页面自适应）。 */
		function ConnectorSection() {
			(0, react.useEffect)(installSectionStyles, []);
			const src = window.location.origin + UI_PATH;
			return (0, react_jsx_runtime.jsx)("div", {
				className: "dshConnectorSection",
				children: (0, react_jsx_runtime.jsx)("iframe", {
					className: "dshConnectorSectionFrame",
					src,
					title: "MCP连接器"
				})
			});
		}

		function apply(ctx) {
			try {
				ctx.effect(() => installSectionStyles(), "dsh-connector: section styles");
				ctx.slots.inject("settings.section", () => ctx.slots.register({
					name: "settings.section",
					id: SECTION_ID,
					order: SECTION_ORDER,
					label: () => "MCP 连接器"
				}, ConnectorSection));
				ctx.effect(() => installPromptBridge(ctx), "dsh-connector: prompt bridge");
			} catch (error) {
				console.error("[dsh-connector] client apply() failed:", error);
			}
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
