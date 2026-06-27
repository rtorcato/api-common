import pino, { type DestinationStream, type Logger, type LoggerOptions } from 'pino'

export interface CreateLoggerOptions extends LoggerOptions {
	/**
	 * Pretty-print human-readable logs via pino-pretty.
	 * Defaults to true when NODE_ENV !== 'production'.
	 * Requires pino-pretty to be installed (optional peer dependency).
	 */
	pretty?: boolean
}

/**
 * Create a configured pino logger.
 *
 * Framework-agnostic — wrap it for Hono/Express in a dedicated adapter package.
 * Level defaults to `LOG_LEVEL` env var, then `info`.
 *
 * @param options pino options plus a `pretty` toggle.
 * @param destination optional pino destination stream; when supplied it wins
 *   over the pretty transport (useful for tests and custom sinks).
 */
export function createLogger(
	options: CreateLoggerOptions = {},
	destination?: DestinationStream
): Logger {
	const {
		pretty = process.env['NODE_ENV'] !== 'production',
		level = process.env['LOG_LEVEL'] ?? 'info',
		...rest
	} = options

	const pinoOptions: LoggerOptions = { level, ...rest }

	if (destination) return pino(pinoOptions, destination)
	if (pretty) return pino({ ...pinoOptions, transport: { target: 'pino-pretty' } })
	return pino(pinoOptions)
}
