import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.js'

// stdio transport: the protocol owns stdout, so anything we want to log must go
// to stderr or it will corrupt the JSON-RPC stream.
const server = createServer()
const transport = new StdioServerTransport()
await server.connect(transport)

console.error('example-mcp server listening on stdio')
