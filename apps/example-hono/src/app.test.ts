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
