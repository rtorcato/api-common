# @rtorcato/api-health

## 0.1.0

### Minor Changes

- c273623: Add health-check packages: a framework-agnostic readiness registry (`createHealthRegistry`) plus Express and Hono liveness/readiness probe handlers (`livenessHandler`, `readinessHandler`) for `/healthz` and `/readyz` endpoints.
