# @rtorcato/api-mcp

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-mcp.svg)](https://www.npmjs.com/package/@rtorcato/api-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-mcp.svg)](https://www.npmjs.com/package/@rtorcato/api-mcp)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-mcp)](https://bundlephobia.com/package/@rtorcato/api-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Two tiny result helpers for MCP tool handlers built on the official
[`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk).

The SDK already owns tool/resource registration and transports, so this package
is deliberately minimal — it only removes the `asText` / error-result
boilerplate every server rewrites. Everything else, use the SDK directly.

## Install

```sh
pnpm add @rtorcato/api-mcp @modelcontextprotocol/sdk
```

`@modelcontextprotocol/sdk` is a peer dependency — you control the version.

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

## API

- `asText(value)` → success result: `{ content: [{ type: 'text', text: JSON.stringify(value) }] }`.
- `mcpError(text)` → error result: `{ isError: true, content: [{ type: 'text', text }] }`.

Both return the SDK's `CallToolResult` type, so they drop straight into a
`registerTool` handler.
