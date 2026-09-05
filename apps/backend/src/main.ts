import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import { GlobalExceptionFilter } from './common/filters/global-exception.filter'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // Solo muestra errores y advertencias en producción
    logger: ['error', 'warn', 'log'],
  })

  // Helmet agrega headers de seguridad HTTP automáticamente:
  // X-Frame-Options, X-XSS-Protection, HSTS, CSP, etc.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
    }),
  )

  // CORS — solo acepta requests desde Tauri
  // En desarrollo también acepta localhost:1420
  app.enableCors({
  origin:
    process.env.NODE_ENV === 'development'
      ? ['tauri://localhost', 'http://localhost:1420']
      : (process.env.ALLOWED_ORIGIN ?? 'tauri://localhost'),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

  // Prefijo global para todas las rutas
  // Todos los endpoints quedan en /api/v1/...
  app.setGlobalPrefix('api/v1')

  // Registra el filtro y el interceptor globalmente
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())

  const port = process.env.PORT ?? 3001
  await app.listen(port)

  console.log(`Backend corriendo en http://localhost:${port}/api/v1`)
}

bootstrap()