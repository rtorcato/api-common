import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { signToken } from '@rtorcato/api-auth'
import { authMiddleware, optionalAuthMiddleware } from './index'

const SECRET = 'test-secret'

function buildApp(middleware: ReturnType<typeof authMiddleware>) {
	const app = express()
	app.use(middleware)
	app.get('/', (req, res) => res.json({ user: req.user }))
	app.use(
		(
			err: { status?: number; code?: string },
			_req: express.Request,
			res: express.Response,
			_next: express.NextFunction
		) => {
			res.status(err.status ?? 500).json({ code: err.code })
		}
	)
	return app
}

describe('authMiddleware', () => {
	it('sets req.user for a valid Bearer token', async () => {
		const token = signToken({ userId: 42 }, SECRET)
		const res = await request(buildApp(authMiddleware(SECRET)))
			.get('/')
			.set('Authorization', `Bearer ${token}`)
		expect(res.status).toBe(200)
		expect(res.body.user.userId).toBe(42)
	})

	it('returns 401 when no token is provided', async () => {
		const res = await request(buildApp(authMiddleware(SECRET))).get('/')
		expect(res.status).toBe(401)
		expect(res.body.code).toBe('missing_token')
	})

	it('returns 401 for an invalid token', async () => {
		const res = await request(buildApp(authMiddleware(SECRET)))
			.get('/')
			.set('Authorization', 'Bearer bad.token.here')
		expect(res.status).toBe(401)
		expect(res.body.code).toBe('invalid_token')
	})

	it('returns 401 for a token signed with the wrong secret', async () => {
		const token = signToken({ userId: 1 }, 'other-secret')
		const res = await request(buildApp(authMiddleware(SECRET)))
			.get('/')
			.set('Authorization', `Bearer ${token}`)
		expect(res.status).toBe(401)
		expect(res.body.code).toBe('invalid_token')
	})
})

describe('optionalAuthMiddleware', () => {
	it('sets req.user when a valid token is present', async () => {
		const token = signToken({ userId: 7 }, SECRET)
		const res = await request(buildApp(optionalAuthMiddleware(SECRET)))
			.get('/')
			.set('Authorization', `Bearer ${token}`)
		expect(res.status).toBe(200)
		expect(res.body.user.userId).toBe(7)
	})

	it('calls next without error when no token is present', async () => {
		const res = await request(buildApp(optionalAuthMiddleware(SECRET))).get('/')
		expect(res.status).toBe(200)
		expect(res.body.user).toBeUndefined()
	})

	it('calls next without error when token is invalid', async () => {
		const res = await request(buildApp(optionalAuthMiddleware(SECRET)))
			.get('/')
			.set('Authorization', 'Bearer bad.token')
		expect(res.status).toBe(200)
		expect(res.body.user).toBeUndefined()
	})
})
