import { createHealthRegistry } from '@rtorcato/api-health'
import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { livenessHandler, readinessHandler } from './index'

describe('health hono handlers', () => {
	it('liveness always returns 200', async () => {
		const app = new Hono()
		app.get('/healthz', livenessHandler())
		const res = await app.request('/healthz')
		expect(res.status).toBe(200)
		expect(await res.json()).toEqual({ status: 'healthy' })
	})

	it('readiness returns 200 when checks pass', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {})
		const app = new Hono()
		app.get('/readyz', readinessHandler(reg))
		const res = await app.request('/readyz')
		expect(res.status).toBe(200)
		expect(((await res.json()) as { status: string }).status).toBe('healthy')
	})

	it('readiness returns 503 when a check fails', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {
			throw new Error('down')
		})
		const app = new Hono()
		app.get('/readyz', readinessHandler(reg))
		const res = await app.request('/readyz')
		expect(res.status).toBe(503)
		expect(await res.json()).toEqual({
			status: 'unhealthy',
			checks: { db: { status: 'unhealthy', error: 'down' } },
		})
	})
})
