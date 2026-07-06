# @rtorcato/api-graceful-shutdown

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-graceful-shutdown.svg)](https://www.npmjs.com/package/@rtorcato/api-graceful-shutdown)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-graceful-shutdown.svg)](https://www.npmjs.com/package/@rtorcato/api-graceful-shutdown)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-graceful-shutdown)](https://bundlephobia.com/package/@rtorcato/api-graceful-shutdown)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic graceful shutdown for Node API servers — drains cleanly on
`SIGTERM`/`SIGINT` by running ordered cleanup hooks (stop the HTTP server, close
the broker, end the DB pool), with a hard timeout so a stuck resource can't
wedge a container restart.

Closing a Node HTTP server is identical under Express (`app.listen`) and Hono
(`@hono/node-server`), so there's a single package with no per-framework adapter.

## Install

```bash
pnpm add @rtorcato/api-graceful-shutdown
```

## Usage

```ts
import { createShutdownController, closeHttpServer } from '@rtorcato/api-graceful-shutdown'

const server = app.listen(3000)

const shutdown = createShutdownController({
  timeoutMs: 10_000, // force-exit(1) if cleanup exceeds this
  logger: console.log, // optional progress lines
})

// Hooks run in registration order. Stop taking traffic first, then close deps.
shutdown.register('http', closeHttpServer(server))
shutdown.register('amqp', () => connection.close())
shutdown.register('db', () => pool.end())
```

On `SIGTERM` (Docker/Kubernetes) or `SIGINT` (Ctrl-C), hooks run **sequentially**
and the process exits `0`; if any hook throws, the remaining hooks still run and
it exits `1`. Shutdown is idempotent — a second signal while draining is ignored.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `signals` | `['SIGTERM', 'SIGINT']` | Signals that trigger shutdown. |
| `timeoutMs` | `10_000` | Whole-sequence budget; exceeding it force-exits `1`. |
| `logger` | no-op | Called with progress lines. |
| `exit` | `process.exit` | Exit function — injectable for tests. |

### `closeHttpServer(server)`

Returns a hook that calls `server.close()` — stops accepting new connections and
resolves once in-flight requests finish. Works for any Node `http.Server`,
including the one `@hono/node-server`'s `serve()` returns.

Full guide: [api-graceful-shutdown](https://github.com/rtorcato/api-common/blob/main/apps/docs/docs/guides/api-graceful-shutdown.md).

## License

MIT
