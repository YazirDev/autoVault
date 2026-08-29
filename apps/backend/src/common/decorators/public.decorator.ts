import { SetMetadata } from '@nestjs/common'
import { IS_PUBLIC_KEY } from '../guards/jwt-auth.guard'

// Uso: @Public() encima de cualquier controlador o método
// Ejemplo: el endpoint de login debe ser público
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)