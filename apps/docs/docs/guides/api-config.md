---
title: api-config
description: Load and validate environment variables with dotenv + zod at startup.
---

`@rtorcato/api-config` loads a `.env` file and validates `process.env` against a zod schema, throwing on the first bad config rather than failing silently at runtime.

## Install

```bash
pnpm add @rtorcato/api-config
```

## Usage

```ts
import { loadEnv } from '@rtorcato/api-config'
import { z } from 'zod'

const env = loadEnv(
  z.object({
    PORT: z.coerce.number().default(3000),
    LOG_LEVEL: z.string().default('info'),
    DATABASE_URL: z.string().url(),
  })
)

// env is fully typed: { PORT: number; LOG_LEVEL: string; DATABASE_URL: string }
```

Call `loadEnv` once at startup — before you create the server — so a misconfiguration fails fast.

## .env file

```bash
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgres://localhost:5432/mydb
```

In tests, `loadEnv` reads `.env.test` automatically (when `NODE_ENV === 'test'`).

## Options

```ts
loadEnv(schema, {
  path: '/absolute/path/to/.env',  // override the default file location
  skipDotenv: true,                // skip file loading, validate process.env as-is
})
```

`skipDotenv: true` is useful in production where env vars are injected by the platform (Docker, Kubernetes, Heroku).

## On failure

If a required variable is missing or fails validation, `loadEnv` throws with a formatted message:

```
Error: Invalid environment variables:
{
  "DATABASE_URL": ["Invalid url"]
}
```

The error is thrown (not `process.exit`) so the calling application decides how to handle it.
