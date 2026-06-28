import { describe, expect, it } from 'vitest'
import {
	BadRequestError,
	ConflictError,
	ForbiddenError,
	HttpError,
	InternalServerError,
	NotFoundError,
	ServiceUnavailableError,
	TooManyRequestsError,
	UnauthorizedError,
	UnprocessableEntityError,
} from './index'

describe('HttpError', () => {
	it('carries status, message, and code', () => {
		const err = new HttpError(418, "I'm a teapot", 'teapot')
		expect(err).toBeInstanceOf(Error)
		expect(err.status).toBe(418)
		expect(err.message).toBe("I'm a teapot")
		expect(err.code).toBe('teapot')
	})

	it('defaults code to "http_error"', () => {
		expect(new HttpError(500, 'boom').code).toBe('http_error')
	})
})

describe('subclasses', () => {
	const cases: Array<[new () => HttpError, number, string]> = [
		[BadRequestError, 400, 'bad_request'],
		[UnauthorizedError, 401, 'unauthorized'],
		[ForbiddenError, 403, 'forbidden'],
		[NotFoundError, 404, 'not_found'],
		[ConflictError, 409, 'conflict'],
		[UnprocessableEntityError, 422, 'unprocessable_entity'],
		[TooManyRequestsError, 429, 'too_many_requests'],
		[InternalServerError, 500, 'internal_server_error'],
		[ServiceUnavailableError, 503, 'service_unavailable'],
	]

	for (const [Ctor, status, code] of cases) {
		it(`${Ctor.name} → ${status} ${code}`, () => {
			const err = new Ctor()
			expect(err).toBeInstanceOf(HttpError)
			expect(err.status).toBe(status)
			expect(err.code).toBe(code)
		})
	}
})
