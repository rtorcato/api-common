import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { mountOpenAPI, serveApiDocs, serveSwaggerDocs, specFromJsDoc } from './index.js'

const spec = { openapi: '3.1.0', info: { title: 'Test API', version: '1.0.0' }, paths: {} }

const app = express()
app.use('/api-docs', serveApiDocs(spec, { title: 'Test API' }))
app.use('/swagger', serveSwaggerDocs(spec, { title: 'Test API' }))

describe('serveApiDocs', () => {
	it('serves Scalar HTML at /', async () => {
		const res = await request(app).get('/api-docs/')
		expect(res.status).toBe(200)
		expect(res.type).toMatch(/html/)
		expect(res.text).toContain('<title>Test API</title>')
		expect(res.text).toContain('"openapi":"3.1.0"')
	})

	it('serves raw spec at /openapi.json', async () => {
		const res = await request(app).get('/api-docs/openapi.json')
		expect(res.status).toBe(200)
		expect(res.body).toEqual(spec)
	})
})

describe('serveSwaggerDocs', () => {
	it('serves Swagger UI HTML at /', async () => {
		const res = await request(app).get('/swagger/')
		expect(res.status).toBe(200)
		expect(res.type).toMatch(/html/)
		expect(res.text).toContain('<title>Test API</title>')
		expect(res.text).toContain('SwaggerUIBundle')
	})

	it('serves raw spec at /openapi.json', async () => {
		const res = await request(app).get('/swagger/openapi.json')
		expect(res.status).toBe(200)
		expect(res.body).toEqual(spec)
	})
})

describe('mountOpenAPI', () => {
	it('mounts spec + Scalar UI at default paths on the app', async () => {
		const a = express()
		mountOpenAPI(a, { doc: spec, title: 'Mounted' })

		const specRes = await request(a).get('/openapi.json')
		expect(specRes.status).toBe(200)
		expect(specRes.body).toEqual(spec)

		const docsRes = await request(a).get('/docs')
		expect(docsRes.status).toBe(200)
		expect(docsRes.type).toMatch(/html/)
		expect(docsRes.text).toContain('<title>Mounted</title>')
		// UI fetches the spec by URL, not inlined
		expect(docsRes.text).toContain('data-url="/openapi.json"')
		expect(docsRes.text).not.toContain('"openapi":"3.1.0"')
	})

	it('honours ui: swagger and custom paths', async () => {
		const a = express()
		mountOpenAPI(a, { doc: spec, ui: 'swagger', specPath: '/spec.json', docsPath: '/api-docs' })

		expect((await request(a).get('/spec.json')).status).toBe(200)
		const docsRes = await request(a).get('/api-docs')
		expect(docsRes.text).toContain('SwaggerUIBundle')
		expect(docsRes.text).toContain('url: "/spec.json"')
		// defaults are not mounted
		expect((await request(a).get('/docs')).status).toBe(404)
	})
})

describe('specFromJsDoc', () => {
	it('builds a spec from the definition (swagger-jsdoc optional peer)', async () => {
		const doc = (await specFromJsDoc({
			definition: { openapi: '3.1.0', info: { title: 'JsDoc API', version: '2.0.0' } },
			apis: [],
		})) as { openapi: string; info: { title: string }; paths: object }
		expect(doc.openapi).toBe('3.1.0')
		expect(doc.info.title).toBe('JsDoc API')
		expect(doc.paths).toBeDefined()
	})
})
