import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { createServer } from './server.js'

// Pair a client and the server over the SDK's in-memory transport — no child
// process or stdio needed, so tool calls round-trip in-process.
async function connect() {
	const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
	const client = new Client({ name: 'test-client', version: '0.0.0' })
	await Promise.all([createServer().connect(serverTransport), client.connect(clientTransport)])
	return client
}

// Tool results carry the JSON payload as text in the first content block.
const payload = (result: { content: Array<{ type: string; text?: string }> }) =>
	JSON.parse(result.content[0]?.text ?? 'null')

describe('example-mcp server', () => {
	let client: Client

	beforeEach(async () => {
		client = await connect()
	})

	it('lists the registered tools', async () => {
		const { tools } = await client.listTools()
		expect(tools.map((t) => t.name).sort()).toEqual(['add_item', 'get_item', 'list_items'])
	})

	it('add_item then get_item round-trips the item', async () => {
		const added = payload(
			(await client.callTool({ name: 'add_item', arguments: { name: 'Widget' } })) as never
		)
		expect(added).toMatchObject({ name: 'Widget' })
		expect(added.id).toBeDefined()

		const fetched = payload(
			(await client.callTool({ name: 'get_item', arguments: { id: added.id } })) as never
		)
		expect(fetched).toEqual(added)
	})

	it('get_item reports an error for an unknown id', async () => {
		const result = (await client.callTool({
			name: 'get_item',
			arguments: { id: 'nope' },
		})) as { isError?: boolean; content: Array<{ text?: string }> }
		expect(result.isError).toBe(true)
		expect(result.content[0]?.text).toContain('not found')
	})
})
