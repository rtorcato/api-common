export interface ScalarOptions {
	title?: string
	theme?:
		| 'default'
		| 'alternate'
		| 'moon'
		| 'purple'
		| 'solarized'
		| 'bluePlanet'
		| 'deepSpace'
		| 'saturn'
		| 'kepler'
		| 'mars'
		| 'none'
	cdnUrl?: string
}

export interface SwaggerOptions {
	title?: string
	cssCdnUrl?: string
	jsCdnUrl?: string
}

export function generateSwaggerHtml(spec: object, options: SwaggerOptions = {}): string {
	const {
		title = 'API Reference',
		cssCdnUrl = 'https://unpkg.com/swagger-ui-dist/swagger-ui.css',
		jsCdnUrl = 'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js',
	} = options

	return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${cssCdnUrl}" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${jsCdnUrl}"></script>
    <script>
      SwaggerUIBundle({ spec: ${JSON.stringify(spec)}, dom_id: '#swagger-ui' })
    </script>
  </body>
</html>`
}

export function generateScalarHtml(spec: object, options: ScalarOptions = {}): string {
	const {
		title = 'API Reference',
		theme,
		cdnUrl = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference',
	} = options

	const attrs = theme ? ` data-theme="${theme}"` : ''

	return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script id="api-reference" type="application/json"${attrs}>
${JSON.stringify(spec)}
    </script>
    <script src="${cdnUrl}"></script>
  </body>
</html>`
}

export interface DocsHtmlOptions {
	/** URL where the OpenAPI JSON spec is served (e.g. `/openapi.json`). */
	specUrl: string
	/** Which UI to render. Default: `'scalar'`. */
	ui?: 'scalar' | 'swagger'
	/** Page title. Default: `'API Reference'`. */
	title?: string
	/** Scalar theme (ignored for `ui: 'swagger'`). */
	theme?: ScalarOptions['theme']
	/** Scalar bundle CDN URL. */
	cdnUrl?: string
	/** Swagger UI stylesheet CDN URL. */
	cssCdnUrl?: string
	/** Swagger UI bundle CDN URL. */
	jsCdnUrl?: string
}

/**
 * Generate docs HTML that loads the spec from a URL (rather than inlining it).
 *
 * The counterpart to {@link generateScalarHtml} / {@link generateSwaggerHtml}: pair it with a
 * route that serves the spec JSON at `specUrl` so the page and the spec are fetched separately.
 *
 * @example
 * ```ts
 * app.get('/openapi.json', (_req, res) => res.json(doc))
 * app.get('/docs', (_req, res) => res.type('html').send(docsHtml({ specUrl: '/openapi.json' })))
 * ```
 */
export function docsHtml(options: DocsHtmlOptions): string {
	const { specUrl, ui = 'scalar', title = 'API Reference' } = options

	if (ui === 'swagger') {
		const cssCdnUrl = options.cssCdnUrl ?? 'https://unpkg.com/swagger-ui-dist/swagger-ui.css'
		const jsCdnUrl = options.jsCdnUrl ?? 'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js'
		return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${cssCdnUrl}" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${jsCdnUrl}"></script>
    <script>
      SwaggerUIBundle({ url: ${JSON.stringify(specUrl)}, dom_id: '#swagger-ui' })
    </script>
  </body>
</html>`
	}

	const cdnUrl = options.cdnUrl ?? 'https://cdn.jsdelivr.net/npm/@scalar/api-reference'
	const themeAttr = options.theme ? ` data-theme="${options.theme}"` : ''
	return `<!doctype html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script id="api-reference" data-url="${specUrl}"${themeAttr}></script>
    <script src="${cdnUrl}"></script>
  </body>
</html>`
}

// Explicit re-exports (not `export *`) so the public surface is enumerated and
// can't silently widen/narrow when builder.ts changes.
export {
	buildOpenApiDocument,
	type HttpMethod,
	type OpenApiDocument,
	type OpenApiDocumentConfig,
	type OpenApiInfo,
	type RouteConfig,
	type RouteRequest,
	type RouteResponse,
	type ServerObject,
	type TagObject,
} from './builder'
