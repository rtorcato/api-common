import amqp, { type Channel, type ConsumeMessage, type Options } from 'amqplib'

// Thin, typed helpers over amqplib: JSON encode/decode, exchange/queue assertion,
// and ack-on-success / nack-on-throw. Publisher/consumer take a Channel so they
// compose and test without a broker; `connect` is the convenience for the common case.
//
// ponytail: no auto-reconnect — amqplib doesn't reconnect on its own. For
// production resilience wrap `connect` in a retry loop or use
// `amqp-connection-manager`. Add here only if a consumer actually needs it.

/** An open connection + channel. Close the channel then the connection when done. */
export type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>

export interface AmqpChannel {
	connection: AmqpConnection
	channel: Channel
}

/** Open a connection and a channel to the broker (e.g. `amqp://localhost`). */
export async function connect(
	url: string,
	socketOptions?: Parameters<typeof amqp.connect>[1]
): Promise<AmqpChannel> {
	const connection = await amqp.connect(url, socketOptions)
	const channel = await connection.createChannel()
	return { connection, channel }
}

export interface PublisherOptions {
	exchange: string
	/** Exchange type. Default: `'topic'`. */
	exchangeType?: 'direct' | 'topic' | 'fanout' | 'headers'
	/** Survive a broker restart. Default: `true`. */
	durable?: boolean
}

/**
 * Assert the exchange and return a typed publish function that JSON-encodes messages.
 *
 * @example
 * ```ts
 * const publish = await createPublisher(channel, { exchange: 'orders' })
 * publish('order.created', { id: '1', total: 42 })
 * ```
 */
export async function createPublisher<T = unknown>(
	channel: Channel,
	options: PublisherOptions
): Promise<(routingKey: string, message: T, publishOptions?: Options.Publish) => boolean> {
	await channel.assertExchange(options.exchange, options.exchangeType ?? 'topic', {
		durable: options.durable ?? true,
	})
	return (routingKey, message, publishOptions) =>
		channel.publish(options.exchange, routingKey, Buffer.from(JSON.stringify(message)), {
			contentType: 'application/json',
			persistent: true,
			...publishOptions,
		})
}

export interface ConsumerOptions {
	queue: string
	/** Survive a broker restart. Default: `true`. */
	durable?: boolean
	/** Max unacknowledged messages in flight. Default: `10`. */
	prefetch?: number
	/** Requeue a message when the handler throws (risks a poison-message loop). Default: `false`. */
	requeueOnError?: boolean
}

/**
 * Assert the queue and consume JSON messages. The message is acked when the handler
 * resolves, and nacked when it throws (requeued only if `requeueOnError`).
 *
 * @example
 * ```ts
 * await createConsumer<OrderCreated>(channel, { queue: 'orders' }, async (order) => {
 *   await process(order)
 * })
 * ```
 */
export async function createConsumer<T = unknown>(
	channel: Channel,
	options: ConsumerOptions,
	handler: (message: T, raw: ConsumeMessage) => Promise<void> | void
): Promise<void> {
	await channel.assertQueue(options.queue, { durable: options.durable ?? true })
	await channel.prefetch(options.prefetch ?? 10)
	await channel.consume(options.queue, async (raw) => {
		if (!raw) return // consumer cancelled by the broker
		try {
			const message = JSON.parse(raw.content.toString()) as T
			await handler(message, raw)
			channel.ack(raw)
		} catch {
			channel.nack(raw, false, options.requeueOnError ?? false)
		}
	})
}
