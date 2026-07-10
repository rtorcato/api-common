import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { securityMiddleware } from './index'

function buildApp(mw: express.RequestHandler = securityMiddleware()) {
	const app = express()
	app.use(mw)
	app.get('/', (_req, res) => res.json({ ok: true }))
	return app
}

describe('securityMiddleware', () => {
	it('applies helmet baseline security headers', async () => {
		const res = await request(buildApp()).get('/')
		expect(res.headers['x-content-type-options']).toBe('nosniff')
		expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
		expect(res.headers['x-dns-prefetch-control']).toBe('off')
	})

	it('sets HSTS and a default CSP out of the box', async () => {
		const res = await request(buildApp()).get('/')
		expect(res.headers['strict-transport-security']).toBeDefined()
		expect(res.headers['content-security-policy']).toBeDefined()
	})

	it('forwards options to helmet', async () => {
		// helmet's default Referrer-Policy is `no-referrer`; override proves passthrough.
		const app = buildApp(securityMiddleware({ referrerPolicy: { policy: 'same-origin' } }))
		const res = await request(app).get('/')
		expect(res.headers['referrer-policy']).toBe('same-origin')
	})
})
