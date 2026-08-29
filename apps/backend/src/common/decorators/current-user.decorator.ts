import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from '@autovault/types'

// Uso: método(@CurrentUser() user: JwtPayload)
// Devuelve el payload del JWT: { sub: userId, email }
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as JwtPayload
  },
)