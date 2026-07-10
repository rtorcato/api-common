---
"@rtorcato/api-webhooks": minor
"@rtorcato/api-webhooks-express": minor
"@rtorcato/api-webhooks-hono": minor
---

Add webhook packages (closes #62):

- `@rtorcato/api-webhooks` — framework-agnostic `sign` and timing-safe `verifySignature` (HMAC, configurable algorithm + header prefix).
- `@rtorcato/api-webhooks-express` — Express middleware that captures the raw body (before `express.json()` strips it), verifies the signature, and parses JSON onto `req.body`; 401 on bad signature, 400 on bad JSON.
- `@rtorcato/api-webhooks-hono` — Hono middleware that verifies the signature over the raw body; 401 on bad signature. The handler can still read the buffered body via `c.req.json()`.
