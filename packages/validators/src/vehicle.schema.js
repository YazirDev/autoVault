"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVehicleSchema = exports.CreateVehicleSchema = void 0;
const zod_1 = require("zod");
const currentYear = new Date().getFullYear();
exports.CreateVehicleSchema = zod_1.z.object({
    brand: zod_1.z.string().min(1).max(50),
    model: zod_1.z.string().min(1).max(50),
    year: zod_1.z.number().int().min(1900).max(currentYear + 1),
    licensePlate: zod_1.z.string().min(1).max(20),
    fuelType: zod_1.z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID']),
    currentKm: zod_1.z.number().int().min(0),
    purchaseDate: zod_1.z.coerce.date().optional(),
});
exports.UpdateVehicleSchema = exports.CreateVehicleSchema.partial();
//# sourceMappingURL=vehicle.schema.js.map