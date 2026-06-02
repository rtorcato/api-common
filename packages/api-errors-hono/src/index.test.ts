import { BadRequestError } from '@rtorcato/api-errors'
import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { errorHandler, notFoundHandler } from './index'

function buildApp(opts?: { includeStack?: boolean }) {
	const app = new Hono()

	app.get('/ok', (c) => c.json({ ok: true }))

	app.get('/bad', () => {
		throw new BadRequestError('nope', 'too_bad')
	})

	app.get('/boom', () => {
		throw new Error('kaboom')
	})

	app.notFound(notFoundHandler)
	app.onError(errorHandler(opts))
	return app
}

describe('errorHandler', () => {
	it('maps HttpError subclasses to their status + code', async () => {
		const res = await buildApp().request('/bad')
		expect(res.status).toBe(400)
		expect(await res.json()).toMatchObject({
			error: 'BadRequestError',
			code: 'too_bad',
			message: 'nope',
		})
	})

	it('maps unknown errors to 500 / internal_server_error', async () => {
		const res = await buildApp().request('/boom')
		expect(res.status).toBe(500)
		expect(await res.json()).toMatchObject({
			code: 'internal_server_error',
			message: 'kaboom',
		})
	})

	it('omits the stack by default', async () => {
		const res = await buildApp().request('/boom')
		const body = (await res.json()) as { stack?: string }
		expect(body.stack).toBeUndefined()
	})

	it('includes the stack when includeStack: true', async () => {
		const res = await buildApp({ includeStack: true }).request('/boom')
		const body = (await res.json()) as { stack?: string }
		expect(typeof body.stack).toBe('string')
	})
})

describe('notFoundHandler', () => {
	it('forwards a NotFoundError so the error handler returns 404', async () => {
		const res = await buildApp().request('/does-not-exist')
		expect(res.status).toBe(404)
		const body = (await res.json()) as { error: string; code: string; message: string }
		expect(body).toMatchObject({
			error: 'NotFoundError',
			code: 'not_found',
		})
		expect(body.message).toContain('/does-not-exist')
	})
})
