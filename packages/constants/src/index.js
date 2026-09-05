"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUDIT_ACTIONS = exports.ERROR_CODES = exports.RATE_LIMIT_MAX = exports.RATE_LIMIT_TTL = exports.JWT_REFRESH_EXPIRY = exports.JWT_ACCESS_EXPIRY = void 0;
// ─── JWT ────────────────────────────────────────────────────
exports.JWT_ACCESS_EXPIRY = '15m';
exports.JWT_REFRESH_EXPIRY = '7d';
// ─── Rate limiting ──────────────────────────────────────────
// Máximo 100 requests por minuto por IP
exports.RATE_LIMIT_TTL = 60;
exports.RATE_LIMIT_MAX = 100;
// ─── Códigos de error ───────────────────────────────────────
// Prefijo AV para identificar que vienen de AutoVault
exports.ERROR_CODES = {
    UNAUTHORIZED: 'AV_401',
    FORBIDDEN: 'AV_403',
    NOT_FOUND: 'AV_404',
    VALIDATION: 'AV_422',
    INTERNAL: 'AV_500',
};
// ─── Acciones de auditoría ──────────────────────────────────
// Cada acción importante queda registrada con estos nombres
exports.AUDIT_ACTIONS = {
    LOGIN: 'AUTH_LOGIN',
    LOGOUT: 'AUTH_LOGOUT',
    CREATE_VEHICLE: 'VEHICLE_CREATE',
    DELETE_VEHICLE: 'VEHICLE_DELETE',
    CREATE_EXPENSE: 'EXPENSE_CREATE',
    DELETE_EXPENSE: 'EXPENSE_DELETE',
    EXPORT_REPORT: 'REPORT_EXPORT',
};
//# sourceMappingURL=index.js.map