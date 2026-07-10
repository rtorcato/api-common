import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { timeoutMiddleware } from './index'

describe('timeoutMiddleware', () => {
	it('passes through responses within the deadline', async () => {
		const app = new Hono()
		app.use(timeoutMiddleware({ ms: 1000 }))
		app.get('/', (c) => c.json({ ok: true }))

		const res = await app.request('/')
		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ ok: true })
	})

	it('responds 503 when the handler exceeds the deadline', async () => {
		const app = new Hono()
		app.use(timeoutMiddleware({ ms: 20 }))
		app.get('/', async (c) => {
			await new Promise((r) => setTimeout(r, 100))
			return c.json({ ok: true })
		})

		const res = await app.request('/')
		expect(res.status).toBe(503)
		expect(await res.json()).toMatchObject({
			error: 'ServiceUnavailableError',
			code: 'service_unavailable',
		})
	})
})
