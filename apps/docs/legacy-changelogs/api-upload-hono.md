# @rtorcato/api-upload-hono

## 0.1.0

### Minor Changes

- de1abc3: Add `@rtorcato/api-upload-hono` (closes #101): the Hono counterpart to `@rtorcato/api-upload`. `uploadFile(c, options)` parses the multipart body via `c.req.parseBody()` and writes the file straight to S3 with the AWS SDK — Hono has no multer/multer-s3 to wrap. Same surface as the Express package (`UploadOptions`/`UploadedFile`, public/private ACL, cache-control, deterministic keys) and the same typed errors from `@rtorcato/api-errors` (`413 file_too_large`, `400 no_file`). `@aws-sdk/client-s3` and `hono` are peer dependencies.
