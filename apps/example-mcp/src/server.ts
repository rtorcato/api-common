import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

/**
 * A minimal MCP server exposing an in-memory "items" store — the same toy
 * domain as the Express/Hono examples, so the three can be compared. The store
 * lives inside the closure, so every `createServer()` call is isolated (handy
 * for tests).
 *
 * Tools return their payload as a JSON string in a `text` content block, which
 * is the MCP-native shape — deliberately *not* the `{ success, data }` REST
 * envelope from `@rtorcato/api-response`, since MCP has its own contract.
 */
export function createServer() {
	const items = new Map<string, { id: string; name: string }>()

	const server = new McpServer({ name: 'example-mcp', version: '0.0.0' })

	const asText = (value: unknown) => ({
		content: [{ type: 'text' as const, text: JSON.stringify(value) }],
	})

	server.registerTool(
		'list_items',
		{ title: 'List items', description: 'Return every item in the store.' },
		async () => asText([...items.values()])
	)

	server.registerTool(
		'add_item',
		{
			title: 'Add item',
			description: 'Create an item and return it.',
			inputSchema: { name: z.string().min(1) },
		},
		async ({ name }) => {
			const item = { id: crypto.randomUUID(), name }
			items.set(item.id, item)
			return asText(item)
		}
	)

	server.registerTool(
		'get_item',
		{
			title: 'Get item',
			description: 'Fetch a single item by id.',
			inputSchema: { id: z.string() },
		},
		async ({ id }) => {
			const item = items.get(id)
			if (!item) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: `Item ${id} not found` }],
				}
			}
			return asText(item)
		}
	)

	return server
}
