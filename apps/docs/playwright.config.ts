import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright config for the api-common docs site.
 *
 * Boots the production build via `pnpm serve` (port 3000) — closer to what
 * GitHub Pages serves than the dev server, and avoids HMR flake. Two projects
 * (mobile Pixel 7, desktop 1280x720); the mobile drawer is the primary target.
 */

const PORT = 3000
const BASE_URL = `http://localhost:${PORT}/api-common/`

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL: BASE_URL,
		colorScheme: 'dark',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'mobile',
			use: { ...devices['Pixel 7'] },
		},
		{
			name: 'desktop',
			use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } },
		},
	],
	webServer: {
		command: `pnpm run build && pnpm run serve --port ${PORT}`,
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 180_000,
		stdout: 'ignore',
		stderr: 'pipe',
	},
})
