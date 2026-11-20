import type { Server } from 'node:http'

/** A cleanup hook. Return (or resolve) when the resource is closed; throw or reject to mark it failed. */
export type ShutdownHook = () => void | Promise<void>

export interface ShutdownOptions {
	/** Signals that trigger shutdown. Default: `['SIGTERM', 'SIGINT']`. */
	signals?: NodeJS.Signals[]
	/** Hard limit for all hooks combined; exceeding it force-exits with code 1. Default: `10_000`. */
	timeoutMs?: number
	/** Called with human-readable progress lines. Default: no-op. */
	logger?: (message: string) => void
	/** Exit function — injectable for tests. Default: `process.exit`. */
	exit?: (code: number) => void
}

export interface ShutdownController {
	/** Register a cleanup hook. Hooks run in registration order on shutdown. */
	register: (name: string, hook: ShutdownHook) => void
	/** Trigger shutdown manually (signals do this automatically). Idempotent. */
	shutdown: (signal?: string) => Promise<void>
	/** Remove the signal listeners this controller installed (mainly for tests). */
	stop: () => void
}

/**
 * Install SIGTERM/SIGINT handlers that drain the process gracefully: run every
 * registered cleanup hook in order, then exit. If the hooks take longer than
 * `timeoutMs`, force-exit with code 1 so a stuck resource can't wedge a
 * container restart.
 *
 * Framework-agnostic — pass `server.close`, an AMQP `connection.close`, a DB
 * pool `end`, etc. as hooks. Use `closeHttpServer(server)` for the common case.
 */
export function createShutdownController(options: ShutdownOptions = {}): ShutdownController {
	const signals = options.signals ?? ['SIGTERM', 'SIGINT']
	const timeoutMs = options.timeoutMs ?? 10_000
	const log = options.logger ?? (() => {})
	const exit = options.exit ?? ((code: number) => process.exit(code))

	const hooks = new Map<string, ShutdownHook>()
	let shuttingDown = false

	// Hooks run sequentially in registration order — draining is ordered by
	// design (stop the HTTP server before closing what it depends on). A failed
	// hook is logged and downgrades the exit code but does not stop the rest.
	async function runHooks(): Promise<number> {
		let code = 0
		for (const [name, hook] of hooks) {
			try {
				await hook()
				log(`Closed "${name}"`)
			} catch (err) {
				code = 1
				log(`Cleanup hook "${name}" failed: ${err instanceof Error ? err.message : String(err)}`)
			}
		}
		return code
	}

	async function shutdown(signal?: string): Promise<void> {
		if (shuttingDown) return
		shuttingDown = true
		log(`Received ${signal ?? 'shutdown'}, running ${hooks.size} cleanup hook(s)…`)

		let timer: ReturnType<typeof setTimeout> | undefined
		const timeout = new Promise<'timeout'>((resolve) => {
			timer = setTimeout(() => resolve('timeout'), timeoutMs)
			// ponytail: unref so the timeout timer itself never keeps the loop alive.
			timer.unref?.()
		})

		const result = await Promise.race([runHooks(), timeout])
		clearTimeout(timer)

		if (result === 'timeout') {
			log(`Shutdown timed out after ${timeoutMs}ms, forcing exit`)
			exit(1)
		} else {
			log('Cleanup complete')
			exit(result)
		}
	}

	const listeners = new Map<NodeJS.Signals, () => void>()
	for (const signal of signals) {
		const listener = () => {
			void shutdown(signal)
		}
		listeners.set(signal, listener)
		process.on(signal, listener)
	}

	return {
		register(name, hook) {
			hooks.set(name, hook)
		},
		shutdown,
		stop() {
			for (const [signal, listener] of listeners) process.removeListener(signal, listener)
			listeners.clear()
		},
	}
}

/**
 * A shutdown hook that closes a Node HTTP server — stops accepting new
 * connections and resolves once in-flight requests finish. Works for Express
 * (`app.listen(...)`) and Hono via `@hono/node-server` (`serve(...)`).
 */
export function closeHttpServer(server: Server): ShutdownHook {
	return () =>
		new Promise<void>((resolve, reject) => {
			server.close((err) => (err ? reject(err) : resolve()))
		})
}
