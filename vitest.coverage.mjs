import { defineConfig } from 'vitest/config'

// Single coverage run across the published packages, for CI/Codecov. Each
// package project uses its own vitest config (which re-exports the shared
// js-tooling config). Apps are excluded on purpose: docs/ is Playwright, and
// the example apps aren't published. Per-package `pnpm -r test` is unaffected —
// it runs each package's own config, never this one.
export default defineConfig({
	test: {
		projects: ['packages/*'],
		coverage: {
			provider: 'v8',
			reporter: ['text-summary', 'lcov'],
			reportsDirectory: './coverage',
			include: ['packages/*/src/**'],
		},
	},
})
