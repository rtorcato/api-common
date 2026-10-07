---
"@rtorcato/api-config": patch
"@rtorcato/api-errors-express": patch
"@rtorcato/api-errors-hono": patch
"@rtorcato/api-logger": patch
---

Bump `@rtorcato/js-common` to `^5.0.0`. js-common 5 makes `zod` an optional peer, but its `./env` entry (used here for `isDev`/`isProd`/`isTest`) imports it at load time, so `api-errors-express`, `api-errors-hono` and `api-logger` now declare `zod` as a dependency to keep it installed for consumers.
