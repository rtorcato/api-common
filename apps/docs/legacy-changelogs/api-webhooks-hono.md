# @rtorcato/api-webhooks-hono

## 0.1.0

### Minor Changes

- 77f24b4: Add webhook packages (closes #62):

  - `@rtorcato/api-webhooks` — framework-agnostic `sign` and timing-safe `verifySignature` (HMAC, configurable algorithm + header prefix).
  - `@rtorcato/api-webhooks-express` — Express middleware that captures the raw body (before `express.json()` strips it), verifies the signature, and parses JSON onto `req.body`; 401 on bad signature, 400 on bad JSON.
  - `@rtorcato/api-webhooks-hono` — Hono middleware that verifies the signature over the raw body; 401 on bad signature. The handler can still read the buffered body via `c.req.json()`.

### Patch Changes

- Updated dependencies [77f24b4]
  - @rtorcato/api-webhooks@0.1.0
