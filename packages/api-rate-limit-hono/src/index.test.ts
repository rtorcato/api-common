import { memoryStore } from '@rtorcato/api-rate-limit'
import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { rateLimitMiddleware } from './index'

function buildApp(requests: number, windowMs: number) {
	const app = new Hono()
	app.use(rateLimitMiddleware({ requests, windowMs, store: memoryStore() }))
	app.get('/', (c) => c.json({ ok: true }))
	return app
}

describe('rateLimitMiddleware', () => {
	it('allows requests within the limit', async () => {
		const app = buildApp(3, 60_000)
		const res = await app.request('/')
		expect(res.status).toBe(200)
	})

	it('blocks requests that exceed the limit', async () => {
		const app = buildApp(2, 60_000)
		await app.request('/')
		await app.request('/')
		const res = await app.request('/')
		expect(res.status).toBe(429)
		const body = await res.json()
		expect(body).toMatchObject({ error: 'TooManyRequestsError', code: 'too_many_requests' })
	})
})
