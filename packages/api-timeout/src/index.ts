import { ServiceUnavailableError } from '@rtorcato/api-errors'

export interface TimeoutOptions {
	/** Deadline in milliseconds before the operation is considered timed out. */
	ms: number
}

/**
 * Race `promise` against a deadline. If `ms` elapses before it settles, reject
 * with a `ServiceUnavailableError` (503); otherwise pass through the promise's
 * own resolution or rejection. The timer is always cleared, so a promise that
 * settles first never leaves a dangling handle.
 *
 * Framework-agnostic — wrap it for Express/Hono in a dedicated adapter package.
 *
 * ponytail: on timeout the losing promise keeps running in the background
 * (there is no cancellation in JS). Its result is discarded; make the wrapped
 * work idempotent/abortable yourself if that matters.
 *
 * @example
 * const data = await withTimeout(fetchUser(id), 2000)
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
	let timer: ReturnType<typeof setTimeout>
	const deadline = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new ServiceUnavailableError('Request timed out')), ms)
	})
	// Swallow a late rejection from the losing promise so it can't surface as an
	// unhandledRejection after the deadline has already won the race.
	promise.catch(() => {})
	return Promise.race([promise, deadline]).finally(() => clearTimeout(timer))
}
