import { z } from 'zod'

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3001),

  // Base de datos
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),

  // JWT — usamos RS256 (asimétrico) en lugar de HS256
  // Más seguro porque la clave privada solo vive en el backend
  JWT_PRIVATE_KEY: z.string().min(1),
  JWT_PUBLIC_KEY: z.string().min(1),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),

  // CORS — solo acepta requests desde el origen de Tauri
  ALLOWED_ORIGIN: z.string().default('tauri://localhost'),
})

export type AppConfig = z.infer<typeof EnvSchema>

export function appConfig(config: Record<string, unknown>): AppConfig {
  const result = EnvSchema.safeParse(config)

  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n')

    throw new Error(`Variables de entorno inválidas:\n${missing}`)
  }

  return result.data
}