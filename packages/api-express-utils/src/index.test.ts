import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { getIP, logRoutes } from './index'

describe('getIP', () => {
	it('takes the leftmost X-Forwarded-For entry', async () => {
		const app = express()
		app.get('/', (req, res) => res.json({ ip: getIP(req) }))
		const res = await request(app)
			.get('/')
			.set('X-Forwarded-For', '203.0.113.5, 70.41.3.18, 150.172.238.178')
		expect(res.body.ip).toBe('203.0.113.5')
	})

	it('falls back to req.ip / socket when no header is present', async () => {
		const app = express()
		app.get('/', (req, res) => res.json({ ip: getIP(req) }))
		const res = await request(app).get('/')
		// supertest connects over loopback
		expect(res.body.ip).toMatch(/127\.0\.0\.1|::1|::ffff:127\.0\.0\.1/)
	})
})

describe('logRoutes', () => {
	it('lists top-level and mounted routes', () => {
		const app = express()
		app.get('/health', (_req, res) => res.end())
		app.post('/users', (_req, res) => res.end())

		const router = express.Router()
		router.get('/:id', (_req, res) => res.end())
		app.use('/widgets', router)

		const routes = logRoutes(app, { log: false })
		expect(routes).toContainEqual({ method: 'GET', path: '/health' })
		expect(routes).toContainEqual({ method: 'POST', path: '/users' })
		expect(routes).toContainEqual({ method: 'GET', path: '/:id' })
	})

	it('invokes a custom log sink', () => {
		const app = express()
		app.get('/ping', (_req, res) => res.end())
		const lines: string[] = []
		logRoutes(app, { log: (l) => lines.push(l) })
		expect(lines).toContain('GET /ping')
	})
})
