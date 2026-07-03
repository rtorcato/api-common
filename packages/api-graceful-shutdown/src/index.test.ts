import { createServer } from 'node:http'
import { afterEach, describe, expect, it } from 'vitest'
import { closeHttpServer, createShutdownController, type ShutdownController } from './index'

// Track controllers so each test's signal listeners are removed afterward.
let active: ShutdownController | undefined
afterEach(() => {
	active?.stop()
	active = undefined
})

function build(options = {}) {
	const codes: number[] = []
	const logs: string[] = []
	const handler = createShutdownController({
		exit: (code) => codes.push(code),
		logger: (msg) => logs.push(msg),
		...options,
	})
	active = handler
	return { handler, codes, logs }
}

describe('createShutdownController', () => {
	it('runs hooks in registration order and exits 0', async () => {
		const order: string[] = []
		const { handler, codes } = build()
		handler.register('a', () => {
			order.push('a')
		})
		handler.register('b', async () => {
			order.push('b')
		})

		await handler.shutdown('SIGTERM')

		expect(order).toEqual(['a', 'b'])
		expect(codes).toEqual([0])
	})

	it('exits 1 when a hook throws but still runs the rest', async () => {
		const order: string[] = []
		const { handler, codes } = build()
		handler.register('a', () => {
			order.push('a')
			throw new Error('boom')
		})
		handler.register('b', () => {
			order.push('b')
		})

		await handler.shutdown()

		expect(order).toEqual(['a', 'b'])
		expect(codes).toEqual([1])
	})

	it('force-exits 1 when hooks exceed the timeout', async () => {
		const { handler, codes, logs } = build({ timeoutMs: 20 })
		handler.register('hang', () => new Promise<void>(() => {}))

		await handler.shutdown('SIGTERM')

		expect(codes).toEqual([1])
		expect(logs.some((l) => l.includes('timed out'))).toBe(true)
	})

	it('is idempotent — a second shutdown is a no-op', async () => {
		const { handler, codes } = build()
		let calls = 0
		handler.register('a', () => {
			calls++
		})

		await handler.shutdown()
		await handler.shutdown()

		expect(calls).toBe(1)
		expect(codes).toEqual([0])
	})

	it('stop() removes the signal listeners it installed', () => {
		const before = process.listenerCount('SIGTERM')
		const { handler } = build()
		expect(process.listenerCount('SIGTERM')).toBe(before + 1)
		handler.stop()
		expect(process.listenerCount('SIGTERM')).toBe(before)
		active = undefined
	})
})

describe('closeHttpServer', () => {
	it('closes a listening server', async () => {
		const server = createServer()
		await new Promise<void>((resolve) => server.listen(0, resolve))
		expect(server.listening).toBe(true)

		await closeHttpServer(server)()

		expect(server.listening).toBe(false)
	})

	it('rejects when the server is not running', async () => {
		const server = createServer()
		await expect(closeHttpServer(server)()).rejects.toThrow()
	})
})
