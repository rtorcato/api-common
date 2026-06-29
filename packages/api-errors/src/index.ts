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
