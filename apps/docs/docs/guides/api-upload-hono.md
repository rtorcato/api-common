---
title: api-upload-hono
description: Promise-based S3 file upload for Hono.
---

`@rtorcato/api-upload-hono` is the Hono counterpart to
[api-upload](./api-upload.md). It uploads a single file from a multipart Hono
request straight to S3 — parsing the body with `c.req.parseBody()` and writing
the object with the AWS SDK directly (Hono has no multer/multer-s3 to wrap) —
and resolves with the stored object. Failures come back as
[api-errors](./api-errors.md) `HttpError`s so they slot into the error handler.

## Install

```bash
pnpm add @rtorcato/api-upload-hono @aws-sdk/client-s3 hono
```

`@aws-sdk/client-s3` (v3) and `hono` (v4) are peer dependencies — you bring your
own versions and S3 client.

## Usage

```ts
import { S3Client } from '@aws-sdk/client-s3'
import { uploadFile } from '@rtorcato/api-upload-hono'

const s3 = new S3Client({ region: 'us-east-1' })

app.post('/avatar', async (c) => {
  const file = await uploadFile(c, {
    s3,
    bucket: 'avatars',
    field: 'avatar',
    key: (ctx) => `users/${ctx.get('userId')}.png`,
    isPublic: true,
    maxSizeBytes: 5 * 1024 * 1024,
  })
  return c.json({ url: file.location })
})
```

`key` can be a string or a function `(c, file) => string`.

## Errors

`uploadFile` rejects with an `HttpError`:

- **`413 file_too_large`** — the upload exceeds `maxSizeBytes` (checked via
  `Content-Length` up front, then re-checked once the bytes are buffered).
- **`400 no_file`** — the field was empty or not a file.

## Notes

- **ACL** — `isPublic` sets `public-read` / `private`. Buckets with Object
  Ownership *bucket-owner-enforced* reject ACLs; leave `isPublic` unset and use a
  bucket policy instead.
- **In memory** — the file is buffered in memory (Hono's `parseBody()` already
  buffers). Great for avatars and documents; hand out a presigned `PUT` for
  multi-GB uploads.
- **`location`** — the virtual-hosted AWS URL from the client's region. For a
  custom endpoint (MinIO, R2, a CDN), build the URL yourself from `bucket` + `key`.

## Related

- [api-upload](./api-upload.md) — the Express counterpart (multer-s3)
- [api-errors](./api-errors.md) — the `HttpError` classes failures are normalized to
