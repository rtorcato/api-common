import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import clsx from 'clsx'
import type { ReactElement } from 'react'
import InstallTabs from '@site/src/components/InstallTabs'
import styles from './index.module.css'

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconKey = 'shield' | 'brackets' | 'plug' | 'layers'

type IconProps = {
	icon: IconKey
	title: string
	className?: string
	size?: number
}

function Icon({ icon, title, className, size = 22 }: IconProps): ReactElement {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
		>
			<title>{title}</title>
			{ICONS[icon]}
		</svg>
	)
}

const ICONS: Record<IconKey, ReactElement> = {
	shield: (
		<>
			<path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6z" />
			<path d="m9 12 2 2 4-4" />
		</>
	),
	brackets: (
		<>
			<path d="m9 8-5 4 5 4" />
			<path d="m15 8 5 4-5 4" />
		</>
	),
	plug: (
		<>
			<path d="M12 22v-5" />
			<path d="M9 8V2M15 8V2" />
			<path d="M5 8h14v3a7 7 0 0 1-14 0z" />
		</>
	),
	layers: (
		<>
			<path d="m12 2 9 5-9 5-9-5z" />
			<path d="m3 12 9 5 9-5" />
		</>
	),
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Pillar = {
	title: string
	desc: string
	icon: IconKey
}

const PILLARS: Pillar[] = [
	{
		title: 'Framework-agnostic core',
		desc: '`@rtorcato/api-errors` is plain TypeScript — no HTTP framework pulled in. Throw the same errors anywhere.',
		icon: 'layers',
	},
	{
		title: 'Consistent error shape',
		desc: 'Every handler maps to `{ error, code, message, stack? }` — identical JSON across Express and Hono.',
		icon: 'shield',
	},
	{
		title: 'TypeScript-first',
		desc: 'Strict types, typed handler options, JSDoc-rich in your IDE. Zero runtime dependencies in the core.',
		icon: 'brackets',
	},
	{
		title: 'Bring your own framework',
		desc: 'Express and Hono adapters keep the framework as a peer dependency — you control the version.',
		icon: 'plug',
	},
]

type Package = {
	name: string
	tagline: string
	desc: string
	to: string
	chips: string[]
}

const PACKAGES: Package[] = [
	{
		name: '@rtorcato/api-errors',
		tagline: 'Core',
		desc: 'Framework-agnostic HTTP error classes: HttpError plus 400/401/403/404/409/500 subclasses, each carrying status + code.',
		to: '/docs/api/api-errors',
		chips: ['HttpError', 'BadRequestError', 'NotFoundError', 'InternalServerError'],
	},
	{
		name: '@rtorcato/api-errors-express',
		tagline: 'Express',
		desc: 'Express middleware: errorHandler + notFoundHandler that map HttpError instances to a consistent JSON body.',
		to: '/docs/api/api-errors-express',
		chips: ['errorHandler', 'notFoundHandler'],
	},
	{
		name: '@rtorcato/api-errors-hono',
		tagline: 'Hono',
		desc: 'Hono middleware wiring into app.onError / app.notFound, with the same response shape as the Express adapter.',
		to: '/docs/api/api-errors-hono',
		chips: ['errorHandler', 'notFoundHandler'],
	},
]

const HERO_CODE = `import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler } from '@rtorcato/api-errors-express'

app.get('/users/:id', (req, res) => {
  throw new NotFoundError('User not found')
})

app.use(errorHandler())`

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Hero(): ReactElement {
	return (
		<header className={styles.hero}>
			<div className={styles.heroGlow} aria-hidden />
			<div className={styles.heroInner}>
				<div className={styles.wordmark}>
					<span className={styles.wmBrowser}>api</span>
					<span className={styles.wmDash}>-</span>
					<span className={styles.wmCommon}>common</span>
				</div>
				<p className={styles.tagline}>
					Reusable, framework-agnostic building blocks for Node.js APIs — HTTP error classes plus
					Express and Hono middleware.
				</p>

				<div className={styles.heroBody}>
					<CodeWindow />
				</div>

				<div className={styles.heroActions}>
					<div className={styles.heroButtons}>
						<Link
							className={clsx('button button--primary button--lg', styles.cta)}
							to="/docs/guides/installation"
						>
							Get started →
						</Link>
						<Link
							className={clsx('button button--lg', styles.ctaSecondary)}
							to="/docs/api/api-errors"
						>
							Browse the API
						</Link>
					</div>
					<InstallTabs pkg="@rtorcato/api-errors" />
				</div>
			</div>
		</header>
	)
}

function CodeWindow(): ReactElement {
	return (
		<div className={styles.codeWindow}>
			<div className={styles.codeBar}>
				<span className={styles.dot} style={{ background: '#ff5f57' }} />
				<span className={styles.dot} style={{ background: '#febc2e' }} />
				<span className={styles.dot} style={{ background: '#28c840' }} />
				<span className={styles.codeFile}>server.ts</span>
			</div>
			<pre className={styles.codePre}>{HERO_CODE}</pre>
		</div>
	)
}

function Pillars(): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.pillarGrid}>
				{PILLARS.map((p) => (
					<div key={p.title} className={styles.pillar}>
						<div className={styles.pillarIcon}>
							<Icon icon={p.icon} title={p.title} size={20} className={styles.pillarIconSvg} />
						</div>
						<div className={styles.pillarTitle}>{p.title}</div>
						<div className={styles.pillarDesc}>{p.desc}</div>
					</div>
				))}
			</div>
		</section>
	)
}

