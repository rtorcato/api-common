import { describe, expect, it } from 'vitest'
import { asText, mcpError } from './index.js'

describe('asText', () => {
	it('wraps a value as a JSON text content block', () => {
		expect(asText({ id: '1', name: 'a' })).toEqual({
			content: [{ type: 'text', text: '{"id":"1","name":"a"}' }],
		})
	})

	it('serializes arrays', () => {
		expect(asText([1, 2])).toEqual({ content: [{ type: 'text', text: '[1,2]' }] })
	})
})

describe('mcpError', () => {
	it('flags isError and carries the message', () => {
		expect(mcpError('Item 42 not found')).toEqual({
			isError: true,
			content: [{ type: 'text', text: 'Item 42 not found' }],
		})
	})
})
