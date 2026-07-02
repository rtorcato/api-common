import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { mockClient } from 'aws-sdk-client-mock'
import express from 'express'
import request from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'
import { uploader, type UploadOptions } from './index'

// aws-sdk-client-mock wraps a real S3Client (so lib-storage's endpointProvider
// exists) and intercepts the commands multer-s3 sends.
const s3Mock = mockClient(S3Client)
const s3 = new S3Client({ region: 'us-east-1' })

afterEach(() => s3Mock.reset())

function buildApp(options: Omit<UploadOptions, 's3'>) {
	const app = express()
	app.post('/upload', async (req, res) => {
		try {
			const file = await uploader(req, res, { ...options, s3 })
			res.json({ key: file.key, bucket: file.bucket })
		} catch (err) {
			const e = err as { status?: number; code?: string }
			res.status(e.status ?? 500).json({ code: e.code })
		}
	})
	return app
}

describe('uploader', () => {
	it('rejects with 400 no_file when the field is empty', async () => {
		s3Mock.on(PutObjectCommand).resolves({ ETag: '"e"' })
		const res = await request(buildApp({ bucket: 'b', field: 'file', key: 'k' })).post('/upload')
		expect(res.status).toBe(400)
		expect(res.body.code).toBe('no_file')
		expect(s3Mock.calls()).toHaveLength(0)
	})

	it('rejects with 413 file_too_large when Content-Length exceeds maxSizeBytes', async () => {
		s3Mock.on(PutObjectCommand).resolves({ ETag: '"e"' })
		const res = await request(buildApp({ bucket: 'b', field: 'file', key: 'k', maxSizeBytes: 8 }))
			.post('/upload')
			.attach('file', Buffer.alloc(64, 1), 'big.bin')
		expect(res.status).toBe(413)
		expect(res.body.code).toBe('file_too_large')
		expect(s3Mock.calls()).toHaveLength(0)
	})

	it('uploads the file to S3 and resolves with key + bucket', async () => {
		s3Mock.on(PutObjectCommand).resolves({ ETag: '"etag123"' })
		const res = await request(
			buildApp({ bucket: 'avatars', field: 'file', key: 'users/1.png', isPublic: true })
		)
			.post('/upload')
			.attach('file', Buffer.from('hello'), 'a.txt')
		expect(res.status).toBe(200)
		expect(res.body).toEqual({ key: 'users/1.png', bucket: 'avatars' })

		const put = s3Mock.commandCalls(PutObjectCommand)[0]?.args[0].input
		expect(put?.Bucket).toBe('avatars')
		expect(put?.Key).toBe('users/1.png')
		expect(put?.ACL).toBe('public-read')
		expect(put?.CacheControl).toBe('max-age=31536000')
	})
})
