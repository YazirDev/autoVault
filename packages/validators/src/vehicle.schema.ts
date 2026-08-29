import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const CreateVehicleSchema = z.object({
  brand: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.number().int().min(1900).max(currentYear + 1),
  licensePlate: z.string().min(1).max(20),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID']),
  currentKm: z.number().int().min(0),
  purchaseDate: z.coerce.date().optional(),
})

export const UpdateVehicleSchema = CreateVehicleSchema.partial()

export type CreateVehicleDto = z.infer<typeof CreateVehicleSchema>
export type UpdateVehicleDto = z.infer<typeof UpdateVehicleSchema>