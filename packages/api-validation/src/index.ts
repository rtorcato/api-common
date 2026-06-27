import { BadRequestError } from '@rtorcato/api-errors'
import { type ErrorMessageOptions, generateErrorMessage } from 'zod-error'
import type { z } from 'zod'

const defaultErrorOptions: ErrorMessageOptions = {
	transform: ({ errorMessage, index }) => `Error #${index + 1}: ${errorMessage}`,
}

/** Format a ZodError into a single human-readable string. */
export function formatZodError(
	error: z.ZodError,
	options: ErrorMessageOptions = defaultErrorOptions
): string {
	return generateErrorMessage(error.issues, options)
}

/**
 * Parse `data` with `schema`, returning the typed result.
 *
 * Throws a `BadRequestError` (from `@rtorcato/api-errors`) carrying a formatted
 * message when validation fails, so it slots straight into the error-handler
 * middleware in `api-errors-express` / `api-errors-hono`.
 */
export function validate<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
	const result = schema.safeParse(data)
	if (!result.success) {
		throw new BadRequestError(formatZodError(result.error), 'validation_error')
	}
	return result.data
}
