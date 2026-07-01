import { describe, expect, it } from 'vitest'
import { docsHtml, generateScalarHtml, generateSwaggerHtml } from './index.js'

const spec = { openapi: '3.1.0', info: { title: 'Test', version: '1.0.0' }, paths: {} }

describe('generateScalarHtml', () => {
	it('embeds spec JSON in the page', () => {
		const html = generateScalarHtml(spec)
		expect(html).toContain('"openapi":"3.1.0"')
		expect(html).toContain('id="api-reference"')
	})

	it('uses default title', () => {
		expect(generateScalarHtml(spec)).toContain('<title>API Reference</title>')
	})

	it('uses provided title', () => {
		expect(generateScalarHtml(spec, { title: 'My API' })).toContain('<title>My API</title>')
	})

	it('applies theme attribute when provided', () => {
		expect(generateScalarHtml(spec, { theme: 'moon' })).toContain('data-theme="moon"')
	})

	it('omits theme attribute when not provided', () => {
		expect(generateScalarHtml(spec)).not.toContain('data-theme')
	})

	it('uses custom cdnUrl when provided', () => {
		const html = generateScalarHtml(spec, { cdnUrl: 'https://example.com/scalar.js' })
		expect(html).toContain('src="https://example.com/scalar.js"')
	})
})

describe('generateSwaggerHtml', () => {
	it('embeds spec JSON in the page', () => {
		const html = generateSwaggerHtml(spec)
		expect(html).toContain('"openapi":"3.1.0"')
		expect(html).toContain('SwaggerUIBundle')
	})

	it('uses default title', () => {
		expect(generateSwaggerHtml(spec)).toContain('<title>API Reference</title>')
	})

	it('uses provided title', () => {
		expect(generateSwaggerHtml(spec, { title: 'My API' })).toContain('<title>My API</title>')
	})
})

describe('docsHtml', () => {
	it('defaults to Scalar and loads the spec by URL, not inlined', () => {
		const html = docsHtml({ specUrl: '/openapi.json' })
		expect(html).toContain('data-url="/openapi.json"')
		expect(html).toContain('id="api-reference"')
		expect(html).not.toContain('"openapi"') // spec is fetched, not embedded
	})

	it('renders Swagger UI pointing at the spec URL when ui is swagger', () => {
		const html = docsHtml({ specUrl: '/openapi.json', ui: 'swagger' })
		expect(html).toContain('SwaggerUIBundle')
		expect(html).toContain('url: "/openapi.json"')
	})

	it('applies theme and title', () => {
		const html = docsHtml({ specUrl: '/s.json', theme: 'moon', title: 'My API' })
		expect(html).toContain('data-theme="moon"')
		expect(html).toContain('<title>My API</title>')
	})
})
