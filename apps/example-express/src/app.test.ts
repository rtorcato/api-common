import { createHmac } from 'node:crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { errorBody, successBody, supertest } from '@rtorcato/api-testing'
import { mockClient } from 'aws-sdk-client-mock'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('items API (express)', () => {
	let req: ReturnType<typeof supertest>

	beforeEach(() => {
		req = supertest(createApp())
	})

	it('GET /items returns empty list', async () => {
		const res = await req.get('/items')
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(successBody([]))
	})

	it('POST /items creates an item', async () => {
		const res = await req.post('/items').send({ name: 'Widget' })
		expect(res.status).toBe(201)
		expect(res.body).toMatchObject(successBody({ name: 'Widget' }))
		expect(res.body.data.id).toBeDefined()
	})

	it('POST /items rejects invalid body', async () => {
		const res = await req.post('/items').send({ name: '' })
		expect(res.status).toBe(400)
		expect(res.body).toMatchObject(errorBody('validation_error'))
	})

	it('GET /items/:id returns 404 for missing item', async () => {
		const res = await req.get('/items/nonexistent')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject(errorBody('not_found'))
	})

	it('GET unknown route returns 404', async () => {
		const res = await req.get('/nope')
		expect(res.status).toBe(404)
		expect(res.body).toMatchObject(errorBody('not_found'))
	})
})

describe('auth API (express)', () => {
	let req: ReturnType<typeof supertest>

	beforeEach(() => {
		req = supertest(createApp())
	})

	it('POST /login returns a token', async () => {
		const res = await req.post('/login').send({ username: 'alice' })
		expect(res.status).toBe(200)
		expect(typeof res.body.data.token).toBe('string')
	})

	it('GET /me returns the user for a valid token', async () => {
		const login = await req.post('/login').send({ username: 'alice' })
		const res = await req.get('/me').set('Authorization', `Bearer ${login.body.data.token}`)
		expect(res.status).toBe(200)
		expect(res.body.data.user.sub).toBe('alice')
	})

	it('GET /me without a token returns 401', async () => {
		const res = await req.get('/me')
		expect(res.status).toBe(401)
		expect(res.body).toMatchObject(errorBody('missing_token'))
	})
})

describe('security headers (express)', () => {
	it('sets helmet security headers on responses', async () => {
		const res = await supertest(createApp()).get('/items')
		expect(res.status).toBe(200)
		expect(res.headers['x-content-type-options']).toBe('nosniff')
	})
})

describe('webhooks API (express)', () => {
	const secret = 'whsec_test'
	const sign = (raw: string) => `sha256=${createHmac('sha256', secret).update(raw).digest('hex')}`

	it('POST /webhooks accepts a correctly signed payload', async () => {
		const raw = JSON.stringify({ event: 'ping' })
		const res = await supertest(createApp({ webhookSecret: secret }))
			.post('/webhooks')
			.set('content-type', 'application/json')
			.set('x-hub-signature-256', sign(raw))
			.send(raw)
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject(successBody({ received: true }))
	})

	it('POST /webhooks rejects a bad signature with 401', async () => {
		const raw = JSON.stringify({ event: 'ping' })
		const res = await supertest(createApp({ webhookSecret: secret }))
			.post('/webhooks')
			.set('content-type', 'application/json')
			.set('x-hub-signature-256', 'sha256=deadbeef')
			.send(raw)
		expect(res.status).toBe(401)
		expect(res.body).toMatchObject(errorBody('unauthorized'))
	})
})

describe('health API (express)', () => {
	let req: ReturnType<typeof supertest>

	beforeEach(() => {
		req = supertest(createApp())
	})

	it('GET /healthz reports healthy', async () => {
		const res = await req.get('/healthz')
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ status: 'healthy' })
	})

	it('GET /readyz reports ready', async () => {
		const res = await req.get('/readyz')
		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ status: 'healthy' })
	})
})

describe('upload API (express)', () => {
	// aws-sdk-client-mock wraps a real S3Client so lib-storage works, then
	// intercepts the PutObjectCommand multer-s3 sends — no MinIO needed.
	const s3Mock = mockClient(S3Client)
	const s3 = new S3Client({ region: 'us-east-1' })

	afterEach(() => s3Mock.reset())

	it('POST /upload stores the file and returns 201', async () => {
		s3Mock.on(PutObjectCommand).resolves({ ETag: '"etag123"' })
		const res = await supertest(createApp({ s3, bucket: 'test' }))
			.post('/upload')
			.attach('file', Buffer.from('hi'), 'hi.txt')
		expect(res.status).toBe(201)
		expect(res.body).toMatchObject(successBody({ bucket: 'test' }))
	})

	it('POST /upload returns 400 no_file when nothing is attached', async () => {
		const res = await supertest(createApp({ s3, bucket: 'test' })).post('/upload')
		expect(res.status).toBe(400)
		expect(res.body).toMatchObject(errorBody('no_file'))
	})
})
