import Link from '@docusaurus/Link'
import CodeBlock from '@theme/CodeBlock'
import Layout from '@theme/Layout'
import TabItem from '@theme/TabItem'
import Tabs from '@theme/Tabs'
import clsx from 'clsx'
import type { ReactElement } from 'react'
import InstallTabs from '@site/src/components/InstallTabs'
import ScalarFrame from '@site/src/components/ScalarFrame'
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
		title: 'Mix and match',
		desc: 'Focused packages — errors, auth, rate limiting, validation, config, logging, OpenAPI. Install only what you need.',
		icon: 'layers',
	},
	{
		title: 'One response contract',
		desc: 'Errors map to `{ error, code, message }`, successes to `{ success, data }` — identical JSON across Express and Hono.',
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
		tagline: 'Errors',
		desc: 'Framework-agnostic HTTP error classes: HttpError plus 400/401/403/404/409/500 subclasses, each carrying status + code.',
		to: '/docs/guides/api-errors',
		chips: ['Core', 'Express', 'Hono'],
	},
	{
		name: '@rtorcato/api-auth',
		tagline: 'Auth',
		desc: 'JWT utilities — sign, verify, and extract bearer tokens — with an Express adapter for auth and optional-auth middleware.',
		to: '/docs/guides/api-auth',
		chips: ['Core', 'Express'],
	},
	{
		name: '@rtorcato/api-rate-limit',
		tagline: 'Rate limit',
		desc: 'In-memory sliding-window rate limiter with matching Express and Hono middleware adapters.',
		to: '/docs/guides/api-rate-limit',
		chips: ['Core', 'Express', 'Hono'],
	},
	{
		name: '@rtorcato/api-openapi',
		tagline: 'API docs',
		desc: 'HTML generators for Swagger UI and Scalar API Reference, plus Express and Hono adapters to serve them from an OpenAPI spec.',
		to: '/docs/guides/api-openapi',
		chips: ['Swagger UI', 'Scalar', 'Express', 'Hono'],
	},
	{
		name: '@rtorcato/api-validation',
		tagline: 'Validation',
		desc: 'Zod request validation that throws a BadRequestError on failure — wires straight into the error handler.',
		to: '/docs/guides/api-validation',
		chips: ['zod', 'BadRequestError'],
	},
	{
		name: '@rtorcato/api-response',
		tagline: 'Responses',
		desc: 'Consistent success-response envelope for JSON APIs — the success-path counterpart to api-errors.',
		to: '/docs/guides/api-response',
		chips: ['envelope'],
	},
	{
		name: '@rtorcato/api-config',
		tagline: 'Config',
		desc: 'Load and validate environment variables with dotenv + zod at startup, failing fast on bad config.',
		to: '/docs/guides/api-config',
		chips: ['dotenv', 'zod'],
	},
	{
		name: '@rtorcato/api-logger',
		tagline: 'Logging',
		desc: 'Pino logger factory — pretty output in development, structured JSON in production.',
		to: '/docs/guides/api-logger',
		chips: ['pino'],
	},
	{
		name: '@rtorcato/api-cors-express',
		tagline: 'CORS',
		desc: 'Opinionated CORS middleware for Express with sane defaults and a small config surface.',
		to: '/docs/guides/api-cors-express',
		chips: ['Express'],
	},
	{
		name: '@rtorcato/api-express-utils',
		tagline: 'Express utils',
		desc: 'Small Express helpers — client IP extraction and route listing for boot-time logging.',
		to: '/docs/guides/api-express-utils',
		chips: ['getIP', 'logRoutes'],
	},
	{
		name: '@rtorcato/api-testing',
		tagline: 'Testing',
		desc: 'Helpers for testing Express and Hono routes against the shared error and response contract.',
		to: '/docs/guides/testing',
		chips: ['Express', 'Hono'],
	},
]

type Example = {
	label: string
	file: string
	language: string
	code: string
}

