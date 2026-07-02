---
'@rtorcato/api-upload': minor
---

Add `@rtorcato/api-upload` — `uploader(req, res, { s3, bucket, field, key, isPublic?, cacheControl?, maxSizeBytes? })` streams a single multipart file to S3 via multer-s3 and resolves with the stored object. Rejects with `@rtorcato/api-errors` `HttpError`s (`413 file_too_large`, `400 no_file`). `@aws-sdk/client-s3`, `multer`, `multer-s3`, and `express` are peer dependencies.
