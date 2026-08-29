import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ZodSchema } from 'zod'

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema?: ZodSchema) {}

  transform(value: unknown) {
    // Si no se pasa schema simplemente deja pasar el valor
    // Útil cuando se usa el pipe globalmente pero algún
    // endpoint no necesita validación
    if (!this.schema) return value

    const result = this.schema.safeParse(value)

    if (!result.success) {
      throw new BadRequestException({
        message: 'Datos de entrada inválidos',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      })
    }

    // Devuelve los datos ya parseados y transformados por Zod
    // Por ejemplo z.coerce.date() convierte el string a Date aquí
    return result.data
  }
}