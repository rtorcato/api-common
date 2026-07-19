---
title: api-mcp
description: Tiny result helpers for @modelcontextprotocol/sdk MCP tool handlers.
---

`@rtorcato/api-mcp` provides two helpers that shape the result an MCP tool
handler returns. The official [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk)
already owns tool/resource registration and transports — this package only
removes the result-shaping boilerplate every server rewrites.

## Install

```bash
pnpm add @rtorcato/api-mcp @modelcontextprotocol/sdk
```

`@modelcontextprotocol/sdk` is a peer dependency — you control the version.

## Helpers

| Function | Returns |
|----------|---------|
| `asText(value)` | `{ content: [{ type: 'text', text: JSON.stringify(value) }] }` |
| `mcpError(text)` | `{ isError: true, content: [{ type: 'text', text }] }` |

Both return the SDK's `CallToolResult`, so they drop straight into a
`registerTool` handler.

## Usage

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { asText, mcpError } from '@rtorcato/api-mcp'
import { z } from 'zod'

const server = new McpServer({ name: 'example', version: '0.0.0' })
const items = new Map<string, { id: string; name: string }>()

server.registerTool('list_items', { title: 'List items' }, async () =>
  asText([...items.values()])
)

server.registerTool(
  'get_item',
  { title: 'Get item', inputSchema: { id: z.string() } },
  async ({ id }) => {
    const item = items.get(id)
    return item ? asText(item) : mcpError(`Item ${id} not found`)
  }
)
```

## Why so minimal

MCP tools have their own contract — a list of typed content blocks — which is
deliberately **not** the `{ success, data }` REST envelope from
[`@rtorcato/api-response`](./api-response.md). `asText` serializes a value into
the MCP-native `text` block; `mcpError` flags an expected failure so the model
sees the reason instead of the call throwing. Everything else, use the SDK
directly.
