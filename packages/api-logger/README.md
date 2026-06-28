# @rtorcato/api-logger

Framework-agnostic [pino](https://getpino.io) logger factory for Node API projects.

```ts
import { createLogger } from '@rtorcato/api-logger'

const log = createLogger() // pretty in dev, JSON in production
log.info({ userId: 1 }, 'request handled')
```

## API

### `createLogger(options?, destination?)`

Returns a configured pino `Logger`.

- `options` — standard pino `LoggerOptions` plus `pretty?: boolean`. `pretty`
  defaults to `true` when `NODE_ENV !== 'production'` and routes through
  `pino-pretty` (install it as an optional peer dependency to use it).
- `level` defaults to the `LOG_LEVEL` env var, then `info`.
- `destination` — an optional pino destination stream. When supplied it takes
  precedence over the pretty transport.

## License

MIT
