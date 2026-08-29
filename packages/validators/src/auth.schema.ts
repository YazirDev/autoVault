import { z } from 'zod'

export const GoogleCallbackSchema = z.object({
  code: z.string().min(1),
  state: z.string().min(1),
})

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

export type GoogleCallbackDto = z.infer<typeof GoogleCallbackSchema>
export type RefreshTokenDto = z.infer<typeof RefreshTokenSchema>