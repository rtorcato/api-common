export class HttpError extends Error {
	readonly status: number
	readonly code: string

	constructor(status: number, message: string, code: string = 'http_error') {
		super(message)
		this.name = 'HttpError'
		this.status = status
		this.code = code
	}
}

export class BadRequestError extends HttpError {
	constructor(message = 'Bad Request', code = 'bad_request') {
		super(400, message, code)
		this.name = 'BadRequestError'
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message = 'Unauthorized', code = 'unauthorized') {
		super(401, message, code)
		this.name = 'UnauthorizedError'
	}
}

export class ForbiddenError extends HttpError {
	constructor(message = 'Forbidden', code = 'forbidden') {
		super(403, message, code)
		this.name = 'ForbiddenError'
	}
}

export class NotFoundError extends HttpError {
	constructor(message = 'Not Found', code = 'not_found') {
		super(404, message, code)
		this.name = 'NotFoundError'
	}
}

export class ConflictError extends HttpError {
	constructor(message = 'Conflict', code = 'conflict') {
		super(409, message, code)
		this.name = 'ConflictError'
	}
}

export class UnprocessableEntityError extends HttpError {
	constructor(message = 'Unprocessable Entity', code = 'unprocessable_entity') {
		super(422, message, code)
		this.name = 'UnprocessableEntityError'
	}
}

export class TooManyRequestsError extends HttpError {
	constructor(message = 'Too Many Requests', code = 'too_many_requests') {
		super(429, message, code)
		this.name = 'TooManyRequestsError'
	}
}

export class InternalServerError extends HttpError {
	constructor(message = 'Internal Server Error', code = 'internal_server_error') {
		super(500, message, code)
		this.name = 'InternalServerError'
	}
}

export class ServiceUnavailableError extends HttpError {
	constructor(message = 'Service Unavailable', code = 'service_unavailable') {
		super(503, message, code)
		this.name = 'ServiceUnavailableError'
	}
}

/** The standard JSON error body sent by the framework error handlers. */
export interface ErrorResponse {
	error: string
	code: string
	message: string
	stack?: string
}

/**
 * Serialize any thrown value into the standard error envelope
 * `{ error, code, message, stack? }`. `HttpError` instances surface their
 * `code`; anything else becomes `internal_server_error`.
 *
 * The HTTP *status* is not part of the body — read it from `err.status` on an
 * `HttpError` separately.
 *
 * Single source of truth for the error body: the Express/Hono error handlers
 * and any middleware that responds with an error (e.g. rate limiting) build
 * their JSON from here, so the shape can't drift between them.
 */
export function toErrorResponse(
	err: unknown,
	options: { includeStack?: boolean } = {}
): ErrorResponse {
	const e = (typeof err === 'object' ? err : null) as {
		name?: string
		message?: string
		stack?: string
	} | null
	const body: ErrorResponse = {
		error: e?.name ?? 'InternalServerError',
		code: err instanceof HttpError ? err.code : 'internal_server_error',
		message: e?.message ?? 'An unexpected error occurred.',
	}
	if (options.includeStack && e?.stack) body.stack = e.stack
	return body
}
