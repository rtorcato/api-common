import type { Server } from 'node:http'
import { serve } from '@hono/node-server'
import { loadEnv } from '@rtorcato/api-config'
import { closeHttpServer, createShutdownController } from '@rtorcato/api-graceful-shutdown'
import { createLogger } from '@rtorcato/api-logger'
import { z } from 'zod'
import { createApp } from './app.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3002),
		LOG_LEVEL: z.string().default('info'),
		JWT_SECRET: z.string().default('dev-secret'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })
const app = createApp({ jwtSecret: env.JWT_SECRET })

const server = serve({ fetch: app.fetch, port: env.PORT }, () => {
	log.info(`hono example listening on :${env.PORT}`)
	log.info(`scalar docs → http://localhost:${env.PORT}/reference`)
})

// Drain in-flight requests on SIGTERM/SIGINT before exiting.
// serve() returns the node HTTP server (typed as a union incl. http2).
const shutdown = createShutdownController({ logger: (m) => log.info(m) })
shutdown.register('http', closeHttpServer(server as Server))
