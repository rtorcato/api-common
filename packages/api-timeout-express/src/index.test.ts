import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { timeoutMiddleware } from './index'

describe('timeoutMiddleware', () => {
	it('passes through responses within the deadline', async () => {
		const app = express()
		app.use(timeoutMiddleware({ ms: 1000 }))
		app.get('/', (_req, res) => res.json({ ok: true }))

		const res = await request(app).get('/')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ ok: true })
	})

	it('responds 503 when the handler exceeds the deadline', async () => {
		const app = express()
		app.use(timeoutMiddleware({ ms: 20 }))
		app.get('/', (_req, res) => {
			// Never answers within the window; guard the late write so it can't
			// throw "headers already sent" after the 503 has gone out.
			setTimeout(() => {
				if (!res.headersSent) res.json({ ok: true })
			}, 100)
		})

		const res = await request(app).get('/')
		expect(res.status).toBe(503)
		expect(res.body).toMatchObject({
			error: 'ServiceUnavailableError',
			code: 'service_unavailable',
		})
	})
})
