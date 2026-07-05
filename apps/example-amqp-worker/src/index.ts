import { connect } from '@rtorcato/api-amqp'
import { loadEnv } from '@rtorcato/api-config'
import { createShutdownController } from '@rtorcato/api-graceful-shutdown'
import { createLogger } from '@rtorcato/api-logger'
import { z } from 'zod'
import { createWorker } from './worker.js'

const env = loadEnv(
	z.object({
		AMQP_URL: z.string().default('amqp://localhost'),
		LOG_LEVEL: z.string().default('info'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })

const { connection, channel } = await connect(env.AMQP_URL)
const { publish } = await createWorker(channel, log)

log.info(`amqp worker connected to ${env.AMQP_URL}`)

// Emit a demo message every few seconds so the consumer has something to log.
let counter = 0
const interval = setInterval(() => {
	counter += 1
	publish('demo.created', { id: String(counter), text: `demo message ${counter}` })
}, 3000)

const shutdown = createShutdownController({ logger: (m) => log.info(m) })
shutdown.register('amqp', async () => {
	clearInterval(interval)
	await channel.close()
	await connection.close()
})
