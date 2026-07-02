import { describe, expect, it } from 'vitest'
import { createHealthRegistry } from './index'

describe('createHealthRegistry', () => {
	it('reports healthy with no checks', async () => {
		const report = await createHealthRegistry().run()
		expect(report).toEqual({ status: 'healthy', checks: {} })
	})

	it('reports healthy when every check passes', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {})
		reg.register('cache', async () => {})
		const report = await reg.run()
		expect(report.status).toBe('healthy')
		expect(report.checks).toEqual({ db: { status: 'healthy' }, cache: { status: 'healthy' } })
	})

	it('reports unhealthy and surfaces the message when a check throws', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {
			throw new Error('connection refused')
		})
		reg.register('cache', () => {})
		const report = await reg.run()
		expect(report.status).toBe('unhealthy')
		expect(report.checks['db']).toEqual({ status: 'unhealthy', error: 'connection refused' })
		expect(report.checks['cache']?.status).toBe('healthy')
	})

	it('handles rejected promises and non-Error throws', async () => {
		const reg = createHealthRegistry()
		reg.register('broker', () => Promise.reject(new Error('amqp down')))
		reg.register('weird', () => {
			throw 'nope'
		})
		const report = await reg.run()
		expect(report.checks['broker']).toEqual({ status: 'unhealthy', error: 'amqp down' })
		expect(report.checks['weird']).toEqual({ status: 'unhealthy', error: 'nope' })
	})

	it('replaces a check when the same name is registered twice', async () => {
		const reg = createHealthRegistry()
		reg.register('db', () => {
			throw new Error('old')
		})
		reg.register('db', () => {})
		const report = await reg.run()
		expect(report.status).toBe('healthy')
	})
})
