---
'@rtorcato/api-amqp': major
'@rtorcato/api-auth': major
'@rtorcato/api-auth-express': major
'@rtorcato/api-auth-hono': major
'@rtorcato/api-config': major
'@rtorcato/api-cors-express': major
'@rtorcato/api-errors': major
'@rtorcato/api-errors-express': major
'@rtorcato/api-errors-hono': major
'@rtorcato/api-express-utils': major
'@rtorcato/api-graceful-shutdown': major
'@rtorcato/api-health': major
'@rtorcato/api-health-express': major
'@rtorcato/api-health-hono': major
'@rtorcato/api-http': major
'@rtorcato/api-logger': major
'@rtorcato/api-openapi': major
'@rtorcato/api-openapi-express': major
'@rtorcato/api-openapi-hono': major
'@rtorcato/api-rate-limit': major
'@rtorcato/api-rate-limit-express': major
'@rtorcato/api-rate-limit-hono': major
'@rtorcato/api-response': major
'@rtorcato/api-testing': major
'@rtorcato/api-ts-rest-express': major
'@rtorcato/api-upload': major
'@rtorcato/api-validation': major
---

First stable release — **1.0.0**.

The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.
