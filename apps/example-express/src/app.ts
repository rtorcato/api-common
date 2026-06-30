import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { requestLogger } from './middleware/requestLogger.js'
import { createItemsRouter } from './routes/items.js'
import { spec } from './spec.js'

// ponytail: minimal Logger interface — avoids importing api-logger here
const silentLog = { info() {} }

export function createApp(log: { info(obj: object): void } = silentLog) {
	const app = express()
	app.use(express.json())
	app.use(requestLogger(log))
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
	app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000 }))
	app.use('/items', createItemsRouter())
	app.use(notFoundHandler)
	app.use(errorHandler())
	return app
}
