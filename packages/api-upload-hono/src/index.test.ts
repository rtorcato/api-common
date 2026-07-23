import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { HttpError } from '@rtorcato/api-errors'
import { mockClient } from 'aws-sdk-client-mock'
import { Hono } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'
import { beforeEach, describe, expect, it } from 'vitest'
import { type UploadedFile, type UploadOptions, uploadFile } from './index'

const s3Mock = mockClient(S3Client)

/** Mount uploadFile behind a route, turning HttpErrors into `{ code }` + status. */
function makeApp(options: UploadOptions) {
	const app = new Hono()
	app.post('/upload', async (c) => {
		try {
			return c.json(await uploadFile(c, options))
		} catch (err) {
			if (err instanceof HttpError)
				return c.json({ code: err.code }, err.status as ContentfulStatusCode)
			throw err
		}
	})
	return app
}

function form(fields: Record<string, File>) {
	const fd = new FormData()
	for (const [name, file] of Object.entries(fields)) fd.append(name, file)
	return fd
}

/** Input of the last PutObjectCommand the mock received (throws if none). */
function lastPutInput() {
	const call = s3Mock.commandCalls(PutObjectCommand).at(-1)
	if (!call) throw new Error('expected a PutObjectCommand')
	return call.args[0].input
}

describe('uploadFile (hono)', () => {
	const s3 = new S3Client({ region: 'us-east-1' })

	beforeEach(() => {
		s3Mock.reset()
		s3Mock.on(PutObjectCommand).resolves({ ETag: '"abc123"' })
	})

	it('uploads a file to S3 and returns its details', async () => {
		const app = makeApp({
			s3,
			bucket: 'avatars',
			field: 'file',
			key: 'users/1.png',
			isPublic: true,
		})
		const res = await app.request('/upload', {
			method: 'POST',
			body: form({ file: new File(['hello world'], 'a.png', { type: 'image/png' }) }),
		})

		expect(res.status).toBe(200)
		expect(await res.json()).toMatchObject({
			fieldname: 'file',
			originalname: 'a.png',
			mimetype: 'image/png',
			size: 11,
			bucket: 'avatars',
			key: 'users/1.png',
			etag: 'abc123',
			location: 'https://avatars.s3.us-east-1.amazonaws.com/users/1.png',
		})

		const input = lastPutInput()
		expect(input.Bucket).toBe('avatars')
		expect(input.Key).toBe('users/1.png')
		expect(input.ACL).toBe('public-read')
		expect(input.ContentType).toBe('image/png')
		expect(input.CacheControl).toBe('max-age=31536000')
	})

	it('defaults to a private ACL', async () => {
		const app = makeApp({ s3, bucket: 'b', field: 'file', key: 'k' })
		await app.request('/upload', { method: 'POST', body: form({ file: new File(['x'], 'x.txt') }) })
		expect(lastPutInput().ACL).toBe('private')
	})

	it('rejects 400 no_file when the field is missing', async () => {
		const app = makeApp({ s3, bucket: 'b', field: 'file', key: 'k' })
		const res = await app.request('/upload', {
			method: 'POST',
			body: form({ other: new File(['x'], 'x.txt') }),
		})
		expect(res.status).toBe(400)
		expect(await res.json()).toEqual({ code: 'no_file' })
		expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(0)
	})

	it('rejects 413 when the file exceeds maxSizeBytes', async () => {
		const app = makeApp({ s3, bucket: 'b', field: 'file', key: 'k', maxSizeBytes: 4 })
		const res = await app.request('/upload', {
			method: 'POST',
			body: form({ file: new File(['too many bytes'], 'big.txt', { type: 'text/plain' }) }),
		})
		expect(res.status).toBe(413)
		expect(await res.json()).toEqual({ code: 'file_too_large' })
		expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(0)
	})

	it('derives the key from a function of context + file', async () => {
		const app = makeApp({ s3, bucket: 'b', field: 'file', key: (_c, f) => `up/${f.name}` })
		const res = await app.request('/upload', {
			method: 'POST',
			body: form({ file: new File(['x'], 'photo.jpg', { type: 'image/jpeg' }) }),
		})
		expect(res.status).toBe(200)
		expect(((await res.json()) as UploadedFile).key).toBe('up/photo.jpg')
		expect(lastPutInput().Key).toBe('up/photo.jpg')
	})
})
