import { z } from 'zod'

export const CreateMaintenanceSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  date: z.coerce.date(),
  km: z.number().int().min(0).optional(),
  cost: z.number().positive().max(999_999),
  nextDueKm: z.number().int().min(0).optional(),
  nextDueDate: z.coerce.date().optional(),
})

export const UpdateMaintenanceSchema = CreateMaintenanceSchema.partial()

export type CreateMaintenanceDto = z.infer<typeof CreateMaintenanceSchema>
export type UpdateMaintenanceDto = z.infer<typeof UpdateMaintenanceSchema>