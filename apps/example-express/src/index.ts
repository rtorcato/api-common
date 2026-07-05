import { S3Client } from '@aws-sdk/client-s3'
import { loadEnv } from '@rtorcato/api-config'
import { logRoutes } from '@rtorcato/api-express-utils'
import { closeHttpServer, createShutdownController } from '@rtorcato/api-graceful-shutdown'
import { createLogger } from '@rtorcato/api-logger'
import { z } from 'zod'
import { createApp } from './app.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3001),
		LOG_LEVEL: z.string().default('info'),
		JWT_SECRET: z.string().default('dev-secret'),
		S3_ENDPOINT: z.string().default('http://localhost:9000'),
		S3_REGION: z.string().default('us-east-1'),
		S3_ACCESS_KEY: z.string().default('minioadmin'),
		S3_SECRET_KEY: z.string().default('minioadmin'),
		S3_BUCKET: z.string().default('uploads'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })

// Path-style S3 client pointing at MinIO (see docker-compose.yml).
const s3 = new S3Client({
	endpoint: env.S3_ENDPOINT,
	region: env.S3_REGION,
	forcePathStyle: true,
	credentials: { accessKeyId: env.S3_ACCESS_KEY, secretAccessKey: env.S3_SECRET_KEY },
})

const app = createApp({ log, jwtSecret: env.JWT_SECRET, s3, bucket: env.S3_BUCKET })

const server = app.listen(env.PORT, () => {
	log.info(`express example listening on :${env.PORT}`)
	log.info(`swagger UI → http://localhost:${env.PORT}/api-docs`)
	logRoutes(app)
})

const shutdown = createShutdownController({ logger: (m) => log.info(m) })
shutdown.register('http', closeHttpServer(server))
