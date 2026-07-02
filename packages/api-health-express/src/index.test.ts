import { createHealthRegistry } from '@rtorcato/api-health'
import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { livenessHandler, readinessHandler } from './index'

describe('health express handlers', () => {
	it('liveness always returns 200', async () => {
		const app = express()
		app.get('/healthz', livenessHandler())
		const res = await request(app).get('/healthz')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ status: 'healthy' })
	})

	it('readiness returns 200 when checks pass', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {})
		const app = express()
		app.get('/readyz', readinessHandler(reg))
		const res = await request(app).get('/readyz')
		expect(res.status).toBe(200)
		expect(res.body.status).toBe('healthy')
	})

	it('readiness returns 503 when a check fails', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {
			throw new Error('down')
		})
		const app = express()
		app.get('/readyz', readinessHandler(reg))
		const res = await request(app).get('/readyz')
		expect(res.status).toBe(503)
		expect(res.body).toEqual({
			status: 'unhealthy',
			checks: { db: { status: 'unhealthy', error: 'down' } },
		})
	})
})
