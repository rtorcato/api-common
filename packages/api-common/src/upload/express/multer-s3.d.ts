// multer-s3 v3 ships no types and @types/multer-s3 targets v2, so declare the
// slice of the API this package uses. Ambient — for our build only; the public
// surface (UploadOptions/UploadedFile) exposes none of these types.
declare module 'multer-s3' {
	import type { S3Client } from '@aws-sdk/client-s3'
	import type { Request } from 'express'
	import type { StorageEngine } from 'multer'

	type Callback<T> = (error: Error | null, value?: T) => void
	type ContentTypeFn = (
		req: Request,
		file: Express.Multer.File,
		cb: (error: unknown, mime?: string, stream?: NodeJS.ReadableStream) => void
	) => void

	interface MulterS3Options {
		s3: S3Client
		bucket: string
		acl?: string
		contentType?: ContentTypeFn
		cacheControl?: string
		metadata?: (
			req: Request,
			file: Express.Multer.File,
			cb: Callback<Record<string, string>>
		) => void
		key?: (req: Request, file: Express.Multer.File, cb: Callback<string>) => void
	}

	interface MulterS3 {
		(options: MulterS3Options): StorageEngine
		AUTO_CONTENT_TYPE: ContentTypeFn
	}

	const multerS3: MulterS3
	export default multerS3
}
