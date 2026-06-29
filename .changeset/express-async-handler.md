---
"@rtorcato/api-errors-express": minor
---

Add `asyncHandler()` — wraps an async Express route handler and forwards rejections to `next()`, so `errorHandler` handles them without per-route try/catch.
