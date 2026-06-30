import { errorBody, successBody, supertest } from '@rtorcato/api-testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('items API (express)', () => {
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

	it('POST /items rejects invalid body', async () => {
		const res = await req.post('/items').send({ name: '' })
		expect(res.status).toBe(400)
		expect(res.body).toMatchObject(errorBody('validation_error'))
	})

	it('GET /items/:id returns 404 for missing item', async () => {
		const res = await req.get('/items/nonexistent')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject(errorBody('not_found'))
	})

	it('GET unknown route returns 404', async () => {
		const res = await req.get('/nope')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject(errorBody('not_found'))
	})
})
