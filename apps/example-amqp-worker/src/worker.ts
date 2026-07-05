import { createConsumer, createPublisher } from '@rtorcato/api-amqp'
import type { Channel } from 'amqplib'

const EXCHANGE = 'demo'
const QUEUE = 'demo.work'
const PATTERN = 'demo.#'

export interface DemoMessage {
	id: string
	text: string
}

/**
 * Wire a publisher and a consumer over the `demo` topic exchange. The consumer
 * logs every decoded message; the returned `publish` lets the caller emit new
 * ones. `createConsumer` asserts the queue but never binds it, so we bind
 * `demo.work` to `demo` (pattern `demo.#`) ourselves — otherwise published
 * messages would never reach the queue.
 */
export async function createWorker(channel: Channel, log: { info(o: object): void }) {
	const publish = await createPublisher<DemoMessage>(channel, { exchange: EXCHANGE })

	await channel.assertQueue(QUEUE, { durable: true })
	await channel.bindQueue(QUEUE, EXCHANGE, PATTERN)

	await createConsumer<DemoMessage>(channel, { queue: QUEUE }, (message) => {
		log.info({ received: message })
	})

	return { publish }
}
