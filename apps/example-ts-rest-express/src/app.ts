import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-express'
import { mountTsRest } from '@rtorcato/api-ts-rest-express'
import express from 'express'
import { contract } from './contract.js'
import { requestLogger } from './middleware/requestLogger.js'
import { createRouter } from './router.js'

// ponytail: minimal Logger interface — avoids importing api-logger here
const silentLog = { info() {} }

export function createApp(log: { info(obj: object): void } = silentLog) {
	const app = express()
	app.use(express.json())
	app.use(requestLogger(log))

	// Liveness (no checks) + readiness (runs registered checks, 503 if any fail).
	const health = createHealthRegistry()
	health.register('self', () => {})
	app.get('/healthz', livenessHandler())
	app.get('/readyz', readinessHandler(health))

	// One call: mounts the contract routes AND serves the OpenAPI 3.1 doc
	// generated from the contract — Scalar UI at /docs, JSON at /openapi.json.
	mountTsRest(app, {
		contract,
		router: createRouter(),
		openapi: { info: { title: 'Example ts-rest API', version: '1.0.0' } },
	})

	app.use(notFoundHandler)
	app.use(errorHandler())
	return app
}
