---
"@rtorcato/api-security-express": minor
---

Add `@rtorcato/api-security-express` (closes #90): Express security-headers middleware wrapping [helmet](https://helmetjs.github.io/) with API-friendly defaults — CSP off (JSON APIs rarely serve HTML), HSTS on, both toggleable. Express-only, since Hono ships `secureHeaders` built in.
