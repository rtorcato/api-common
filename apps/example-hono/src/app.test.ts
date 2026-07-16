import { createHmac } from 'node:crypto'
import { errorBody, honoFetch, successBody } from '@rtorcato/api-testing'
import { describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('items API (hono)', () => {
	it('GET /items returns empty list', async () => {
		const res = await honoFetch(createApp(), '/items')
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchObject(successBody([]))
	})

	it('POST /items creates an item', async () => {
		const app = createApp()
		const res = await honoFetch(app, '/items', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: 'Widget' }),
		})
		const body = (await res.json()) as { data: { id: string; name: string } }
		expect(res.status).toBe(201)
		expect(body).toMatchObject(successBody({ name: 'Widget' }))
		expect(body.data.id).toBeDefined()
	})

	it('POST /items rejects invalid body', async () => {
		const res = await honoFetch(createApp(), '/items', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: '' }),
		})
		expect(res.status).toBe(400)
		expect(await res.json()).toMatchObject(errorBody('validation_error'))
	})

	it('GET /items/:id returns 404 for missing item', async () => {
		const res = await honoFetch(createApp(), '/items/nonexistent')
		expect(res.status).toBe(404)
		expect(await res.json()).toMatchObject(errorBody('not_found'))
	})

	it('GET unknown route returns 404', async () => {
		const res = await honoFetch(createApp(), '/nope')
		expect(res.status).toBe(404)
		expect(await res.json()).toMatchObject(errorBody('not_found'))
	})
})

describe('auth (hono)', () => {
	it('issues a token and accepts it on the protected route', async () => {
		const app = createApp()
		const login = await honoFetch(app, '/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: 'ada' }),
		})
		expect(login.status).toBe(200)
		const { data } = (await login.json()) as { data: { token: string } }
		expect(data.token).toBeDefined()

		const me = await honoFetch(app, '/me', { headers: { authorization: `Bearer ${data.token}` } })
		expect(me.status).toBe(200)
		const body = (await me.json()) as { data: { user: { sub: string } } }
		expect(body.data.user.sub).toBe('ada')
	})

	it('rejects the protected route without a token', async () => {
		const res = await honoFetch(createApp(), '/me')
		expect(res.status).toBe(401)
		expect(await res.json()).toMatchObject(errorBody('missing_token'))
	})
})

describe('webhooks (hono)', () => {
	const secret = 'whsec_test'
	const sign = (raw: string) => `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`

	it('POST /webhooks accepts a correctly signed payload', async () => {
		const raw = JSON.stringify({ event: 'ping' })
		const res = await honoFetch(createApp({ webhookSecret: secret }), '/webhooks', {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'x-hub-signature-256': sign(raw) },
			body: raw,
		})
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchObject(successBody({ received: true }))
	})

	it('POST /webhooks rejects a bad signature with 401', async () => {
		const raw = JSON.stringify({ event: 'ping' })
		const res = await honoFetch(createApp({ webhookSecret: secret }), '/webhooks', {
			method: 'POST',
			headers: { 'content-type': 'application/json', 'x-hub-signature-256': 'sha256=deadbeef' },
			body: raw,
		})
		expect(res.status).toBe(401)
		expect(await res.json()).toMatchObject(errorBody('unauthorized'))
	})
})

describe('health + docs (hono)', () => {
	it('GET /healthz reports liveness', async () => {
		const res = await honoFetch(createApp(), '/healthz')
		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ status: 'healthy' })
	})

	it('GET /readyz reports readiness', async () => {
		const res = await honoFetch(createApp(), '/readyz')
		expect(res.status).toBe(200)
		expect(await res.json()).toMatchObject({
			status: 'healthy',
			checks: { self: { status: 'healthy' } },
		})
	})

	it('serves the OpenAPI 3.1 doc generated from the route schemas', async () => {
		const res = await honoFetch(createApp(), '/doc')
		expect(res.status).toBe(200)
		const spec = (await res.json()) as { openapi: string; paths: Record<string, unknown> }
		expect(spec.openapi).toMatch(/^3\.1/)
		expect(spec.paths['/items']).toBeDefined()
	})

	it('serves the Scalar reference UI', async () => {
		const res = await honoFetch(createApp(), '/reference')
		expect(res.status).toBe(200)
		expect(res.headers.get('content-type')).toContain('text/html')
	})
})
