import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { corsMiddleware } from './index'

function buildApp(origin: string | string[]) {
	const app = express()
	app.use(corsMiddleware({ origin }))
	app.get('/', (_req, res) => res.json({ ok: true }))
	return app
}

describe('corsMiddleware', () => {
	it('sets Access-Control-Allow-Origin for an allowed origin', async () => {
		const app = buildApp('https://example.com')
		const res = await request(app).get('/').set('Origin', 'https://example.com')
		expect(res.headers['access-control-allow-origin']).toBe('https://example.com')
		expect(res.headers['access-control-allow-credentials']).toBe('true')
	})

	it('does not set ACAO for a disallowed origin', async () => {
		const app = buildApp('https://example.com')
		const res = await request(app).get('/').set('Origin', 'https://evil.com')
		expect(res.headers['access-control-allow-origin']).toBeUndefined()
	})

	it('handles an array of allowed origins', async () => {
		const app = buildApp(['https://a.com', 'https://b.com'])
		const resA = await request(app).get('/').set('Origin', 'https://a.com')
		const resB = await request(app).get('/').set('Origin', 'https://b.com')
		const resC = await request(app).get('/').set('Origin', 'https://c.com')
		expect(resA.headers['access-control-allow-origin']).toBe('https://a.com')
		expect(resB.headers['access-control-allow-origin']).toBe('https://b.com')
		expect(resC.headers['access-control-allow-origin']).toBeUndefined()
	})

	it('responds 204 to OPTIONS preflight', async () => {
		const app = buildApp('https://example.com')
		const res = await request(app)
			.options('/')
			.set('Origin', 'https://example.com')
			.set('Access-Control-Request-Method', 'POST')
		expect(res.status).toBe(204)
		expect(res.headers['access-control-allow-methods']).toContain('POST')
	})

	it('accepts a predicate function for origin', async () => {
		const app = express()
		app.use(corsMiddleware({ origin: (o) => o?.endsWith('.example.com') ?? false }))
		app.get('/', (_req, res) => res.json({ ok: true }))

		const good = await request(app).get('/').set('Origin', 'https://sub.example.com')
		const bad = await request(app).get('/').set('Origin', 'https://other.com')
		expect(good.headers['access-control-allow-origin']).toBe('https://sub.example.com')
		expect(bad.headers['access-control-allow-origin']).toBeUndefined()
	})
})
