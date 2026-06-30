import express from 'express'
import { describe, expect, it } from 'vitest'
import {
	supertest,
	testToken,
	bearerHeader,
	errorBody,
	successBody,
	honoFetch,
	TEST_JWT_SECRET,
} from './index'
import { verifyToken } from '@rtorcato/api-auth'

describe('testToken / bearerHeader', () => {
	it('produces a verifiable JWT', () => {
		const token = testToken({ userId: 99 })
		const payload = verifyToken<{ userId: number }>(token, TEST_JWT_SECRET)
		expect(payload.userId).toBe(99)
	})

	it('defaults payload to { userId: 1 }', () => {
		const token = testToken()
		const payload = verifyToken<{ userId: number }>(token, TEST_JWT_SECRET)
		expect(payload.userId).toBe(1)
	})

	it('bearerHeader returns the right shape', () => {
		expect(bearerHeader('abc')).toEqual({ Authorization: 'Bearer abc' })
	})
})

describe('errorBody / successBody', () => {
	it('errorBody matches a code', () => {
		expect({ code: 'not_found', error: 'NotFoundError', message: 'Not Found' }).toMatchObject(
			errorBody('not_found')
		)
	})

	it('errorBody merges extra fields', () => {
		expect({ code: 'not_found', message: 'nope' }).toMatchObject(
			errorBody('not_found', { message: 'nope' })
		)
	})

	it('successBody wraps data', () => {
		expect({ success: true, data: { id: 1 } }).toMatchObject(successBody({ id: 1 }))
	})
})

describe('supertest', () => {
	it('works with an express app', async () => {
		const app = express()
		app.get('/', (_req, res) => res.json({ ok: true }))
		const res = await supertest(app).get('/')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ ok: true })
	})
})

describe('honoFetch', () => {
	it('calls app.fetch with a Request', async () => {
		const app = {
			fetch: async (req: Request) =>
				new Response(JSON.stringify({ path: new URL(req.url).pathname }), {
					headers: { 'Content-Type': 'application/json' },
				}),
		}
		const res = await honoFetch(app, '/hello')
		const body = (await res.json()) as { path: string }
		expect(body.path).toBe('/hello')
	})
})
