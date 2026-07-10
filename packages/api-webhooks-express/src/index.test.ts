import { sign } from '@rtorcato/api-webhooks'
import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { webhookMiddleware } from './index'

const SECRET = 'shhh'

function buildApp() {
	const app = express()
	app.post('/hook', webhookMiddleware({ secret: SECRET, header: 'x-signature' }), (req, res) =>
		res.json({ received: req.body })
	)
	return app
}

describe('webhookMiddleware', () => {
	it('accepts a correctly signed payload and parses it onto req.body', async () => {
		const body = JSON.stringify({ event: 'ping' })
		const res = await request(buildApp())
			.post('/hook')
			.set('Content-Type', 'application/json')
			.set('x-signature', sign(body, SECRET))
			.send(body)

		expect(res.status).toBe(200)
		expect(res.body).toEqual({ received: { event: 'ping' } })
	})

	it('rejects a bad signature with 401', async () => {
		const body = JSON.stringify({ event: 'ping' })
		const res = await request(buildApp())
			.post('/hook')
			.set('Content-Type', 'application/json')
			.set('x-signature', sign(body, 'wrong-secret'))
			.send(body)

		expect(res.status).toBe(401)
		expect(res.body).toMatchObject({ error: 'UnauthorizedError', code: 'unauthorized' })
	})

	it('rejects a missing signature with 401', async () => {
		const res = await request(buildApp())
			.post('/hook')
			.set('Content-Type', 'application/json')
			.send(JSON.stringify({ event: 'ping' }))

		expect(res.status).toBe(401)
	})
})