const EXAMPLES: Example[] = [
	{
		label: 'Express',
		file: 'server.ts',
		language: 'tsx',
		code: `import { loadEnv } from '@rtorcato/api-config'
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler } from '@rtorcato/api-errors-express'
import { ok } from '@rtorcato/api-response'
import { validate } from '@rtorcato/api-validation'
import { z } from 'zod'

const env = loadEnv(z.object({ PORT: z.coerce.number().default(3000) }))

app.post('/users', (req, res) => {
  const body = validate(z.object({ name: z.string() }), req.body)
  res.status(201).json(ok(body))
})

app.get('/users/:id', (req, res) => {
  throw new NotFoundError('User not found')
})

app.use(errorHandler())`,
	},
	{
		label: 'Hono',
		file: 'server.ts',
		language: 'tsx',
		code: `import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler } from '@rtorcato/api-errors-hono'
import { ok } from '@rtorcato/api-response'
import { validate } from '@rtorcato/api-validation'
import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

app.post('/users', async (c) => {
  const body = validate(z.object({ name: z.string() }), await c.req.json())
  return c.json(ok(body), 201)
})

app.get('/users/:id', () => {
  throw new NotFoundError('User not found')
})

app.onError(errorHandler())`,
	},
	{
		label: 'Auth',
		file: 'auth.ts',
		language: 'tsx',
		code: `import { signToken, verifyToken } from '@rtorcato/api-auth'
import { requireAuth } from '@rtorcato/api-auth-express'

const token = signToken({ sub: user.id }, env.JWT_SECRET, {
  expiresIn: '1h',
})

// Reject anything without a valid bearer token, then read the claims.
app.get('/me', requireAuth(env.JWT_SECRET), (req, res) => {
  res.json(ok({ userId: req.auth.sub }))
})

const claims = verifyToken(token, env.JWT_SECRET)`,
	},
	{
		label: 'OpenAPI',
		file: 'docs.ts',
		language: 'tsx',
		code: `import { buildOpenApiDocument } from '@rtorcato/api-openapi'
import { serveApiDocs } from '@rtorcato/api-openapi-express'
import { z } from 'zod'

const User = z.object({ id: z.uuid(), name: z.string(), email: z.email() })

// The same Zod schemas you validate with generate the spec — no drift.
const spec = buildOpenApiDocument({
  info: { title: 'Users API', version: '1.0.0' },
  routes: [
    {
      method: 'post',
      path: '/users',
      request: { body: User.pick({ name: true, email: true }) },
      responses: { 201: { description: 'Created', schema: User } },
    },
  ],
})

app.use('/docs', serveApiDocs(spec)) // → renders the Scalar UI below ↓`,
	},
]

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
					Reusable, framework-agnostic building blocks for Node.js APIs — errors, auth, rate
					limiting, validation, config, logging, and OpenAPI docs, with Express and Hono adapters.
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
						<Link className={clsx('button button--lg', styles.ctaSecondary)} to="/docs/">
							Browse the docs
						</Link>
						<Link className={clsx('button button--lg', styles.ctaSecondary)} to="/openapi-demo">
							See API docs ↗
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
			<Tabs className={styles.codeTabs} groupId="hero-example">
				{EXAMPLES.map((ex) => (
					<TabItem key={ex.label} value={ex.label} label={ex.label}>
						<div className={styles.codeFile}>{ex.file}</div>
						<CodeBlock language={ex.language} className={styles.codePre}>
							{ex.code}
						</CodeBlock>
					</TabItem>
				))}
			</Tabs>
		</div>
	)
}

