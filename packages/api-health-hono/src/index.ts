import type { HealthRegistry } from '@rtorcato/api-health'
import type { Handler } from 'hono'

/**
 * Liveness probe handler — always `200 { status: 'healthy' }`. Mount at
 * `/healthz`. Answering at all proves the event loop is responsive; it runs
 * no dependency checks by design.
 */
export function livenessHandler(): Handler {
	return (c) => c.json({ status: 'healthy' }, 200)
}

/**
 * Readiness probe handler — runs the registry's checks and responds `200` when
 * all pass or `503` when any fail, with the full report as the body. Mount at
 * `/readyz`.
 */
export function readinessHandler(registry: HealthRegistry): Handler {
	return async (c) => {
		const report = await registry.run()
		return c.json(report, report.status === 'healthy' ? 200 : 503)
	}
}
