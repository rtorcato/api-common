import { describe, expect, it } from 'vitest'
import { spec } from './spec.js'

// Guards the schema-first derivation: the spec must come from the route Zod
// schemas, not be hand-authored. If someone re-hardcodes it or the builder
// regresses, these break.
describe('generated OpenAPI spec', () => {
	it('is OpenAPI 3.1.0', () => {
		expect(spec.openapi).toBe('3.1.0')
	})

	it('derives the :id path param from itemParams', () => {
		const params = (spec.paths['/items/{id}'] as any).get.parameters
		expect(params).toEqual([{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }])
	})

	it('derives the POST body from createItemBody (name required, min length)', () => {
		const body = (spec.paths['/items'] as any).post.requestBody.content['application/json'].schema
		expect(body.required).toContain('name')
		expect(body.properties.name).toMatchObject({ type: 'string', minLength: 1 })
	})

	it('wraps the item response in the success envelope from itemSchema', () => {
		const schema = (spec.paths['/items/{id}'] as any).get.responses['200'].content[
			'application/json'
		].schema
		expect(schema.properties.success).toBeDefined()
		expect(schema.properties.data.properties.id).toMatchObject({ type: 'string', format: 'uuid' })
	})
})
