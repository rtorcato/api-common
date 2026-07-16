---
title: MCP example
description: Minimal Model Context Protocol server built on the official SDK.
---

The `apps/example-mcp` directory contains a minimal
[Model Context Protocol](https://modelcontextprotocol.io) server built on the
official [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk).
It exposes an in-memory "items" store — the same toy domain as the
[Express](./express.md) and [Hono](./hono.md) examples — so you can compare an
MCP server against the HTTP APIs.

## Tools

| Tool | Input | Description |
|---|---|---|
| `list_items` | — | Return every item in the store |
| `add_item` | `{ name: string }` | Create an item and return it |
| `get_item` | `{ id: string }` | Fetch one item by id (errors if missing) |

Each tool returns its payload as a JSON string in a `text` content block — the
MCP-native shape, deliberately *not* the `{ success, data }` REST envelope from
`api-response`, since MCP has its own contract.

## Why no `api-mcp` package

This demo talks to the SDK directly. The SDK already covers tool/resource
registration and transports, so a `@rtorcato/api-mcp` wrapper would add little —
which is why there is no such package.

## Run locally

```bash
cd apps/example-mcp
pnpm dev
```

The server speaks MCP over **stdio**: stdout carries the JSON-RPC protocol
(logging goes to stderr), so run it from an MCP client rather than a plain
terminal. Example client config:

```json
{
  "mcpServers": {
    "example": { "command": "pnpm", "args": ["--filter", "@rtorcato/example-mcp", "dev"] }
  }
}
```

## How it's tested

Tests pair a `Client` with the server over the SDK's `InMemoryTransport`, so
tool calls round-trip in-process — no child process or stdio wiring needed.

## Source

[`apps/example-mcp/src/server.ts`](https://github.com/rtorcato/api-common/tree/main/apps/example-mcp/src/server.ts)