function OpenApiShowcase(): ReactElement {
	return (
		<section className={styles.section}>
			<div className={styles.showcase}>
				<div className={styles.showcaseText}>
					<div className={styles.eyebrow}>OpenAPI</div>
					<h2 className={styles.h2}>Docs that can't drift</h2>
					<p className={styles.sub}>
						Build an OpenAPI 3.1 document from the same Zod schemas you validate requests with, then
						serve a Scalar or Swagger UI on Express or Hono. Change a schema and the reference
						changes with it — no hand-written spec to fall out of sync.
					</p>
					<ul className={styles.showcaseList}>
						<li>Schema-first — one source for validation and docs</li>
						<li>Scalar &amp; Swagger UI, Express &amp; Hono adapters</li>
						<li>
							<code>ts-rest</code> contracts render docs out of the box
						</li>
					</ul>
					<div className={styles.demoLinks}>
						<Link className={styles.viewAll} to="/openapi-demo">
							Open the live demo →
						</Link>
						<Link className={styles.demoTextLink} to="/docs/guides/api-openapi">
							OpenAPI guide ↗
						</Link>
					</div>
				</div>
				<div className={styles.showcasePreview}>
					<ScalarFrame height={440} />
				</div>
			</div>
		</section>
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
					<h2 className={styles.h2}>One toolkit, one contract</h2>
					<p className={styles.sub}>
						Install only the pieces you need — each package is independent, with framework adapters
						as peer deps.
					</p>
				</div>
				<Link className={styles.viewAll} to="/docs/guides/installation">
					Browse the guides →
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
	/** Each project's brand hue (brightened for the dark card), used to tint the card title. */
	accent: string
}

const SIBLINGS: Sibling[] = [
	{
		name: '@rtorcato/browser-common',
		tagline:
			'Tree-shakeable TypeScript wrappers around 40+ browser Web APIs — one subpath per spec.',
		href: 'https://rtorcato.github.io/browser-common/',
		dest: 'Docs',
		accent: '#58a6ff',
	},
	{
		name: '@rtorcato/js-common',
		tagline: 'Tree-shakeable TypeScript utilities — tiny bundles, full type safety, CLI included.',
		href: 'https://rtorcato.github.io/js-common/',
		dest: 'Docs',
		accent: '#f2cc60',
	},
	{
		name: '@rtorcato/js-tooling',
		tagline: 'Shared Biome, TypeScript and Vitest presets that power the @rtorcato/* family.',
		href: 'https://rtorcato.github.io/js-tooling/',
		dest: 'Docs',
		accent: '#34d399',
	},
	{
		name: '@rtorcato/db-common',
		tagline: 'Shared, tree-shakeable TypeScript database utilities for Node projects.',
		href: 'https://rtorcato.github.io/db-common/',
		dest: 'Docs',
		accent: '#a78bfa',
	},
	{
		name: '@rtorcato/cf-common',
		tagline: 'Common helpers for Cloudflare developers — Workers, Pages, and the edge runtime.',
		href: 'https://rtorcato.github.io/cf-common/',
		dest: 'Docs',
		accent: '#f6821f',
	},
	{
		name: '@rtorcato/react-common',
		tagline: 'Published React 19 component library — shared UI primitives.',
		href: 'https://github.com/rtorcato/react-common',
		dest: 'GitHub',
		accent: '#818cf8',
	},
	{
		name: '@rtorcato/swift-common',
		tagline: 'SwiftUI package of reusable views and helpers to build apps faster.',
		href: 'https://rtorcato.github.io/swift-common/',
		dest: 'Docs',
		accent: '#ff6f4d',
	},
	{
		name: '@rtorcato/db-common',
		tagline: 'Shared, tree-shakeable TypeScript database utilities for Node projects.',
		href: 'https://rtorcato.github.io/db-common/',
		dest: 'Docs',
		accent: '#a78bfa',
	},
	{
		name: '@rtorcato/cf-common',
		tagline: 'Common helpers for Cloudflare developers — Workers, Pages, and the edge runtime.',
		href: 'https://rtorcato.github.io/cf-common/',
		dest: 'Docs',
		accent: '#f6821f',
	},
	{
		name: '@rtorcato/react-common',
		tagline: 'Published React 19 component library — shared UI primitives.',
		href: 'https://github.com/rtorcato/react-common',
		dest: 'GitHub',
		accent: '#818cf8',
	},
	{
		name: '@rtorcato/swift-common',
		tagline: 'SwiftUI package of reusable views and helpers to build apps faster.',
		href: 'https://rtorcato.github.io/swift-common/',
		dest: 'Docs',
		accent: '#ff6f4d',
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
							<div className={styles.cardName} style={{ color: s.accent }}>
								{s.name}
							</div>
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
			description="Reusable, framework-agnostic building blocks for Node.js APIs — errors, auth, rate limiting, validation, config, logging, and OpenAPI docs, with Express and Hono adapters."
		>
			<main>
				<Hero />
				<Pillars />
				<OpenApiShowcase />
				<Packages />
				<Siblings />
			</main>
		</Layout>
	)
}
