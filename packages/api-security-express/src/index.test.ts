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
	it('sets baseline security headers', async () => {
		const res = await request(buildApp()).get('/')
		expect(res.headers['x-content-type-options']).toBe('nosniff')
		expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
		expect(res.headers['x-dns-prefetch-control']).toBe('off')
	})

	it('enables HSTS by default', async () => {
		const res = await request(buildApp()).get('/')
		expect(res.headers['strict-transport-security']).toBeDefined()
	})

	it('disables CSP by default (API-friendly)', async () => {
		const res = await request(buildApp()).get('/')
		expect(res.headers['content-security-policy']).toBeUndefined()
	})

	it('enables CSP when requested', async () => {
		const res = await request(buildApp(securityMiddleware({ contentSecurityPolicy: true }))).get(
			'/'
		)
		expect(res.headers['content-security-policy']).toBeDefined()
	})

	it('disables HSTS when requested', async () => {
		const res = await request(buildApp(securityMiddleware({ hsts: false }))).get('/')
		expect(res.headers['strict-transport-security']).toBeUndefined()
	})
})
