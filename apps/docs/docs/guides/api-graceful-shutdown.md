---
title: api-graceful-shutdown
description: SIGTERM/SIGINT drain for Node API servers — ordered cleanup hooks with a hard timeout.
---

`@rtorcato/api-graceful-shutdown` installs signal handlers that drain your process cleanly on `SIGTERM`/`SIGINT`: it runs your cleanup hooks in order (stop the HTTP server, close the message broker, end the DB pool) and then exits. If the hooks take too long, it force-exits so a stuck resource can't wedge a container restart.

Framework-agnostic — closing a Node HTTP server is identical under Express (`app.listen`) and Hono (`@hono/node-server`), so there's a single package with no per-framework adapter.

## Install

```bash
pnpm add @rtorcato/api-graceful-shutdown
```

## Usage

```ts
import { createShutdownController, closeHttpServer } from '@rtorcato/api-graceful-shutdown'

const server = app.listen(3000)

const shutdown = createShutdownController({
  timeoutMs: 10_000,   // force-exit(1) if cleanup exceeds this
  logger: console.log, // optional progress lines
})

// Hooks run in registration order. Stop taking traffic first, then close deps.
shutdown.register('http', closeHttpServer(server))
shutdown.register('amqp', () => connection.close())
shutdown.register('db', () => pool.end())
```

On `SIGTERM` (what Docker/Kubernetes send) or `SIGINT` (Ctrl-C), the hooks run and the process exits `0`. If any hook throws, remaining hooks still run and the process exits `1`.

## Options

| Option | Default | Meaning |
| --- | --- | --- |
| `signals` | `['SIGTERM', 'SIGINT']` | Signals that trigger shutdown. |
| `timeoutMs` | `10_000` | Hard limit for all hooks combined; exceeding it force-exits `1`. |
| `logger` | no-op | Called with progress lines. |
| `exit` | `process.exit` | Exit function — injectable for tests. |

## `closeHttpServer(server)`

Returns a hook that calls `server.close()` — stops accepting new connections and resolves once in-flight requests finish. Works for any Node `http.Server`, including the one `@hono/node-server`'s `serve()` returns.

## Notes

- Hooks run **sequentially** in registration order — draining is ordered by design.
- Shutdown is **idempotent**: a second signal (or manual `shutdown()`) while already draining is ignored.
- The `timeoutMs` is a whole-sequence budget, not per-hook. A single hung hook trips it and force-exits `1`.
- Call `shutdown.stop()` to remove the installed signal listeners (useful in tests).
