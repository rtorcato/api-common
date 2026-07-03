# @rtorcato/api-upload

## 0.2.1

### Patch Changes

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0

## 0.2.0

### Minor Changes

- f87e0af: Add `@rtorcato/api-upload` — `uploader(req, res, { s3, bucket, field, key, isPublic?, cacheControl?, maxSizeBytes? })` streams a single multipart file to S3 via multer-s3 and resolves with the stored object. Rejects with `@rtorcato/api-errors` `HttpError`s (`413 file_too_large`, `400 no_file`). `@aws-sdk/client-s3`, `multer`, `multer-s3`, and `express` are peer dependencies.
