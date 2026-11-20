# @rtorcato/api-security-express

## 0.1.0

### Minor Changes

- 6080f21: Add `@rtorcato/api-security-express` (closes #90): Express security-headers middleware — a thin [helmet](https://helmetjs.github.io/) wrapper that applies helmet's full, sane default header suite (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, …) and forwards any helmet option through. Express-only, since Hono ships `secureHeaders` built in.
