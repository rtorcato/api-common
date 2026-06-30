import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { serveApiDocs, serveSwaggerDocs } from './index.js'

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
