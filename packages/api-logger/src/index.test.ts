import type { DestinationStream } from 'pino'
import { describe, expect, it } from 'vitest'
import { createLogger } from './index'

function sink(): { lines: string[]; stream: DestinationStream } {
	const lines: string[] = []
	return {
		lines,
		stream: {
			write(chunk: string) {
				lines.push(chunk)
			},
		},
	}
}

describe('createLogger', () => {
	it('respects the configured level', () => {
		const { lines, stream } = sink()
		const log = createLogger({ level: 'warn' }, stream)

		log.info('skipped')
		log.warn('kept')

		expect(lines).toHaveLength(1)
		expect(lines[0]).toContain('kept')
	})

	it('defaults the level to info', () => {
		const log = createLogger({ pretty: false })
		expect(log.level).toBe('info')
	})
})
