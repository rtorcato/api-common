import type { Channel, ConsumeMessage } from 'amqplib'
import { describe, expect, it, vi } from 'vitest'
import { createConsumer, createPublisher } from './index'

// A minimal fake Channel — just the methods the helpers touch. `consume` captures
// the handler so tests can drive it with a fake message.
function fakeChannel() {
	let onMessage: ((msg: ConsumeMessage | null) => void) | undefined
	const ch = {
		assertExchange: vi.fn().mockResolvedValue(undefined),
		assertQueue: vi.fn().mockResolvedValue(undefined),
		prefetch: vi.fn().mockResolvedValue(undefined),
		publish: vi.fn().mockReturnValue(true),
		consume: vi.fn().mockImplementation((_queue: string, cb: typeof onMessage) => {
			onMessage = cb
			return Promise.resolve({ consumerTag: 't' })
		}),
		ack: vi.fn(),
		nack: vi.fn(),
	}
	const deliver = (body: unknown) =>
		onMessage?.({ content: Buffer.from(JSON.stringify(body)) } as ConsumeMessage)
	return { ch, deliver }
}

const asChannel = (ch: ReturnType<typeof fakeChannel>['ch']) => ch as unknown as Channel

describe('createPublisher', () => {
	it('asserts the exchange and publishes a JSON, persistent message', async () => {
		const { ch } = fakeChannel()
		const publish = await createPublisher(asChannel(ch), { exchange: 'orders' })

		expect(ch.assertExchange).toHaveBeenCalledWith('orders', 'topic', { durable: true })

		publish('order.created', { id: '1' })
		const [exchange, key, content, opts] = ch.publish.mock.calls[0] ?? []
		expect(exchange).toBe('orders')
		expect(key).toBe('order.created')
		expect(JSON.parse((content as Buffer).toString())).toEqual({ id: '1' })
		expect(opts).toMatchObject({ contentType: 'application/json', persistent: true })
	})
})

describe('createConsumer', () => {
	it('asserts the queue, sets prefetch, and acks on success', async () => {
		const { ch, deliver } = fakeChannel()
		const handler = vi.fn().mockResolvedValue(undefined)

		await createConsumer(asChannel(ch), { queue: 'orders', prefetch: 5 }, handler)
		expect(ch.assertQueue).toHaveBeenCalledWith('orders', { durable: true })
		expect(ch.prefetch).toHaveBeenCalledWith(5)

		await deliver({ id: '1' })
		expect(handler).toHaveBeenCalledWith({ id: '1' }, expect.anything())
		expect(ch.ack).toHaveBeenCalledTimes(1)
		expect(ch.nack).not.toHaveBeenCalled()
	})

	it('nacks without requeue when the handler throws', async () => {
		const { ch, deliver } = fakeChannel()
		const handler = vi.fn().mockRejectedValue(new Error('boom'))

		await createConsumer(asChannel(ch), { queue: 'orders' }, handler)
		await deliver({ id: '2' })

		expect(ch.ack).not.toHaveBeenCalled()
		expect(ch.nack).toHaveBeenCalledWith(expect.anything(), false, false)
	})

	it('requeues on error when requeueOnError is set', async () => {
		const { ch, deliver } = fakeChannel()
		await createConsumer(
			asChannel(ch),
			{ queue: 'orders', requeueOnError: true },
			vi.fn().mockRejectedValue(new Error('boom'))
		)
		await deliver({ id: '3' })
		expect(ch.nack).toHaveBeenCalledWith(expect.anything(), false, true)
	})
})
