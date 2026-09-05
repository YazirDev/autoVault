import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { VehiclesRepository } from './vehicles.repository'
import { AuditService } from '../audit/audit.service'
import { CreateVehicleDto, UpdateVehicleDto } from '@autovault/validators'
import { AUDIT_ACTIONS } from '@autovault/constants'

@Injectable()
export class VehiclesService {
  constructor(
    private repo: VehiclesRepository,
    private audit: AuditService,
  ) {}

  findAll(userId: string) {
    return this.repo.findAllByUser(userId)
  }

  // Ownership check — si el vehículo no existe O no pertenece
  // al usuario devuelve 404. No decimos "no tienes permiso"
  // porque eso revelaría que el vehículo existe
  async findOne(id: string, userId: string) {
    const vehicle = await this.repo.findOneByUser(id, userId)
    if (!vehicle) throw new NotFoundException('Vehículo no encontrado')
    return vehicle
  }

  async create(userId: string, dto: CreateVehicleDto) {
    const vehicle = await this.repo.create(userId, dto)
    await this.audit.log({
      userId,
      action: AUDIT_ACTIONS.CREATE_VEHICLE,
      entity: 'Vehicle',
      entityId: vehicle.id,
    })
    return vehicle
  }

  async update(id: string, userId: string, dto: UpdateVehicleDto) {
    // Primero verifica que el vehículo pertenece al usuario
    await this.findOne(id, userId)
    return this.repo.update(id, dto)
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId)
    await this.repo.delete(id)
    await this.audit.log({
      userId,
      action: AUDIT_ACTIONS.DELETE_VEHICLE,
      entity: 'Vehicle',
      entityId: id,
    })
  }
}