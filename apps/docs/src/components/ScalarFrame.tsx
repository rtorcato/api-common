import useBaseUrl from '@docusaurus/useBaseUrl'
import type { ReactElement } from 'react'
import styles from './ScalarFrame.module.css'

type ScalarFrameProps = {
	/** Iframe height in px. */
	height?: number
	/** Defer loading until scrolled near (homepage preview). Off for the dedicated demo page. */
	lazy?: boolean
}

/**
 * A browser-chrome frame around the live Scalar reference (static/openapi-demo.html).
 * The iframe isolates Scalar's CDN bundle so it never weighs on the host page's JS.
 */
export default function ScalarFrame({ height = 460, lazy = true }: ScalarFrameProps): ReactElement {
	const src = useBaseUrl('/openapi-scalar/')
	return (
		<div className={styles.frame}>
			<div className={styles.bar} aria-hidden>
				<span className={styles.dot} />
				<span className={styles.dot} />
				<span className={styles.dot} />
				<span className={styles.url}>Users API · Scalar reference</span>
			</div>
			<iframe
				className={styles.iframe}
				src={src}
				title="Users API — Scalar reference"
				style={{ height }}
				loading={lazy ? 'lazy' : undefined}
			/>
		</div>
	)
}
