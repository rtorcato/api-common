import { serve } from '@hono/node-server'
import { loadEnv } from '@rtorcato/api-config'
import { createLogger } from '@rtorcato/api-logger'
import { z } from 'zod'
import { createApp } from './app.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3002),
		LOG_LEVEL: z.string().default('info'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })
const app = createApp()

serve({ fetch: app.fetch, port: env.PORT }, () => {
	log.info(`hono example listening on :${env.PORT}`)
	log.info(`swagger UI → http://localhost:${env.PORT}/api-docs`)
})
