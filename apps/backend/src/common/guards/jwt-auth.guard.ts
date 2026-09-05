import {
  Injectable,
  ExecutionContext,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs/internal/Observable'


export const IS_PUBLIC_KEY = 'isPublic'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  override canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Revisa si el endpoint tiene el decorador @Public()
    // Si lo tiene, deja pasar el request sin validar el token
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    // Si no es público, valida el JWT normalmente
    return super.canActivate(context)
  }
}