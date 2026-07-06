import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes as prismThemes } from 'prism-react-renderer'
import { packageDescriptions, publishablePackages } from './publishablePackages'

// One typedoc plugin instance per publishable package. Each reads the package's
// `src` directly (no build needed) and writes a single Markdown page at
// docs/api/<pkg>/index.md, which sidebars.ts links to by doc id. Derived from
// the workspace so a new package gets an API Reference page automatically.
const PACKAGES = publishablePackages

// The @rtorcato open-source family. Surfaced as a navbar "Projects" dropdown
// (Docusaurus renders navbar items in the mobile menu too) and in the footer,
// so every sibling site cross-links to the rest. Keep in sync across repos.
const GITHUB_PROFILE = 'https://github.com/rtorcato'
const PROJECT_FAMILY = [
	{ label: 'js-common', href: 'https://rtorcato.github.io/js-common/' },
	{ label: 'api-common', href: 'https://rtorcato.github.io/api-common/' },
	{ label: 'browser-common', href: 'https://rtorcato.github.io/browser-common/' },
	{ label: 'db-common', href: 'https://rtorcato.github.io/db-common/' },
	{ label: 'cf-common', href: 'https://rtorcato.github.io/cf-common/' },
	{ label: 'react-common', href: 'https://github.com/rtorcato/react-common' },
	{ label: 'swift-common', href: 'https://rtorcato.github.io/swift-common/' },
	{ label: 'js-tooling', href: 'https://rtorcato.github.io/js-tooling/' },
]

const typedocPlugins = PACKAGES.map((pkg) => [
	'docusaurus-plugin-typedoc',
	{
		id: pkg,
		entryPoints: [`../../packages/${pkg}/src/index.ts`],
		tsconfig: `../../packages/${pkg}/tsconfig.json`,
		// The packages target the esnext lib and typecheck on their own
		// toolchain; the docs workspace pins an older TS. Skip TypeDoc's
		// redundant semantic check (matches the browser-common docs setup).
		skipErrorChecking: true,
		out: `docs/api/${pkg}`,
		readme: 'none',
		includeVersion: true,
		excludePrivate: true,
		excludeInternal: true,
		excludeExternals: true,
		sort: ['source-order'],
		outputFileStrategy: 'modules',
		// Stamp the package.json description onto the generated page's
		// frontmatter so the /docs/api index cards describe each package
		// (instead of TypeDoc's generic "Interfaces"/"Classes" fallback).
		plugin: [
			'typedoc-plugin-markdown',
			'typedoc-plugin-frontmatter',
			// Local: moves each function's `#### Example` above Parameters/Returns.
			`${__dirname}/typedoc-plugin-reorder-example.mjs`,
		],
		frontmatterGlobals: { description: packageDescriptions[pkg] },
	},
])

const config: Config = {
	title: 'api-common',
	tagline:
		'Reusable, framework-agnostic building blocks for Node.js APIs — HTTP error classes plus Express and Hono middleware.',
	favicon: 'img/logo.svg',

	url: 'https://rtorcato.github.io',
	baseUrl: '/api-common/',

	organizationName: 'rtorcato',
	projectName: 'api-common',

	onBrokenLinks: 'warn',

	markdown: {
		format: 'detect',
		hooks: {
			onBrokenMarkdownLinks: 'warn',
		},
	},

	i18n: {
		defaultLocale: 'en',
		locales: ['en'],
	},

	headTags: [
		{
			tagName: 'link',
			attributes: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
		},
		{
			tagName: 'link',
			attributes: {
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossorigin: 'anonymous',
			},
		},
	],

	presets: [
		[
			'classic',
			{
				docs: {
					sidebarPath: './sidebars.ts',
					// Marketing landing (src/pages/index.tsx) owns '/'; docs live at '/docs'.
					routeBasePath: '/docs',
					editUrl: 'https://github.com/rtorcato/api-common/edit/main/apps/docs/',
				},
				blog: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],

	plugins: [
		...typedocPlugins,
		[
			'@easyops-cn/docusaurus-search-local',
			{
				hashed: true,
				indexDocs: true,
				indexBlog: false,
				docsRouteBasePath: '/docs',
				highlightSearchTermsOnTargetPage: true,
				searchBarShortcutHint: false,
			},
		],
	] as Config['plugins'],

	themeConfig: {
		colorMode: {
			defaultMode: 'dark',
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: 'api-common',
			logo: {
				alt: 'api-common',
				src: 'img/logo.svg',
				srcDark: 'img/logo-dark.svg',
			},
			items: [
				{ to: '/docs', position: 'left', label: 'Docs' },
				{ to: '/docs/api', position: 'left', label: 'API' },
				{ to: '/docs/examples', position: 'left', label: 'Examples' },
				{
					type: 'dropdown',
					label: 'Projects',
					position: 'left',
					items: [{ label: 'All on GitHub →', href: GITHUB_PROFILE }, ...PROJECT_FAMILY],
				},
				{
					href: 'https://github.com/rtorcato/api-common',
					label: 'GitHub',
					position: 'right',
				},
				{
					href: 'https://www.npmjs.com/package/@rtorcato/api-errors',
					label: 'npm',
					position: 'right',
				},
			],
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Documentation',
					items: [
						{ label: 'Installation', to: '/docs/guides/installation' },
						{ label: 'Express middleware', to: '/docs/guides/express' },
						{ label: 'Hono middleware', to: '/docs/guides/hono' },
						{ label: 'API reference', to: '/docs/api' },
						{ label: 'Examples', to: '/docs/examples' },
					],
				},
				{
					title: 'Resources',
					items: [
						{ label: 'GitHub', href: 'https://github.com/rtorcato/api-common' },
						{ label: 'Changelog', to: '/docs/changelog' },
					],
				},
				{
					title: 'Projects',
					items: PROJECT_FAMILY,
				},
				{
					title: 'Community',
					items: [
						{ label: '@rtorcato', href: GITHUB_PROFILE },
						{ label: 'Issues', href: 'https://github.com/rtorcato/api-common/issues' },
						{
							label: 'License (MIT)',
							href: 'https://github.com/rtorcato/api-common/blob/main/LICENSE',
						},
					],
				},
			],
			copyright: `Copyright © ${new Date().getFullYear()} Richard Torcato. Built with Docusaurus.`,
		},
		prism: {
			theme: prismThemes.vsDark,
			darkTheme: prismThemes.vsDark,
			additionalLanguages: ['bash', 'json', 'typescript'],
		},
	} satisfies Preset.ThemeConfig,
}

export default config