function Packages(): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHead}>
				<div>
					<h2 className={styles.h2}>Three packages, one error contract</h2>
					<p className={styles.sub}>
						Install the core on its own, or pair it with the adapter for your framework.
					</p>
				</div>
				<Link className={styles.viewAll} to="/docs/api/api-errors">
					View the API →
				</Link>
			</div>
			<div className={styles.catGrid}>
				{PACKAGES.map((p) => (
					<Link key={p.name} to={p.to} className={styles.card}>
						<div className={styles.cardHead}>
							<div className={styles.cardName}>{p.name}</div>
							<div className={styles.cardCount}>{p.tagline}</div>
						</div>
						<p className={styles.cardDesc}>{p.desc}</p>
						<div className={styles.chips}>
							{p.chips.map((ch) => (
								<span key={ch} className={styles.chip}>
									{ch}
								</span>
							))}
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}

type Sibling = {
	name: string
	tagline: string
	/** Prefer the published docs site; fall back to the GitHub repo when there isn't one yet. */
	href: string
	/** Short label rendered in the card's top-right indicating where the link goes. */
	dest: 'Docs' | 'GitHub'
}

const SIBLINGS: Sibling[] = [
	{
		name: '@rtorcato/browser-common',
		tagline:
			'Tree-shakeable TypeScript wrappers around 40+ browser Web APIs — one subpath per spec.',
		href: 'https://rtorcato.github.io/browser-common/',
		dest: 'Docs',
	},
	{
		name: '@rtorcato/js-common',
		tagline: 'Tree-shakeable TypeScript utilities — tiny bundles, full type safety, CLI included.',
		href: 'https://rtorcato.github.io/js-common/',
		dest: 'Docs',
	},
	{
		name: '@rtorcato/js-tooling',
		tagline: 'Shared Biome, TypeScript and Vitest presets that power the @rtorcato/* family.',
		href: 'https://rtorcato.github.io/js-tooling/',
		dest: 'Docs',
	},
]

function Siblings(): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHead}>
				<div>
					<h2 className={styles.h2}>Sibling projects</h2>
					<p className={styles.sub}>
						More from <code>@rtorcato</code> — same conventions, same release pipeline.
					</p>
				</div>
			</div>
			<div className={styles.siblingGrid}>
				{SIBLINGS.map((s) => (
					<Link key={s.name} href={s.href} className={styles.card}>
						<div className={styles.cardHead}>
							<div className={styles.cardName}>{s.name}</div>
							<div className={styles.cardCount}>{s.dest} ↗</div>
						</div>
						<p className={styles.cardDesc}>{s.tagline}</p>
					</Link>
				))}
			</div>
		</section>
	)
}

export default function Home(): ReactElement {
	return (
		<Layout
			title="api-common"
			description="Reusable, framework-agnostic building blocks for Node.js APIs — HTTP error classes plus Express and Hono middleware."
		>
			<main>
				<Hero />
				<Pillars />
				<Packages />
				<Siblings />
			</main>
		</Layout>
	)
}
