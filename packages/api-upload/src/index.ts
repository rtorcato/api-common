import type { S3Client } from '@aws-sdk/client-s3'
import { BadRequestError, HttpError } from '@rtorcato/api-errors'
import type { Request, Response } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'

/** A file uploaded to S3 — the multer file plus the fields multer-s3 adds. */
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
	/** Object key — a string, or a function of the request + file for deterministic keys. */
	key: string | ((req: Request, file: Express.Multer.File) => string)
	/** `public-read` ACL when true, otherwise `private`. Default: `false`. */
	isPublic?: boolean
	/** `Cache-Control` stored on the object. Default: `max-age=31536000` (1 year). */
	cacheControl?: string
	/** Extra object metadata. */
	metadata?: Record<string, string>
	/** Max request size in bytes (checked against `Content-Length`); exceeding it rejects with a `413` before anything streams to S3. */
	maxSizeBytes?: number
}

/**
 * Upload a single file from a multipart request straight to S3, resolving with the
 * stored object's details.
 *
 * Rejects with an `HttpError` (from `@rtorcato/api-errors`): `413 file_too_large`
 * when `maxSizeBytes` is exceeded, `400 no_file` when the field is empty, and a
 * `400` for any other multer error — so it slots into the error-handler middleware.
 *
 * @example
 * ```ts
 * app.post('/avatar', async (req, res, next) => {
 *   try {
 *     const file = await uploadFile(req, res, {
 *       s3, bucket: 'avatars', field: 'avatar', key: `users/${req.user.id}.png`, isPublic: true,
 *     })
 *     res.json({ url: file.location })
 *   } catch (err) { next(err) }
 * })
 * ```
 */
export async function uploadFile(
	req: Request,
	res: Response,
	options: UploadOptions
): Promise<UploadedFile> {
	// Reject oversized uploads up front via Content-Length — cheaper than
	// buffering the body, and avoids a multer-s3 hang where aborting an in-flight
	// upload on multer's own fileSize limit never settles the callback.
	if (options.maxSizeBytes !== undefined) {
		const contentLength = Number(req.headers['content-length'])
		if (Number.isFinite(contentLength) && contentLength > options.maxSizeBytes) {
			throw new HttpError(413, 'File too large', 'file_too_large')
		}
	}

	const { key } = options
	const storage = multerS3({
		s3: options.s3,
		bucket: options.bucket,
		acl: options.isPublic ? 'public-read' : 'private',
		contentType: multerS3.AUTO_CONTENT_TYPE,
		cacheControl: options.cacheControl ?? 'max-age=31536000',
		metadata: (_req, _file, cb) => cb(null, options.metadata ?? {}),
		key:
			typeof key === 'function'
				? (r, file, cb) => cb(null, key(r as Request, file))
				: (_r, _file, cb) => cb(null, key),
	})

	const middleware = multer({ storage }).single(options.field)

	try {
		await new Promise<void>((resolve, reject) => {
			middleware(req, res, (err: unknown) => (err ? reject(err) : resolve()))
		})
	} catch (err) {
		// e.g. LIMIT_UNEXPECTED_FILE when the field name doesn't match.
		if (err instanceof multer.MulterError) {
			throw new BadRequestError(err.message, err.code.toLowerCase())
		}
		throw err
	}

	const file = req.file as UploadedFile | undefined
	if (!file) throw new BadRequestError('No file uploaded', 'no_file')
	return file
}
