---
"@rtorcato/api-logger": minor
---

Add `prettyOptions` to `createLogger` — forwards options to `pino-pretty` (e.g. `colorize`, `singleLine`, `translateTime`, `ignore`) when `pretty` is on, so consumers no longer have to bypass the factory to configure the dev transport.
