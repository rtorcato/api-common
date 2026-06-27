import path from 'node:path'
import { config as loadDotenv } from 'dotenv'
import { expand } from 'dotenv-expand'
import type { z } from 'zod'

export interface LoadEnvOptions {
	/**
	 * Path to the .env file to load. Defaults to `.env` in the current working
	 * directory (`.env.test` when `NODE_ENV === 'test'`).
	 */
	path?: string
	/** Skip reading a .env file and validate `process.env` as-is. */
	skipDotenv?: boolean
}

/**
 * Load environment variables from a .env file and validate them against `schema`.
 *
 * Throws an `Error` with the formatted field errors on validation failure — it
 * deliberately does NOT call `process.exit`, so the host application decides how
 * to react.
 *
 * @returns the parsed, typed environment.
 */
export function loadEnv<T extends z.ZodType>(schema: T, options: LoadEnvOptions = {}): z.infer<T> {
	if (!options.skipDotenv) {
		const envPath =
			options.path ??
			path.resolve(process.cwd(), process.env['NODE_ENV'] === 'test' ? '.env.test' : '.env')
		expand(loadDotenv({ path: envPath }))
	}

	const result = schema.safeParse(process.env)
	if (!result.success) {
		const fieldErrors = JSON.stringify(result.error.flatten().fieldErrors, null, 2)
		throw new Error(`Invalid environment variables:\n${fieldErrors}`)
	}
	return result.data
}
