# @rtorcato/api-config

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-config.svg)](https://www.npmjs.com/package/@rtorcato/api-config)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-config.svg)](https://www.npmjs.com/package/@rtorcato/api-config)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-config)](https://bundlephobia.com/package/@rtorcato/api-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Load and validate environment variables with [dotenv](https://github.com/motdotla/dotenv)
+ [zod](https://zod.dev) — you supply the schema, you get a typed, validated env.

```ts
import { loadEnv } from '@rtorcato/api-config'
import { z } from 'zod'

export const env = loadEnv(
	z.object({
		NODE_ENV: z.string().default('development'),
		PORT: z.coerce.number().default(3000),
		DATABASE_URL: z.string().url(),
	}),
)
```

## API

### `loadEnv(schema, options?)`

Loads a `.env` file (`.env.test` when `NODE_ENV === 'test'`) via dotenv +
dotenv-expand, then validates `process.env` against `schema` and returns the
typed result.

- `options.path` — explicit `.env` path.
- `options.skipDotenv` — validate `process.env` without reading a file.

On failure it throws an `Error` with the formatted field errors. Unlike the
common copy-paste pattern, it does **not** call `process.exit` — the caller
decides how to handle invalid config.

## Peer dependencies

`zod ^3.23`.

## License

MIT
