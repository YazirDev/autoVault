export interface JwtPayload {
    sub: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface GoogleUserInfo {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
}
//# sourceMappingURL=auth.types.d.ts.map