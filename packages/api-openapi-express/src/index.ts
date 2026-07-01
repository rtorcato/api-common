import {
	type DocsHtmlOptions,
	docsHtml,
	generateScalarHtml,
	generateSwaggerHtml,
	type ScalarOptions,
	type SwaggerOptions,
} from '@rtorcato/api-openapi'
import { type Request, type Response, Router } from 'express'

function withSpecRoute(router: Router, spec: object): Router {
	router.get('/openapi.json', (_req, res) => {
		res.json(spec)
	})
	return router
}

export function serveApiDocs(spec: object, options?: ScalarOptions): Router {
	const router = Router()
	const html = generateScalarHtml(spec, options)
	withSpecRoute(router, spec)
	router.get('/', (_req, res) => {
		res.type('html').send(html)
	})
	return router
}

export function serveSwaggerDocs(spec: object, options?: SwaggerOptions): Router {
	const router = Router()
	const html = generateSwaggerHtml(spec, options)
	withSpecRoute(router, spec)
	router.get('/', (_req, res) => {
		res.type('html').send(html)
	})
	return router
}

/** Anything with an Express-style `.get(path, handler)` — an `express()` app or a `Router`. */
interface MountTarget {
	get(path: string, handler: (req: Request, res: Response) => void): unknown
}

export interface MountOpenAPIOptions {
	/** The OpenAPI spec object to serve. Build it with `@rtorcato/api-openapi`'s `buildOpenApiDocument`, or ingest legacy JSDoc via {@link specFromJsDoc}. */
	doc: object
	/** Which UI to render. Default: `'scalar'`. */
	ui?: 'scalar' | 'swagger'
	/** Path that serves the raw OpenAPI JSON. Default: `/openapi.json`. */
	specPath?: string
	/** Path that serves the docs UI HTML. Default: `/docs`. */
	docsPath?: string
	/** Page title. */
	title?: string
	/** Scalar theme (ignored for `ui: 'swagger'`). */
	theme?: DocsHtmlOptions['theme']
	/** Scalar bundle CDN URL. */
	cdnUrl?: string
	/** Swagger UI stylesheet CDN URL. */
	cssCdnUrl?: string
	/** Swagger UI bundle CDN URL. */
	jsCdnUrl?: string
}

/**
 * Mount OpenAPI docs directly onto an Express app or router: serves the raw spec JSON at
 * `specPath` and the docs UI (which fetches that JSON) at `docsPath`.
 *
 * Unlike {@link serveApiDocs} / {@link serveSwaggerDocs} (which return a self-contained `Router`
 * with a relative `/openapi.json`), this wires both routes onto a target you already have and
 * points the UI at an absolute `specPath`.
 *
 * @example
 * ```ts
 * import { mountOpenAPI } from '@rtorcato/api-openapi-express'
 * mountOpenAPI(app, { doc, title: 'My API' })
 * // → GET /openapi.json (spec) and GET /docs (Scalar UI)
 * ```
 */
export function mountOpenAPI(app: MountTarget, options: MountOpenAPIOptions): void {
	const { doc, ui = 'scalar', specPath = '/openapi.json', docsPath = '/docs' } = options
	const html = docsHtml({
		specUrl: specPath,
		ui,
		title: options.title,
		theme: options.theme,
		cdnUrl: options.cdnUrl,
		cssCdnUrl: options.cssCdnUrl,
		jsCdnUrl: options.jsCdnUrl,
	})
	app.get(specPath, (_req, res) => {
		res.json(doc)
	})
	app.get(docsPath, (_req, res) => {
		res.type('html').send(html)
	})
}

export interface SwaggerJsDocOptions {
	/** The base OpenAPI document (`openapi`, `info`, `servers`, `components`, …). */
	definition: Record<string, unknown>
	/** Globs/paths to files with JSDoc `@openapi` / `@swagger` annotations to ingest. */
	apis: string[]
}

/**
 * Build an OpenAPI spec from JSDoc-annotated source files via `swagger-jsdoc`, for older projects
 * that document routes with `@openapi` comments rather than Zod schemas.
 *
 * `swagger-jsdoc` is an **optional** peer dependency — install it only if you use this helper.
 *
 * @example
 * ```ts
 * const doc = await specFromJsDoc({
 *   definition: { openapi: '3.1.0', info: { title: 'My API', version: '1.0.0' } },
 *   apis: ['./src/routes/*.ts'],
 * })
 * mountOpenAPI(app, { doc })
 * ```
 */
export async function specFromJsDoc(options: SwaggerJsDocOptions): Promise<object> {
	let swaggerJsdoc: (opts: SwaggerJsDocOptions) => object
	try {
		const mod = (await import('swagger-jsdoc')) as unknown as {
			default: (opts: SwaggerJsDocOptions) => object
		}
		swaggerJsdoc = mod.default ?? (mod as unknown as typeof swaggerJsdoc)
	} catch {
		throw new Error(
			'specFromJsDoc requires the optional peer dependency "swagger-jsdoc". Install it with `pnpm add swagger-jsdoc`.'
		)
	}
	return swaggerJsdoc(options)
}
