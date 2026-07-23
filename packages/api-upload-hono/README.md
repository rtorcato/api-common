# @rtorcato/api-upload-hono

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-upload-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-upload-hono)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-upload-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-upload-hono)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Promise-based S3 file upload for [Hono](https://hono.dev) — the counterpart to
[`@rtorcato/api-upload`](https://www.npmjs.com/package/@rtorcato/api-upload) (Express).
It parses the multipart body via `c.req.parseBody()` and writes the file to S3 with the
AWS SDK directly, resolving with the stored object's details.

```ts
import { S3Client } from '@aws-sdk/client-s3'
import { uploadFile } from '@rtorcato/api-upload-hono'
import { Hono } from 'hono'

const s3 = new S3Client({ region: 'us-east-1' })
const app = new Hono()

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

## Errors

`uploadFile` throws typed errors from [`@rtorcato/api-errors`](https://www.npmjs.com/package/@rtorcato/api-errors),
so they slot straight into your error handler:

- **`413 file_too_large`** — the upload exceeds `maxSizeBytes`.
- **`400 no_file`** — the field is missing or isn't a file.

## Notes

- The file is buffered in memory (Hono's `parseBody()` already buffers) — great for
  avatars and documents; use a presigned `PUT` for multi-GB uploads.
- `location` is the virtual-hosted AWS URL derived from the client's region. If you use a
  custom endpoint (MinIO, R2, a CDN), build the URL yourself from `bucket` + `key`.

`@aws-sdk/client-s3` (v3) and `hono` (v4) are peer dependencies — you control the versions.

## License

MIT
