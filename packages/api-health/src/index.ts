export type HealthStatus = 'healthy' | 'unhealthy'

/**
 * A readiness check. Return (or resolve) normally to report healthy; throw or
 * reject to report unhealthy — the thrown message is surfaced in the report.
 */
export type HealthCheck = () => void | Promise<void>

export interface CheckResult {
	status: HealthStatus
	/** Present only when the check threw/rejected. */
	error?: string
}

export interface HealthReport {
	status: HealthStatus
	checks: Record<string, CheckResult>
}

export interface HealthRegistry {
	/** Register a readiness check by name. Re-registering a name replaces it. */
	register: (name: string, check: HealthCheck) => void
	/** Run every registered check concurrently and build a report. */
	run: () => Promise<HealthReport>
}

/**
 * Create a registry of readiness checks (DB pings, broker connections, …).
 *
 * Framework-agnostic — mount it via `@rtorcato/api-health-express` or
 * `@rtorcato/api-health-hono`, or call `run()` yourself. Liveness needs no
 * registry: it just reports the process is up, so the adapters expose a
 * ready-made liveness handler separately.
 */
export function createHealthRegistry(): HealthRegistry {
	const checks = new Map<string, HealthCheck>()

	return {
		register(name, check) {
			checks.set(name, check)
		},
		// ponytail: no per-check timeout — a hung check hangs readiness until the
		// caller's probe timeout (e.g. k8s readinessProbe.timeoutSeconds) fires.
		// Race each check() against a timeout here if you need it to fail fast.
		async run() {
			const results = await Promise.all(
				[...checks].map(async ([name, check]): Promise<[string, CheckResult]> => {
					try {
						await check()
						return [name, { status: 'healthy' }]
					} catch (err) {
						return [
							name,
							{ status: 'unhealthy', error: err instanceof Error ? err.message : String(err) },
						]
					}
				})
			)

			const report: HealthReport = { status: 'healthy', checks: {} }
			for (const [name, result] of results) {
				report.checks[name] = result
				if (result.status === 'unhealthy') report.status = 'unhealthy'
			}
			return report
		},
	}
}
