import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Layout from '@theme/Layout'
import type { ReactElement } from 'react'
import ScalarFrame from '@site/src/components/ScalarFrame'
import styles from './index.module.css'

export default function OpenApiDemo(): ReactElement {
	return (
		<Layout
			title="Schema-first API docs"
			description="A live Scalar API reference rendered from an OpenAPI 3.1 document — the same shape api-common generates from your Zod schemas."
		>
			<main className={styles.section}>
				<div className={styles.demoHead}>
					<h1 className={styles.h1}>Schema-first API docs</h1>
					<p className={styles.demoSub}>
						This Scalar reference is rendered from an OpenAPI 3.1 document — the same shape{' '}
						<code>buildOpenApiDocument</code> produces from your Zod schemas. Validation and docs
						come from one source, so they can't drift.
					</p>
					<div className={styles.demoLinks}>
						<Link className={styles.viewAll} to="/docs/guides/api-openapi">
							Read the OpenAPI guide →
						</Link>
						<a
							className={styles.demoTextLink}
							href={useBaseUrl('/openapi-scalar/spec.json')}
							target="_blank"
							rel="noreferrer"
						>
							View the raw spec ↗
						</a>
					</div>
				</div>
				<ScalarFrame height={760} lazy={false} />
			</main>
		</Layout>
	)
}
