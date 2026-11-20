import type { Express } from 'express'

export interface RouteInfo {
	method: string
	path: string
}

// ponytail: top-level routes + one level of mounted routers. We don't reverse
// the mount-point regexp (Express 4/5 internals differ and it's brittle), so
// nested router paths are relative to their mount. Add full-path resolution if
// a consumer actually needs it.
function collect(stack: unknown[], out: RouteInfo[]): void {
	for (const layer of stack as any[]) {
		if (layer?.route) {
			const path = layer.route.path
			const methods = layer.route.methods ?? {}
			for (const method of Object.keys(methods)) {
				if (methods[method]) out.push({ method: method.toUpperCase(), path })
			}
		} else if (layer?.name === 'router' && Array.isArray(layer.handle?.stack)) {
			collect(layer.handle.stack, out)
		}
	}
}

/**
 * Walk an Express app's router stack and return its registered routes.
 *
 * Also prints them (one `METHOD /path` per line) via `log` unless `log: false`.
 * Works on Express 4 (`app._router`) and Express 5 (`app.router`).
 */
export function logRoutes(
	app: Express,
	opts: { log?: boolean | ((line: string) => void) } = {}
): RouteInfo[] {
	const router = (app as any).router ?? (app as any)._router
	const routes: RouteInfo[] = []
	if (Array.isArray(router?.stack)) collect(router.stack, routes)

	const log = opts.log
	if (log !== false) {
		const write = typeof log === 'function' ? log : console.log
		for (const r of routes) write(`${r.method} ${r.path}`)
	}
	return routes
}
