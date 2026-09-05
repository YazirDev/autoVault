"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExpenseSchema = exports.CreateExpenseSchema = void 0;
const zod_1 = require("zod");
exports.CreateExpenseSchema = zod_1.z.object({
    vehicleId: zod_1.z.string().uuid(),
    category: zod_1.z.enum([
        'FUEL',
        'MAINTENANCE',
        'INSURANCE',
        'TAX',
        'REPAIR',
        'PARKING',
        'TOLL',
        'OTHER',
    ]),
    amount: zod_1.z.number().positive().max(999_999),
    description: zod_1.z.string().max(500).optional(),
    date: zod_1.z.coerce.date(),
    km: zod_1.z.number().int().min(0).optional(),
    receiptUrl: zod_1.z.string().url().optional(),
});
exports.UpdateExpenseSchema = exports.CreateExpenseSchema.partial();
//# sourceMappingURL=expense.schema.js.map