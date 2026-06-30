import { describe, expect, it } from 'vitest'
import { generateScalarHtml, generateSwaggerHtml } from './index.js'

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
