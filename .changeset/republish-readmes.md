---
"@rtorcato/api-graceful-shutdown": patch
"@rtorcato/api-health": patch
"@rtorcato/api-health-express": patch
"@rtorcato/api-health-hono": patch
---

Republish so the README ships to npm. These four were published at 1.0.0 (PR #109) before their READMEs were added (PR #120), so npm still serves a README-less tarball. No code change — the README is already in the repo and included in the tarball; it just needs a version bump to publish.
