export declare const JWT_ACCESS_EXPIRY = "15m";
export declare const JWT_REFRESH_EXPIRY = "7d";
export declare const RATE_LIMIT_TTL = 60;
export declare const RATE_LIMIT_MAX = 100;
export declare const ERROR_CODES: {
    readonly UNAUTHORIZED: "AV_401";
    readonly FORBIDDEN: "AV_403";
    readonly NOT_FOUND: "AV_404";
    readonly VALIDATION: "AV_422";
    readonly INTERNAL: "AV_500";
};
export declare const AUDIT_ACTIONS: {
    readonly LOGIN: "AUTH_LOGIN";
    readonly LOGOUT: "AUTH_LOGOUT";
    readonly CREATE_VEHICLE: "VEHICLE_CREATE";
    readonly DELETE_VEHICLE: "VEHICLE_DELETE";
    readonly CREATE_EXPENSE: "EXPENSE_CREATE";
    readonly DELETE_EXPENSE: "EXPENSE_DELETE";
    readonly EXPORT_REPORT: "REPORT_EXPORT";
};
//# sourceMappingURL=index.d.ts.map