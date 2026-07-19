---
"@rtorcato/api-mcp": minor
---

Add `@rtorcato/api-mcp` — two tiny result helpers for `@modelcontextprotocol/sdk`
MCP tool handlers: `asText(value)` (JSON success content block) and
`mcpError(text)` (`isError` content block). Both return the SDK's
`CallToolResult`, so they drop straight into `registerTool`. The SDK is a peer
dependency. Scope is deliberately minimal — the SDK already owns registration
and transports; this only removes the result-shaping boilerplate every server
rewrites. `example-mcp` now uses it.
