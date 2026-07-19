# example-mcp

A minimal [Model Context Protocol](https://modelcontextprotocol.io) server built
on the official [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk).

It exposes an in-memory "items" store — the same toy domain as the
[Express](../example-express) and [Hono](../example-hono) examples — through
three MCP tools:

| Tool | Input | Description |
|---|---|---|
| `list_items` | — | Return every item in the store |
| `add_item` | `{ name: string }` | Create an item and return it |
| `get_item` | `{ id: string }` | Fetch one item by id (errors if missing) |

## About `@rtorcato/api-mcp`

This demo talks to the SDK directly for registration and transports — the SDK
already covers those well. The one bit of boilerplate worth sharing is the
tool-result shape, so `asText`/`mcpError` come from
[`@rtorcato/api-mcp`](../../packages/api-mcp). Everything else stays on the SDK.

## Run locally

```bash
cd apps/example-mcp
pnpm dev
```

The server speaks MCP over **stdio** — stdout carries the JSON-RPC protocol, so
run it from an MCP client rather than a plain terminal. Example client config:

```json
{
  "mcpServers": {
    "example": { "command": "pnpm", "args": ["--filter", "@rtorcato/example-mcp", "dev"] }
  }
}
```

## Test

```bash
pnpm --filter @rtorcato/example-mcp test
```

Tests pair a `Client` with the server over the SDK's `InMemoryTransport`, so
tool calls round-trip in-process — no child process or stdio wiring needed.
