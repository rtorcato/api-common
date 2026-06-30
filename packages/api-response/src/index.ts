import { z } from 'zod'

/** Standard success envelope returned by API handlers. */
export interface SuccessResponse<T> {
	success: true
	data: T
	message?: string
}

/**
 * Build a `SuccessResponse` envelope.
 *
 * Pairs with the error shape thrown by `@rtorcato/api-errors`: success bodies
 * carry `success: true` + `data`, error bodies carry `status`/`code`/`message`.
 */
export function ok<T>(data: T, message?: string): SuccessResponse<T> {
	return message === undefined ? { success: true, data } : { success: true, data, message }
}

/**
 * Build a zod schema for a success envelope wrapping `dataSchema` — for
 * documenting or validating responses (e.g. in OpenAPI contracts).
 */
export function successSchema<T extends z.ZodTypeAny>(dataSchema: T) {
	return z.object({
		success: z.literal(true),
		data: dataSchema,
		message: z.string().optional(),
	})
}

/** Error envelope produced by `api-errors-express` / `api-errors-hono` error handlers. */
export interface ErrorResponse {
	error: string
	code: string
	message: string
	stack?: string
}

/** Zod schema for the error envelope — for OpenAPI contracts and response validation. */
export function errorSchema() {
	return z.object({
		error: z.string(),
		code: z.string(),
		message: z.string(),
		stack: z.string().optional(),
	})
}
