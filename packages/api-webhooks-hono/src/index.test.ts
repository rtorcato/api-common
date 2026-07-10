import { sign } from '@rtorcato/api-webhooks'
import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { webhookMiddleware } from './index'

const SECRET = 'shhh'

function buildApp() {
	const app = new Hono()
	app.post('/hook', webhookMiddleware({ secret: SECRET, header: 'x-signature' }), async (c) => {
		const payload = await c.req.json()
		return c.json({ received: payload })
	})
	return app
}

async function post(app: Hono, body: string, signature?: string) {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' }
	if (signature !== undefined) headers['x-signature'] = signature
	return app.request('/hook', { method: 'POST', headers, body })
}

describe('webhookMiddleware', () => {
	it('accepts a correctly signed payload; handler can still read the body', async () => {
		const body = JSON.stringify({ event: 'ping' })
		const res = await post(buildApp(), body, sign(body, SECRET))
		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ received: { event: 'ping' } })
	})

	it('rejects a bad signature with 401', async () => {
		const body = JSON.stringify({ event: 'ping' })
		const res = await post(buildApp(), body, sign(body, 'wrong-secret'))
		expect(res.status).toBe(401)
		expect(await res.json()).toMatchObject({ error: 'UnauthorizedError', code: 'unauthorized' })
	})

	it('rejects a missing signature with 401', async () => {
		const res = await post(buildApp(), JSON.stringify({ event: 'ping' }))
		expect(res.status).toBe(401)
	})
})
