<!-- brand-kit:banner:start -->
<picture>
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner-mobile.png">
  <img src="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner.png" alt="api-common banner" width="1600">
</picture>
<!-- brand-kit:banner:end -->

# @rtorcato/api-logger

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-logger.svg)](https://www.npmjs.com/package/@rtorcato/api-logger)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-logger.svg)](https://www.npmjs.com/package/@rtorcato/api-logger)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-logger)](https://bundlephobia.com/package/@rtorcato/api-logger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="40">](https://buymeacoffee.com/rtorcato)

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
- `prettyOptions?` — forwarded to `pino-pretty` when `pretty` is on, e.g.
  `{ colorize: true, singleLine: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' }`.
  Ignored when `pretty` is `false` or a `destination` is supplied.
- `level` defaults to the `LOG_LEVEL` env var, then `info`.
- `destination` — an optional pino destination stream. When supplied it takes
  precedence over the pretty transport.

## License

MIT
