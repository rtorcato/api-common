---
title: api-upload
description: Promise-based S3 file upload for Express via multer-s3.
---

`@rtorcato/api-upload` uploads a single file from a multipart Express request
straight to S3 (via [multer-s3](https://github.com/anacronw/multer-s3)) and
resolves with the stored object. ACL, cache-control, and deterministic keys are
configurable, and failures come back as [api-errors](./api-errors.md) `HttpError`s
so they slot into the error handler.

## Install

```bash
pnpm add @rtorcato/api-upload @aws-sdk/client-s3 multer multer-s3 express
```

`@aws-sdk/client-s3`, `multer`, `multer-s3`, and `express` are peer dependencies —
you bring your own versions and S3 client.

## Usage

```ts
import { S3Client } from '@aws-sdk/client-s3'
import { uploader } from '@rtorcato/api-upload'

const s3 = new S3Client({ region: 'us-east-1' })

app.post('/avatar', async (req, res, next) => {
  try {
    const file = await uploader(req, res, {
      s3,
      bucket: 'avatars',
      field: 'avatar',
      key: `users/${req.user.id}.png`,
      isPublic: true,
      maxSizeBytes: 5 * 1024 * 1024,
    })
    res.json({ url: file.location })
  } catch (err) {
    next(err)
  }
})
```

`key` can be a string or a function `(req, file) => string`.

## Errors

`uploader` rejects with an `HttpError`:

- **`413 file_too_large`** — request `Content-Length` exceeds `maxSizeBytes`
  (checked before anything streams to S3).
- **`400 no_file`** — the field was empty.
- **`400`** — any other multer error (e.g. unexpected field).

## Notes

- **ACL** — `isPublic` sets `public-read` / `private`. Buckets with Object
  Ownership *bucket-owner-enforced* reject ACLs; leave `isPublic` unset and use a
  bucket policy instead.
- **Size limit** — enforced via `Content-Length` up front (includes small
  multipart overhead), which avoids buffering oversized bodies and a multer-s3
  hang when aborting an in-flight upload on multer's own limit.

## Related

- [api-errors](./api-errors.md) — the `HttpError` classes failures are normalized to
