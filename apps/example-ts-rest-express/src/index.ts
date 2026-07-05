import { loadEnv } from '@rtorcato/api-config'
import { logRoutes } from '@rtorcato/api-express-utils'
import { createShutdownController, closeHttpServer } from '@rtorcato/api-graceful-shutdown'
import { createLogger } from '@rtorcato/api-logger'
import { z } from 'zod'
import { createApp } from './app.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3003),
		LOG_LEVEL: z.string().default('info'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })
const app = createApp(log)

const server = app.listen(env.PORT, () => {
	log.info(`ts-rest example listening on :${env.PORT}`)
	log.info(`scalar docs → http://localhost:${env.PORT}/docs`)
	logRoutes(app)
})

// Drain in-flight requests on SIGTERM/SIGINT before exiting.
const shutdown = createShutdownController({ logger: (m) => log.info(m) })
shutdown.register('http', closeHttpServer(server))
