import { describe, expect, it } from 'vitest'
import { sign, verifySignature } from './index'

const SECRET = 'shhh'
const BODY = JSON.stringify({ event: 'ping' })

describe('sign', () => {
	it('produces a stable hex HMAC', () => {
		expect(sign(BODY, SECRET)).toBe(sign(BODY, SECRET))
		expect(sign(BODY, SECRET)).toMatch(/^[0-9a-f]{64}$/)
	})

	it('applies a prefix', () => {
		expect(sign(BODY, SECRET, { prefix: 'sha256=' })).toBe(`sha256=${sign(BODY, SECRET)}`)
	})
})

describe('verifySignature', () => {
	it('accepts a matching signature', () => {
		expect(verifySignature(BODY, sign(BODY, SECRET), SECRET)).toBe(true)
	})

	it('accepts a matching prefixed signature', () => {
		const sig = sign(BODY, SECRET, { prefix: 'sha256=' })
		expect(verifySignature(BODY, sig, SECRET, { prefix: 'sha256=' })).toBe(true)
	})

	it('rejects a wrong secret', () => {
		expect(verifySignature(BODY, sign(BODY, SECRET), 'nope')).toBe(false)
	})

	it('rejects a tampered payload', () => {
		expect(verifySignature('{"event":"pong"}', sign(BODY, SECRET), SECRET)).toBe(false)
	})

	it('rejects a missing signature', () => {
		expect(verifySignature(BODY, undefined, SECRET)).toBe(false)
		expect(verifySignature(BODY, '', SECRET)).toBe(false)
	})

	it('rejects a length-mismatched signature without throwing', () => {
		expect(verifySignature(BODY, 'short', SECRET)).toBe(false)
	})
})
