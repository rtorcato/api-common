import { errorBody, successBody, supertest } from '@rtorcato/api-testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('items API (ts-rest + express)', () => {
	let req: ReturnType<typeof supertest>

	beforeEach(() => {
		req = supertest(createApp())
	})

	it('GET /items returns empty list', async () => {
		const res = await req.get('/items')
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(successBody([]))
	})

	it('POST /items creates an item', async () => {
		const res = await req.post('/items').send({ name: 'Widget' })
		expect(res.status).toBe(201)
		expect(res.body).toMatchObject(successBody({ name: 'Widget' }))
		expect(res.body.data.id).toBeDefined()
	})

	it('POST /items rejects an invalid body (ts-rest contract validation)', async () => {
		const res = await req.post('/items').send({ name: '' })
		expect(res.status).toBe(400)
	})

	it('GET /items/:id returns the shared 404 envelope for a missing item', async () => {
		const res = await req.get('/items/nonexistent')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject(errorBody('not_found'))
	})

	it('GET unknown route returns 404', async () => {
		const res = await req.get('/nope')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject(errorBody('not_found'))
	})

	it('serves the OpenAPI doc generated from the contract', async () => {
		const res = await req.get('/openapi.json')
		expect(res.status).toBe(200)
		expect(res.body.openapi).toBe('3.1.0')
		expect(res.body.info.title).toBe('Example ts-rest API')
	})

	it('serves the Scalar docs UI', async () => {
		const res = await req.get('/docs')
		expect(res.status).toBe(200)
		expect(res.text).toContain('api-reference')
	})

	it('GET /healthz reports liveness', async () => {
		const res = await req.get('/healthz')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ status: 'healthy' })
	})

	it('GET /readyz reports readiness', async () => {
		const res = await req.get('/readyz')
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ status: 'healthy', checks: { self: { status: 'healthy' } } })
	})
})
