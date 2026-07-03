# @rtorcato/api-upload

## 0.3.0

### Minor Changes

- 7a51835: 1.0 surface hygiene (from the #88 API-freeze audit)

  - **api-upload:** rename `uploader()` → `uploadFile()` so the action reads as a verb, consistent with `validate`/`connect`/`createX` across the packages. **Breaking:** update imports (`import { uploadFile } from '@rtorcato/api-upload'`).
  - **api-graceful-shutdown:** rename `createShutdownHandler()` → `createShutdownController()` so the factory matches its return type `ShutdownController` (mirrors `createHealthRegistry → HealthRegistry`). **Breaking:** update imports.
  - **api-openapi:** replace `export * from './builder'` with explicit named re-exports so the public surface is enumerated and can't silently widen/narrow. No symbols added or removed.
  - **api-amqp:** type `connect(url, socketOptions?)`'s second parameter against amqplib (`Parameters<typeof amqp.connect>[1]`) instead of `unknown`.

## 0.2.1

### Patch Changes

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0

## 0.2.0

### Minor Changes

- f87e0af: Add `@rtorcato/api-upload` — `uploader(req, res, { s3, bucket, field, key, isPublic?, cacheControl?, maxSizeBytes? })` streams a single multipart file to S3 via multer-s3 and resolves with the stored object. Rejects with `@rtorcato/api-errors` `HttpError`s (`413 file_too_large`, `400 no_file`). `@aws-sdk/client-s3`, `multer`, `multer-s3`, and `express` are peer dependencies.
