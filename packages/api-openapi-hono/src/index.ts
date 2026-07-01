import type { OpenAPIHono } from '@hono/zod-openapi'
import { type ApiReferenceConfiguration, Scalar } from '@scalar/hono-api-reference'

/** The full document config accepted by {@link OpenAPIHono.doc31}, minus the function (context → config) form. */
type FullOpenAPIDocument = Exclude<
	Parameters<OpenAPIHono['doc31']>[1],
	(...args: never[]) => unknown
>

/**
 * OpenAPI document metadata: `info` (title + version) is required, plus optional `servers`,
 * `security`, `tags`, etc. `openapi` defaults to `3.1.0` — override it only to pin another version.
 */
export type OpenAPIDocument = Omit<FullOpenAPIDocument, 'openapi'> & { openapi?: string }

export interface ConfigureOpenAPIOptions {
	/** OpenAPI document metadata. `info` (title + version) is required; add `servers`, `security`, `tags`, … as needed. */
	document: OpenAPIDocument
	/** Path that serves the generated OpenAPI 3.1 JSON. Default: `/doc`. */
	docPath?: string
	/** Path that serves the Scalar API reference UI. Default: `/reference`. */
	referencePath?: string
	/** Scalar UI overrides merged over the defaults (`theme`, `layout`, `pageTitle`, …). */
	scalar?: Partial<ApiReferenceConfiguration>
}

const DEFAULT_DOC_PATH = '/doc'
const DEFAULT_REFERENCE_PATH = '/reference'

/**
 * Wire schema-first OpenAPI docs onto an {@link OpenAPIHono} app.
 *
 * Serves the generated OpenAPI 3.1 document at `docPath` and the Scalar reference UI at
 * `referencePath`. The spec derives from the app's `createRoute` Zod schemas, so the docs
 * can't drift from the validation.
 *
 * @example
 * ```ts
 * import { OpenAPIHono } from '@hono/zod-openapi'
 * import { configureOpenAPI } from '@rtorcato/api-openapi-hono'
 *
 * const app = new OpenAPIHono()
 * configureOpenAPI(app, { document: { info: { title: 'My API', version: '1.0.0' } } })
 * // → GET /doc (OpenAPI JSON), GET /reference (Scalar UI)
 * ```
 */
export function configureOpenAPI<A extends OpenAPIHono<any, any, any>>(
	app: A,
	options: ConfigureOpenAPIOptions
): A {
	const {
		document,
		docPath = DEFAULT_DOC_PATH,
		referencePath = DEFAULT_REFERENCE_PATH,
		scalar = {},
	} = options

	app.doc31(docPath, { ...document, openapi: document.openapi ?? '3.1.0' })

	app.get(
		referencePath,
		Scalar({
			pageTitle: document.info.title,
			theme: 'kepler',
			layout: 'modern',
			url: docPath,
			...scalar,
		})
	)

	return app
}
