---
"@rtorcato/api-health": minor
"@rtorcato/api-health-express": minor
"@rtorcato/api-health-hono": minor
---

Add health-check packages: a framework-agnostic readiness registry (`createHealthRegistry`) plus Express and Hono liveness/readiness probe handlers (`livenessHandler`, `readinessHandler`) for `/healthz` and `/readyz` endpoints.
