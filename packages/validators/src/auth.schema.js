"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenSchema = exports.GoogleCallbackSchema = void 0;
const zod_1 = require("zod");
exports.GoogleCallbackSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
    state: zod_1.z.string().min(1),
});
exports.RefreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
//# sourceMappingURL=auth.schema.js.map