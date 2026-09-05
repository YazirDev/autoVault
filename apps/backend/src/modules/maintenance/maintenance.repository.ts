import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import {
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from '@autovault/validators'

@Injectable()
export class MaintenanceRepository {
  constructor(private prisma: PrismaService) {}

  findAllByVehicle(vehicleId: string, userId: string) {
    return this.prisma.maintenance.findMany({
      where: { vehicleId, userId },
      orderBy: { date: 'desc' },
    })
  }

  findAllByUser(userId: string) {
    return this.prisma.maintenance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        vehicle: {
          select: { brand: true, model: true, licensePlate: true },
        },
      },
    })
  }

  findOneByUser(id: string, userId: string) {
    return this.prisma.maintenance.findFirst({
      where: { id, userId },
    })
  }

  // Busca mantenimientos próximos por fecha
  // Útil para enviar alertas antes de que venzan
  findUpcoming(userId: string, withinDays: number) {
    const until = new Date()
    until.setDate(until.getDate() + withinDays)

    return this.prisma.maintenance.findMany({
      where: {
        userId,
        nextDueDate: {
          gte: new Date(),
          lte: until,
        },
      },
      include: {
        vehicle: {
          select: { brand: true, model: true, licensePlate: true },
        },
      },
      orderBy: { nextDueDate: 'asc' },
    })
  }

  create(userId: string, data: CreateMaintenanceDto) {
    return this.prisma.maintenance.create({
      data: { ...data, userId },
    })
  }

  update(id: string, data: UpdateMaintenanceDto) {
    return this.prisma.maintenance.update({
      where: { id },
      data,
    })
  }

  delete(id: string) {
    return this.prisma.maintenance.delete({
      where: { id },
    })
  }
}