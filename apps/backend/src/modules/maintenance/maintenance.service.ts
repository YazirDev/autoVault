import { Injectable, NotFoundException } from '@nestjs/common'
import { MaintenanceRepository } from './maintenance.repository'
import { AuditService } from '../audit/audit.service'
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from '@autovault/validators'

@Injectable()
export class MaintenanceService {
  constructor(
    private repo: MaintenanceRepository,
    private audit: AuditService,
  ) {}

  findAllByUser(userId: string) {
    return this.repo.findAllByUser(userId)
  }

  findAllByVehicle(vehicleId: string, userId: string) {
    return this.repo.findAllByVehicle(vehicleId, userId)
  }

  async findOne(id: string, userId: string) {
    const maintenance = await this.repo.findOneByUser(id, userId)
    if (!maintenance) {
      throw new NotFoundException('Mantenimiento no encontrado')
    }
    return maintenance
  }

  // Devuelve mantenimientos próximos en los siguientes N días
  // Por defecto 30 días — configurable desde el controlador
  findUpcoming(userId: string, withinDays = 30) {
    return this.repo.findUpcoming(userId, withinDays)
  }

  async create(userId: string, dto: CreateMaintenanceDto) {
    const maintenance = await this.repo.create(userId, dto)
    await this.audit.log({
      userId,
      action: 'MAINTENANCE_CREATE',
      entity: 'Maintenance',
      entityId: maintenance.id,
    })
    return maintenance
  }

  async update(id: string, userId: string, dto: UpdateMaintenanceDto) {
    await this.findOne(id, userId)
    return this.repo.update(id, dto)
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId)
    await this.repo.delete(id)
    await this.audit.log({
      userId,
      action: 'MAINTENANCE_DELETE',
      entity: 'Maintenance',
      entityId: id,
    })
  }
}