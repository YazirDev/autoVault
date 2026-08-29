import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'
import { AuthTokens, GoogleUserInfo } from '@autovault/types'
import {
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  AUDIT_ACTIONS,
} from '@autovault/constants'
import * as argon2 from 'argon2'
import axios from 'axios'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private audit: AuditService,
  ) {}

  // Punto de entrada principal del flujo OAuth
  // Recibe el code que Google devuelve después del login
  async handleGoogleCallback(
    code: string,
    ip?: string,
  ): Promise<AuthTokens> {
    const googleUser = await this.exchangeCodeForUser(code)
    const user = await this.upsertUser(googleUser)
    const tokens = await this.generateTokens(user.id, user.email)
    await this.saveRefreshToken(user.id, tokens.refreshToken)
    await this.audit.log({
      userId: user.id,
      action: AUDIT_ACTIONS.LOGIN,
      ip,
    })
    return tokens
  }

  // Renueva el access token usando el refresh token
  // Verifica que el refresh token coincida con el guardado en DB
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user?.refreshToken) throw new UnauthorizedException()

    // Compara el token recibido con el hash guardado en DB
    const valid = await argon2.verify(user.refreshToken, refreshToken)
    if (!valid) throw new UnauthorizedException()

    const tokens = await this.generateTokens(user.id, user.email)
    await this.saveRefreshToken(user.id, tokens.refreshToken)
    return tokens
  }

  // Cierra la sesión borrando el refresh token de la DB
  // Aunque el access token siga siendo válido 15 minutos,
  // ya no se puede renovar — el usuario queda desconectado
  async logout(userId: string, ip?: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    })
    await this.audit.log({
      userId,
      action: AUDIT_ACTIONS.LOGOUT,
      ip,
    })
  }

  // Intercambia el code de Google por información del usuario
  // Este intercambio se hace en el servidor, nunca en el cliente
  // para que el client_secret nunca quede expuesto
  private async exchangeCodeForUser(
    code: string,
  ): Promise<GoogleUserInfo> {
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: this.config.get('GOOGLE_CLIENT_ID'),
        client_secret: this.config.get('GOOGLE_CLIENT_SECRET'),
        redirect_uri: 'http://localhost:1421',
        grant_type: 'authorization_code',
      },
    )

    const userRes = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokenRes.data.access_token}`,
        },
      },
    )

    return {
      googleId: userRes.data.id,
      email: userRes.data.email,
      name: userRes.data.name,
      picture: userRes.data.picture,
    }
  }

  // Crea el usuario si no existe, o actualiza su info si ya existe
  // upsert = update + insert en una sola operación atómica
  private async upsertUser(googleUser: GoogleUserInfo) {
    return this.prisma.user.upsert({
      where: { googleId: googleUser.googleId },
      update: {
        name: googleUser.name,
        picture: googleUser.picture,
      },
      create: {
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
    })
  }

  // Genera el par de tokens JWT firmados con RS256
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload = { sub: userId, email }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: JWT_ACCESS_EXPIRY,
        algorithm: 'RS256',
      }),
      this.jwt.signAsync(payload, {
        expiresIn: JWT_REFRESH_EXPIRY,
        algorithm: 'RS256',
      }),
    ])

    return { accessToken, refreshToken }
  }

  // Hashea el refresh token con Argon2 antes de guardarlo
  // Si la DB es comprometida, los refresh tokens no sirven
  private async saveRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashed = await argon2.hash(refreshToken)
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    })
  }
}