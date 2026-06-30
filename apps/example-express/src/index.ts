import { loadEnv } from '@rtorcato/api-config'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'
import { logRoutes } from '@rtorcato/api-express-utils'
import { createLogger } from '@rtorcato/api-logger'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { z } from 'zod'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'
import { itemsRouter } from './routes/items.js'
import { requestLogger } from './middleware/requestLogger.js'
import { spec } from './spec.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3001),
		LOG_LEVEL: z.string().default('info'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })

const app = express()
app.use(express.json())
app.use(requestLogger(log))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec))
app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000 }))

app.use('/items', itemsRouter)

app.use(notFoundHandler)
app.use(errorHandler())

app.listen(env.PORT, () => {
	log.info(`express example listening on :${env.PORT}`)
	log.info(`swagger UI → http://localhost:${env.PORT}/api-docs`)
	logRoutes(app)
})
