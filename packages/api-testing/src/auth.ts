import { signToken, type SignOptions } from '@rtorcato/api-auth'

export const TEST_JWT_SECRET = 'test-jwt-secret'

export function testToken(payload: object = { userId: 1 }, options?: SignOptions): string {
	return signToken(payload, TEST_JWT_SECRET, options)
}

export function bearerHeader(token: string): { Authorization: string } {
	return { Authorization: `Bearer ${token}` }
}
