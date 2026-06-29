import { BadRequestError } from '@rtorcato/api-errors'
import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { asyncHandler, errorHandler, notFoundHandler } from './index'

function buildApp(opts?: { includeStack?: boolean }) {
	const app = express()

	app.get('/ok', (_req, res) => {
		res.json({ ok: true })
	})

	app.get('/bad', (_req, _res, next) => {
		next(new BadRequestError('nope', 'too_bad'))
	})

	app.get('/boom', (_req, _res, next) => {
		next(new Error('kaboom'))
	})

	app.get(
		'/async-ok',
		asyncHandler(async (_req, res) => {
			res.json({ ok: true })
		})
	)

	app.get(
		'/async-bad',
		asyncHandler(async () => {
			throw new BadRequestError('async nope', 'async_bad')
		})
	)

	app.use(notFoundHandler)
	app.use(errorHandler(opts))
	return app
}

describe('errorHandler', () => {
	it('maps HttpError subclasses to their status + code', async () => {
		const res = await request(buildApp()).get('/bad')
		expect(res.status).toBe(400)
		expect(res.body).toMatchObject({
			error: 'BadRequestError',
			code: 'too_bad',
			message: 'nope',
		})
	})

	it('maps unknown errors to 500 / internal_server_error', async () => {
		const res = await request(buildApp()).get('/boom')
		expect(res.status).toBe(500)
		expect(res.body).toMatchObject({
			code: 'internal_server_error',
			message: 'kaboom',
		})
	})

	it('omits the stack by default', async () => {
		const res = await request(buildApp()).get('/boom')
		expect(res.body.stack).toBeUndefined()
	})

	it('includes the stack when includeStack: true', async () => {
		const res = await request(buildApp({ includeStack: true })).get('/boom')
		expect(typeof res.body.stack).toBe('string')
	})
})

describe('asyncHandler', () => {
	it('passes through a resolved handler', async () => {
		const res = await request(buildApp()).get('/async-ok')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ ok: true })
	})

	it('forwards a rejection to the error handler', async () => {
		const res = await request(buildApp()).get('/async-bad')
		expect(res.status).toBe(400)
		expect(res.body).toMatchObject({
			error: 'BadRequestError',
			code: 'async_bad',
			message: 'async nope',
		})
	})
})

describe('notFoundHandler', () => {
	it('forwards a NotFoundError so the error handler returns 404', async () => {
		const res = await request(buildApp()).get('/does-not-exist')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject({
			error: 'NotFoundError',
			code: 'not_found',
		})
		expect(res.body.message).toContain('/does-not-exist')
	})
})
