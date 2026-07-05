import { initContract } from '@ts-rest/core'
import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { defaultErrorSchema, initServer, mountTsRest, withDefaultErrors } from './index'

const c = initContract()
const contract = c.router({
	getUser: {
		method: 'GET',
		path: '/users/:id',
		pathParams: z.object({ id: z.string() }),
		responses: {
			200: z.object({ id: z.string(), name: z.string() }),
			404: z.object({ message: z.string() }),
		},
		summary: 'Get a user by ID',
	},
	createUser: {
		method: 'POST',
		path: '/users',
		body: z.object({ name: z.string().min(1) }),
		responses: { 201: z.object({ id: z.string(), name: z.string() }) },
	},
})

function buildApp() {
	const s = initServer()
	const router = s.router(contract, {
		getUser: async ({ params: { id } }) =>
			id === 'x'
				? { status: 200, body: { id: 'x', name: 'Ada' } }
				: { status: 404, body: { message: 'not found' } },
		createUser: async ({ body }) => ({ status: 201, body: { id: '1', name: body.name } }),
	})

	const app = express()
	app.use(express.json())
	mountTsRest(app, {
		contract,
		router,
		openapi: { info: { title: 'Users API', version: '1.0.0' } },
	})
	return app
}

describe('mountTsRest', () => {
	it('serves contract GET routes with typed responses', async () => {
		const res = await request(buildApp()).get('/users/x')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ id: 'x', name: 'Ada' })
	})

	it('serves contract POST routes', async () => {
		const res = await request(buildApp()).post('/users').send({ name: 'Grace' })
		expect(res.status).toBe(201)
		expect(res.body).toEqual({ id: '1', name: 'Grace' })
	})

	it('generates and serves the OpenAPI doc from the contract', async () => {
		const res = await request(buildApp()).get('/openapi.json')
		expect(res.status).toBe(200)
		expect(res.body.openapi).toBe('3.1.0')
		expect(res.body.info.title).toBe('Users API')
		expect(res.body.paths['/users/{id}'].get).toBeDefined()
		expect(res.body.paths['/users'].post).toBeDefined()
	})

	it('serves the Scalar docs UI', async () => {
		const res = await request(buildApp()).get('/docs')
		expect(res.status).toBe(200)
		expect(res.text).toContain('api-reference')
	})
})

describe('withDefaultErrors', () => {
	it('adds 400/404/500 default error schemas', () => {
		const responses = withDefaultErrors({ 200: z.object({ id: z.string() }) })
		expect(responses[400]).toBe(defaultErrorSchema)
		expect(responses[404]).toBe(defaultErrorSchema)
		expect(responses[500]).toBe(defaultErrorSchema)
	})

	it('lets caller-defined statuses win over the defaults', () => {
		const custom404 = z.object({ message: z.string() })
		const responses = withDefaultErrors({ 200: z.object({ id: z.string() }), 404: custom404 })
		expect(responses[404]).toBe(custom404)
		expect(responses[400]).toBe(defaultErrorSchema)
	})

	it('produces schemas matching the api-errors envelope shape', () => {
		expect(
			defaultErrorSchema.parse({ error: 'NotFoundError', code: 'not_found', message: 'nope' })
		).toEqual({
			error: 'NotFoundError',
			code: 'not_found',
			message: 'nope',
		})
	})
})
