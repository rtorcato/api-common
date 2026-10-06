---
"@rtorcato/api-rate-limit-redis": patch
---

Widen the `ioredis` peer range to `^5.0.0 || ^6.0.0`, so ioredis 6 consumers no longer get a peer-dependency warning. The store only calls `eval`, `scan` and `del`, and their replies are the same plain arrays under ioredis 6's RESP3 default.
