import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ERROR_CODES } from '@autovault/constants'

// @Catch() sin argumentos atrapa CUALQUIER error no manejado
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Error interno del servidor'

    // Solo loguea el stack trace en errores 500
    // Los 400 son errores del cliente, no necesitan stack
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : String(exception),
      )
    }

    // Todas las respuestas de error tienen este mismo formato
    response.status(status).json({
      success: false,
      errorCode: status >= 500 ? ERROR_CODES.INTERNAL : ERROR_CODES.VALIDATION,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}