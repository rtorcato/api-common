# @rtorcato/api-graceful-shutdown

## 0.1.0

### Minor Changes

- f2332f7: Add `@rtorcato/api-graceful-shutdown`: SIGTERM/SIGINT drain for Node API servers. `createShutdownHandler` runs ordered cleanup hooks with a hard timeout and force-exit; `closeHttpServer` wraps a Node HTTP server's `close()` as a hook (works for Express and Hono via `@hono/node-server`).
