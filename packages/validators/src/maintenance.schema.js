"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMaintenanceSchema = exports.CreateMaintenanceSchema = void 0;
const zod_1 = require("zod");
exports.CreateMaintenanceSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().uuid(),
    type: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().max(500).optional(),
    date: zod_1.z.coerce.date(),
    km: zod_1.z.number().int().min(0).optional(),
    cost: zod_1.z.number().positive().max(999_999),
    nextDueKm: zod_1.z.number().int().min(0).optional(),
    nextDueDate: zod_1.z.coerce.date().optional(),
});
exports.UpdateMaintenanceSchema = exports.CreateMaintenanceSchema.partial();
//# sourceMappingURL=maintenance.schema.js.map