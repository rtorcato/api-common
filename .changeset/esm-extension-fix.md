---
"@rtorcato/api-errors-express": patch
"@rtorcato/api-errors-hono": patch
---

Fix ESM type resolution: add explicit `.js` extensions to relative re-exports in the barrel files so the published `.d.ts` resolves correctly under Node16/NodeNext ESM consumers.
