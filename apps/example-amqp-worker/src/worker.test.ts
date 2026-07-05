import type { Channel, ConsumeMessage } from 'amqplib'
import { describe, expect, it, vi } from 'vitest'
import { type DemoMessage, createWorker } from './worker'

// A minimal fake Channel — just the methods createWorker + the amqp helpers
// touch. `consume` captures the handler so a test can drive it with a fake
// message.
function fakeChannel() {
	let onMessage: ((msg: ConsumeMessage | null) => void) | undefined
	const ch = {
		assertExchange: vi.fn().mockResolvedValue(undefined),
		assertQueue: vi.fn().mockResolvedValue(undefined),
		bindQueue: vi.fn().mockResolvedValue(undefined),
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

describe('createWorker', () => {
	it('asserts the exchange, queue, and binding', async () => {
		const { ch } = fakeChannel()
		await createWorker(asChannel(ch), { info: vi.fn() })

		expect(ch.assertExchange).toHaveBeenCalledWith('demo', 'topic', { durable: true })
		expect(ch.assertQueue).toHaveBeenCalledWith('demo.work', { durable: true })
		expect(ch.bindQueue).toHaveBeenCalledWith('demo.work', 'demo', 'demo.#')
	})

	it('publishes a JSON message via the returned publish fn', async () => {
		const { ch } = fakeChannel()
		const { publish } = await createWorker(asChannel(ch), { info: vi.fn() })

		publish('demo.created', { id: '1', text: 'hi' })
		const [exchange, key, content] = ch.publish.mock.calls[0] ?? []
		expect(exchange).toBe('demo')
		expect(key).toBe('demo.created')
		expect(JSON.parse((content as Buffer).toString())).toEqual({ id: '1', text: 'hi' })
	})

	it('logs and acks a delivered message', async () => {
		const { ch, deliver } = fakeChannel()
		const info = vi.fn()
		await createWorker(asChannel(ch), { info })

		const msg: DemoMessage = { id: '7', text: 'work' }
		await deliver(msg)

		expect(info).toHaveBeenCalledWith({ received: msg })
		expect(ch.ack).toHaveBeenCalledTimes(1)
		expect(ch.nack).not.toHaveBeenCalled()
	})
})
