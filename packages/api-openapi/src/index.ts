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
