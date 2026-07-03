# @rtorcato/api-upload

Promise-based S3 file upload for Express via [multer-s3](https://github.com/anacronw/multer-s3) — public/private ACL, cache-control, deterministic keys, and errors normalized to [`@rtorcato/api-errors`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors).

## Install

```sh
pnpm add @rtorcato/api-upload @aws-sdk/client-s3 multer multer-s3 express
```

`@aws-sdk/client-s3`, `multer`, `multer-s3`, and `express` are peer dependencies — you bring your own versions and S3 client.

## Usage

```ts
import { S3Client } from '@aws-sdk/client-s3'
import { uploadFile } from '@rtorcato/api-upload'

const s3 = new S3Client({ region: 'us-east-1' })

app.post('/avatar', async (req, res, next) => {
  try {
    const file = await uploadFile(req, res, {
      s3,
      bucket: 'avatars',
      field: 'avatar',              // multipart form field
      key: `users/${req.user.id}.png`,
      isPublic: true,               // public-read ACL (default: private)
      maxSizeBytes: 5 * 1024 * 1024,
    })
    res.json({ url: file.location })
  } catch (err) {
    next(err) // 413 / 400 HttpError → your error handler
  }
})
```

`key` can also be a function `(req, file) => string` for deterministic keys derived from the request.

## Errors

`uploadFile` rejects with an `HttpError` (from `@rtorcato/api-errors`) that drops straight into the `api-errors-express` handler:

- **`413 file_too_large`** — the request `Content-Length` exceeds `maxSizeBytes`. Checked **before** anything streams to S3.
- **`400 no_file`** — the field was empty.
- **`400`** — any other multer error (e.g. unexpected field).

## Notes

- **ACL:** `isPublic` sets `public-read` / `private`. Buckets with Object Ownership set to *bucket-owner-enforced* reject ACLs — leave `isPublic` unset and control access with a bucket policy instead.
- **Size limit:** enforced via `Content-Length` up front (which includes small multipart overhead) rather than multer's mid-stream limit — this avoids buffering oversized bodies and a multer-s3 hang when aborting an in-flight upload.

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-upload
