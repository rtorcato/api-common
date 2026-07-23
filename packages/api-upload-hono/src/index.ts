import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import { BadRequestError, HttpError } from '@rtorcato/api-errors'
import type { Context } from 'hono'

/** A file uploaded to S3 — the multipart file plus the object details S3 returns. */
export interface UploadedFile {
	fieldname: string
	originalname: string
	mimetype: string
	size: number
	/** Bucket the object was written to. */
	bucket: string
	/** Object key. */
	key: string
	/** Public URL / S3 location of the object. */
	location: string
	etag: string
	contentType: string
}

export interface UploadOptions {
	/** S3 client the object is written with (you own its config/credentials). */
	s3: S3Client
	/** Destination bucket. */
	bucket: string
	/** Multipart form field holding the file. */
	field: string
	/** Object key — a string, or a function of the request context + file for deterministic keys. */
	key: string | ((c: Context, file: File) => string)
	/** `public-read` ACL when true, otherwise `private`. Default: `false`. */
	isPublic?: boolean
	/** `Cache-Control` stored on the object. Default: `max-age=31536000` (1 year). */
	cacheControl?: string
	/** Extra object metadata. */
	metadata?: Record<string, string>
	/** Max upload size in bytes; exceeding it rejects with `413` before the object is written to S3. */
	maxSizeBytes?: number
}

/**
 * Upload a single file from a multipart request straight to S3, resolving with the
 * stored object's details.
 *
 * Hono counterpart to `@rtorcato/api-upload` (Express): parses the multipart body via
 * `c.req.parseBody()` and writes the file with the AWS SDK directly — Hono has no
 * multer / multer-s3 equivalent to wrap.
 *
 * Rejects with an `HttpError` (from `@rtorcato/api-errors`): `413 file_too_large` when
 * `maxSizeBytes` is exceeded and `400 no_file` when the field is empty or not a file —
 * so it slots into the error-handler middleware.
 *
 * @example
 * ```ts
 * app.post('/avatar', async (c) => {
 *   const file = await uploadFile(c, {
 *     s3, bucket: 'avatars', field: 'avatar',
 *     key: (ctx) => `users/${ctx.get('userId')}.png`, isPublic: true,
 *   })
 *   return c.json({ url: file.location })
 * })
 * ```
 */
export async function uploadFile(c: Context, options: UploadOptions): Promise<UploadedFile> {
	// Reject oversized uploads up front via Content-Length when present — cheaper than
	// buffering the whole body just to reject it. It can be absent (chunked), so the
	// real cap is re-checked below once the bytes are in hand.
	if (options.maxSizeBytes !== undefined) {
		const contentLength = Number(c.req.header('content-length'))
		if (Number.isFinite(contentLength) && contentLength > options.maxSizeBytes) {
			throw new HttpError(413, 'File too large', 'file_too_large')
		}
	}

	const body = await c.req.parseBody()
	const entry = body[options.field]
	if (!(entry instanceof File)) {
		throw new BadRequestError('No file uploaded', 'no_file')
	}

	// ponytail: buffers the file into memory (Hono's parseBody already does), fine for
	// avatar/document-sized uploads; hand out a presigned PUT for multi-GB files.
	const bytes = new Uint8Array(await entry.arrayBuffer())
	if (options.maxSizeBytes !== undefined && bytes.byteLength > options.maxSizeBytes) {
		throw new HttpError(413, 'File too large', 'file_too_large')
	}

	const key = typeof options.key === 'function' ? options.key(c, entry) : options.key
	const contentType = entry.type || 'application/octet-stream'

	const result = await options.s3.send(
		new PutObjectCommand({
			Bucket: options.bucket,
			Key: key,
			Body: bytes,
			ContentType: contentType,
			ACL: options.isPublic ? 'public-read' : 'private',
			CacheControl: options.cacheControl ?? 'max-age=31536000',
			Metadata: options.metadata,
		})
	)

	// ponytail: virtual-hosted-style AWS URL from the client's region; build your own
	// from bucket + key if you use a custom endpoint (MinIO, R2, a CDN in front).
	const region = await options.s3.config.region()
	const location = `https://${options.bucket}.s3.${region}.amazonaws.com/${key}`

	return {
		fieldname: options.field,
		originalname: entry.name,
		mimetype: contentType,
		size: bytes.byteLength,
		bucket: options.bucket,
		key,
		location,
		etag: (result.ETag ?? '').replace(/"/g, ''),
		contentType,
	}
}
