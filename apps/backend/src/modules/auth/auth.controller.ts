import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from './auth.service'
import { Public } from '../../common/decorators/public.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import {
  GoogleCallbackSchema,
  RefreshTokenSchema,
} from '@autovault/validators'
import { JwtPayload } from '@autovault/types'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint público — recibe el code de Google después del login
  // Tauri abre el browser, el usuario aprueba, Google devuelve
  // el code a un servidor local temporal y Tauri lo envía aquí
  @Public()
  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  async googleCallback(
    @Body(new ZodValidationPipe(GoogleCallbackSchema))
    body: { code: string; state: string },
    @Req() req: Request,
  ) {
    const tokens = await this.authService.handleGoogleCallback(
      body.code,
      req.ip,
    )
    return { success: true, data: tokens }
  }

  // Endpoint público — renueva el access token
  // El refresh token viene del keychain nativo de Tauri
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema))
    body: { refreshToken: string },
  ) {
    // Decodifica el userId del payload sin verificar la firma
    // La verificación real la hace argon2.verify en el servicio
    const payload = JSON.parse(
      Buffer.from(
        body.refreshToken.split('.')[1] ?? '',
        'base64url',
      ).toString(),
    ) as JwtPayload

    const tokens = await this.authService.refreshTokens(
      payload.sub,
      body.refreshToken,
    )
    return { success: true, data: tokens }
  }

  // Endpoint privado — requiere JWT válido
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
  ) {
    await this.authService.logout(user.sub, req.ip)
    return { success: true }
  }
}