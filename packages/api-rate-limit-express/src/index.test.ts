import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { rateLimitMiddleware } from './index'

function buildApp(requests: number, windowMs: number) {
	const app = express()
	app.use(rateLimitMiddleware({ requests, windowMs }))
	app.get('/', (_req, res) => res.json({ ok: true }))
	return app
}

describe('rateLimitMiddleware', () => {
	it('allows requests within the limit', async () => {
		const app = buildApp(3, 60_000)
		const res = await request(app).get('/')
		expect(res.status).toBe(200)
	})

	it('blocks requests that exceed the limit', async () => {
		const app = buildApp(2, 60_000)
		await request(app).get('/')
		await request(app).get('/')
		const res = await request(app).get('/')
		expect(res.status).toBe(429)
		expect(res.body).toMatchObject({ success: false, code: 'rate_limited' })
	})
})
