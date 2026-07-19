import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

/**
 * Wrap any value as an MCP tool success result: a single `text` content block
 * holding `JSON.stringify(value)`. This is the MCP-native shape — deliberately
 * *not* the `{ success, data }` REST envelope from `@rtorcato/api-response`,
 * since MCP tools have their own contract.
 *
 * Return it directly from a `registerTool` handler.
 */
export function asText(value: unknown): CallToolResult {
	return { content: [{ type: 'text', text: JSON.stringify(value) }] }
}

/**
 * Build an MCP tool *error* result: `isError: true` with the message in a
 * `text` content block. Use for expected failures (not found, bad input) where
 * you want the model to see the reason rather than throwing.
 */
export function mcpError(text: string): CallToolResult {
	return { isError: true, content: [{ type: 'text', text }] }
}
