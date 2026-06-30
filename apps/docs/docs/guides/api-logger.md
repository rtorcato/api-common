---
title: api-logger
description: Pino logger factory — pretty in dev, JSON in production.
---

`@rtorcato/api-logger` wraps [pino](https://getpino.io) with sensible defaults: pretty-printed output in development, structured JSON in production.

## Install

```bash
pnpm add @rtorcato/api-logger
# Pretty output in dev requires pino-pretty:
pnpm add -D pino-pretty
```

## Usage

```ts
import { createLogger } from '@rtorcato/api-logger'

const log = createLogger({ level: 'info' })

log.info('server started')
log.warn({ port: 3000 }, 'port already in use, retrying')
log.error({ err }, 'unhandled exception')
```

The returned logger is a standard [`pino.Logger`](https://getpino.io/#/docs/api) — all pino methods work.

## Dev vs production

| Environment | Output | Requires |
|-------------|--------|---------|
| `NODE_ENV !== 'production'` | Pretty-printed, coloured | `pino-pretty` (dev dep) |
| `NODE_ENV === 'production'` | Structured JSON | nothing extra |

Override with the `pretty` option:

```ts
// Force pretty regardless of NODE_ENV
const log = createLogger({ pretty: true })

// Force JSON in dev
const log = createLogger({ pretty: false })
```

## Log level

Priority order:

1. `options.level` (explicit argument)
2. `process.env.LOG_LEVEL`
3. `'info'` (default)

```ts
// From env (wired with api-config):
const log = createLogger({ level: env.LOG_LEVEL })
```

## Custom destination

Pass a pino destination stream for tests or custom sinks (overrides `pretty`):

```ts
import { createLogger } from '@rtorcato/api-logger'
import { pino } from 'pino'

const dest = pino.destination('/var/log/app.log')
const log = createLogger({}, dest)
```
