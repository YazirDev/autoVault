"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = void 0;
const zod_1 = require("zod");
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    picture: zod_1.z.string().url().optional(),
});
//# sourceMappingURL=user.schema.js.map