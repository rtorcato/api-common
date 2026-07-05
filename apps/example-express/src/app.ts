import type { S3Client } from '@aws-sdk/client-s3'
import { corsMiddleware } from '@rtorcato/api-cors-express'
import { asyncHandler, errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-express'
import { serveApiDocs, serveSwaggerDocs } from '@rtorcato/api-openapi-express'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'
import { ok } from '@rtorcato/api-response'
import { uploadFile } from '@rtorcato/api-upload'
import express from 'express'
import { requestLogger } from './middleware/requestLogger.js'
import { createAuthRouter } from './routes/auth.js'
import { createItemsRouter } from './routes/items.js'
import { spec } from './spec.js'

// ponytail: minimal Logger interface — avoids importing api-logger here
const silentLog = { info() {} }

export function createApp(
	options: {
		log?: { info(obj: object): void }
		jwtSecret?: string
		s3?: S3Client
		bucket?: string
	} = {}
) {
	const { log = silentLog, jwtSecret = 'dev-secret', s3, bucket } = options

	const health = createHealthRegistry()
	health.register('self', () => {})

	const app = express()
	app.use(corsMiddleware({ origin: ['http://localhost:3000'] }))
	app.use(express.json())
	app.use(requestLogger(log))

	// Probes before the rate limiter so orchestrators are never throttled.
	app.get('/healthz', livenessHandler())
	app.get('/readyz', readinessHandler(health))

	app.use('/api-docs', serveApiDocs(spec, { title: 'Example Express API' }))
	app.use('/swagger', serveSwaggerDocs(spec, { title: 'Example Express API' }))
	app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000 }))

	app.use('/', createAuthRouter(jwtSecret))
	app.use('/items', createItemsRouter())

	// Upload only wires up when an S3 client is provided, so the default (no-S3)
	// app stays runnable in tests without mocking AWS.
	if (s3) {
		app.post(
			'/upload',
			asyncHandler(async (req, res) => {
				const result = await uploadFile(req, res, {
					s3,
					bucket: bucket ?? 'uploads',
					field: 'file',
					key: (_req, file) => `uploads/${crypto.randomUUID()}-${file.originalname}`,
				})
				res.status(201).json(ok(result))
			})
		)
	}

	app.use(notFoundHandler)
	app.use(errorHandler())
	return app
}
