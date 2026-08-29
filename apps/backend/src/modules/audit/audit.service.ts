import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

interface AuditLogInput {
  userId: string
  action: string
  entity?: string
  entityId?: string
  metadata?: Record<string, unknown>
  ip?: string
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name)

  constructor(private prisma: PrismaService) {}

  // El try/catch es intencional — un fallo en el log
  // de auditoría nunca debe interrumpir la operación principal
  async log(input: AuditLogInput): Promise<void> {
    try {
      await this.prisma.auditLog.create({ data: input })
    } catch (err) {
      this.logger.error('Error guardando audit log', err)
    }
  }
}