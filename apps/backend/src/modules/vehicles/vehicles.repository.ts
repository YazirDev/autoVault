import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateVehicleDto, UpdateVehicleDto } from '@autovault/validators'

@Injectable()
export class VehiclesRepository {
  constructor(private prisma: PrismaService) {}

  findAllByUser(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  findOneByUser(id: string, userId: string) {
    return this.prisma.vehicle.findFirst({
      where: { id, userId },
    })
  }

  create(userId: string, data: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: { ...data, userId },
    })
  }

  update(id: string, data: UpdateVehicleDto) {
    return this.prisma.vehicle.update({
      where: { id },
      data,
    })
  }

  delete(id: string) {
    return this.prisma.vehicle.delete({
      where: { id },
    })
  }
}