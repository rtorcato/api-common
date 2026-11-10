---
"@rtorcato/api-config": major
"@rtorcato/api-errors-express": major
"@rtorcato/api-errors-hono": major
"@rtorcato/api-logger": major
---

Require Node.js `>=24` and bump `@rtorcato/js-common` to `^6.2.1`. js-common 6 itself requires Node 24, so these four packages raise their `engines.node` floor from `>=22` to `>=24`. Consumers on Node 22 must upgrade Node before taking this release. No API changes.
