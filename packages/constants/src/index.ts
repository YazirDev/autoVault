// ─── JWT ────────────────────────────────────────────────────
export const JWT_ACCESS_EXPIRY = '15m'
export const JWT_REFRESH_EXPIRY = '7d'

// ─── Rate limiting ──────────────────────────────────────────
// Máximo 100 requests por minuto por IP
export const RATE_LIMIT_TTL = 60
export const RATE_LIMIT_MAX = 100

// ─── Códigos de error ───────────────────────────────────────
// Prefijo AV para identificar que vienen de AutoVault
export const ERROR_CODES = {
  UNAUTHORIZED: 'AV_401',
  FORBIDDEN: 'AV_403',
  NOT_FOUND: 'AV_404',
  VALIDATION: 'AV_422',
  INTERNAL: 'AV_500',
} as const

// ─── Acciones de auditoría ──────────────────────────────────
// Cada acción importante queda registrada con estos nombres
export const AUDIT_ACTIONS = {
  LOGIN: 'AUTH_LOGIN',
  LOGOUT: 'AUTH_LOGOUT',
  CREATE_VEHICLE: 'VEHICLE_CREATE',
  DELETE_VEHICLE: 'VEHICLE_DELETE',
  CREATE_EXPENSE: 'EXPENSE_CREATE',
  DELETE_EXPENSE: 'EXPENSE_DELETE',
  EXPORT_REPORT: 'REPORT_EXPORT',
} as const