import type { HealthRegistry } from '@rtorcato/api-health'
import type { RequestHandler } from 'express'

/**
 * Liveness probe handler — always `200 { status: 'healthy' }`. Mount at
 * `/healthz`. Answering at all proves the event loop is responsive; it runs
 * no dependency checks by design.
 */
export function livenessHandler(): RequestHandler {
	return (_req, res) => {
		res.status(200).json({ status: 'healthy' })
	}
}

/**
 * Readiness probe handler — runs the registry's checks and responds `200` when
 * all pass or `503` when any fail, with the full report as the body. Mount at
 * `/readyz`.
 */
export function readinessHandler(registry: HealthRegistry): RequestHandler {
	return async (_req, res) => {
		const report = await registry.run()
		res.status(report.status === 'healthy' ? 200 : 503).json(report)
	}
}
