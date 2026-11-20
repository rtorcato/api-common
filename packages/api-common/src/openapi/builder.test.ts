import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { buildOpenApiDocument, type OpenApiDocument } from './builder.js'

function buildSample() {
	return buildOpenApiDocument({
		info: { title: 'Users API', version: '1.2.3' },
		servers: [{ url: 'https://api.example.com' }],
		routes: [
			{
				method: 'get',
				path: '/users/:id',
				summary: 'Get a user',
				tags: ['users'],
				request: {
					params: z.object({ id: z.string() }),
					query: z.object({ verbose: z.boolean().optional() }),
				},
				responses: {
					200: {
						description: 'A user',
						schema: z.object({ id: z.string(), name: z.string() }),
					},
					404: { description: 'Not found' },
				},
			},
			{
				method: 'post',
				path: '/users',
				request: { body: z.object({ name: z.string().min(1) }) },
				responses: {
					201: { description: 'Created', schema: z.object({ id: z.string() }) },
				},
			},
		],
	})
}

/** Read an operation object from the document, failing loudly if the path/method is missing. */
function op(doc: OpenApiDocument, path: string, method: string): any {
	const item = doc.paths[path]
	if (!item) throw new Error(`missing path ${path}`)
	const operation = item[method]
	if (!operation) throw new Error(`missing ${method} ${path}`)
	return operation
}

describe('buildOpenApiDocument', () => {
	it('produces an OpenAPI 3.1 document with info and servers', () => {
		const doc = buildSample()
		expect(doc.openapi).toBe('3.1.0')
		expect(doc.info).toMatchObject({ title: 'Users API', version: '1.2.3' })
		expect(doc.servers).toEqual([{ url: 'https://api.example.com' }])
	})

	it('converts Express-style path params to OpenAPI style', () => {
		const doc = buildSample()
		expect(doc.paths['/users/{id}']).toBeDefined()
		expect(doc.paths['/users/:id']).toBeUndefined()
	})

	it('splits param/query object schemas into parameter objects', () => {
		const doc = buildSample()
		const params = op(doc, '/users/{id}', 'get').parameters as {
			name: string
			in: string
			required: boolean
		}[]
		const id = params.find((p) => p.name === 'id')
		const verbose = params.find((p) => p.name === 'verbose')
		// path params are always required; optional query params are not
		expect(id).toMatchObject({ in: 'path', required: true })
		expect(verbose).toMatchObject({ in: 'query', required: false })
	})

	it('derives request body and response schemas from Zod (no drift)', () => {
		const post = op(buildSample(), '/users', 'post')
		const bodySchema = post.requestBody.content['application/json'].schema
		expect(post.requestBody.required).toBe(true)
		expect(bodySchema.type).toBe('object')
		expect(bodySchema.properties.name).toBeDefined()
		expect(post.responses['201'].content['application/json'].schema).toBeDefined()
	})

	it('strips the JSON-Schema-only $schema marker from converted schemas', () => {
		const get = op(buildSample(), '/users/{id}', 'get')
		const schema = get.responses['200'].content['application/json'].schema
		expect(schema.$schema).toBeUndefined()
		expect(schema.type).toBe('object')
	})

	it('omits content for responses without a schema (e.g. 404)', () => {
		const get = op(buildSample(), '/users/{id}', 'get')
		expect(get.responses['404']).toEqual({ description: 'Not found' })
	})
})
