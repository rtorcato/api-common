import { loadEnv } from '@rtorcato/api-config'
import { logRoutes } from '@rtorcato/api-express-utils'
import { createLogger } from '@rtorcato/api-logger'
import { z } from 'zod'
import { createApp } from './app.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3001),
		LOG_LEVEL: z.string().default('info'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })
const app = createApp(log)

app.listen(env.PORT, () => {
	log.info(`express example listening on :${env.PORT}`)
	log.info(`swagger UI → http://localhost:${env.PORT}/api-docs`)
	logRoutes(app)
})
