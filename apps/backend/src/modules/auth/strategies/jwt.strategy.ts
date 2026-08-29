import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from '@autovault/types'
import { PrismaService } from '../../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // Extrae el token del header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Usa la clave pública para verificar la firma
      // Solo el backend con la clave privada pudo haber firmado el token
      secretOrKey: config.get<string>('JWT_PUBLIC_KEY'),
      algorithms: ['RS256'],
    })
  }

  // Este método se ejecuta después de verificar la firma del token
  // Si el usuario no existe en la DB aunque el token sea válido,
  // rechazamos el request — por si el usuario fue eliminado
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    })

    if (!user) throw new UnauthorizedException()

    // Lo que retornamos aquí queda en request.user
    // y es lo que @CurrentUser() devuelve en los controladores
    return payload
  }
}