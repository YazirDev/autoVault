import { z } from 'zod'

export const CreateExpenseSchema = z.object({
  vehicleId: z.string().uuid(),
  category: z.enum([
    'FUEL',
    'MAINTENANCE',
    'INSURANCE',
    'TAX',
    'REPAIR',
    'PARKING',
    'TOLL',
    'OTHER',
  ]),
  amount: z.number().positive().max(999_999),
  description: z.string().max(500).optional(),
  date: z.coerce.date(),
  km: z.number().int().min(0).optional(),
  receiptUrl: z.string().url().optional(),
})

export const UpdateExpenseSchema = CreateExpenseSchema.partial()

export type CreateExpenseDto = z.infer<typeof CreateExpenseSchema>
export type UpdateExpenseDto = z.infer<typeof UpdateExpenseSchema>