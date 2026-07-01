import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { describe, expect, it } from 'vitest'
import { configureOpenAPI } from './index'

function buildApp() {
	const app = new OpenAPIHono()
	const route = createRoute({
		method: 'get',
		path: '/ping',
		responses: {
			200: {
				content: { 'application/json': { schema: z.object({ ok: z.boolean() }) } },
				description: 'pong',
			},
		},
	})
	app.openapi(route, (c) => c.json({ ok: true }))
	return app
}

describe('configureOpenAPI', () => {
	it('serves the OpenAPI 3.1 document at the default /doc, derived from the route schemas', async () => {
		const app = configureOpenAPI(buildApp(), {
			document: { info: { title: 'Test API', version: '1.2.3' } },
		})
		const res = await app.request('/doc')
		expect(res.status).toBe(200)
		const spec = (await res.json()) as {
			openapi: string
			info: { title: string; version: string }
			paths: Record<string, unknown>
		}
		expect(spec.openapi).toMatch(/^3\.1/)
		expect(spec.info).toMatchObject({ title: 'Test API', version: '1.2.3' })
		// path comes from the createRoute definition, not hand-written — proves no drift
		expect(spec.paths['/ping']).toBeDefined()
	})

	it('serves the Scalar reference UI pointing at the doc path', async () => {
		const app = configureOpenAPI(buildApp(), {
			document: { info: { title: 'Test API', version: '1.0.0' } },
		})
		const res = await app.request('/reference')
		expect(res.status).toBe(200)
		expect(res.headers.get('content-type')).toContain('text/html')
		const html = await res.text()
		expect(html).toContain('/doc')
	})

	it('honours custom docPath and referencePath', async () => {
		const app = configureOpenAPI(buildApp(), {
			document: { info: { title: 'Test API', version: '1.0.0' } },
			docPath: '/openapi.json',
			referencePath: '/docs',
		})
		expect((await app.request('/openapi.json')).status).toBe(200)
		expect((await app.request('/docs')).status).toBe(200)
		// defaults must no longer be mounted
		expect((await app.request('/doc')).status).toBe(404)
		expect((await app.request('/reference')).status).toBe(404)
	})
})
