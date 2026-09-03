import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateExpenseDto, UpdateExpenseDto } from '@autovault/validators'

@Injectable()
export class ExpensesRepository {
  constructor(private prisma: PrismaService) {}

  findAllByUser(userId: string) {
    return this.prisma.expense.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      include: {
        vehicle: {
          select: { brand: true, model: true, licensePlate: true },
        },
      },
    })
  }

  findAllByVehicle(vehicleId: string, userId: string) {
    return this.prisma.expense.findMany({
      where: { vehicleId, userId },
      orderBy: { date: 'desc' },
    })
  }

  findOneByUser(id: string, userId: string) {
    return this.prisma.expense.findFirst({
      where: { id, userId },
    })
  }

  create(userId: string, data: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: { ...data, userId },
    })
  }

  update(id: string, data: UpdateExpenseDto) {
    return this.prisma.expense.update({
      where: { id },
      data,
    })
  }

  delete(id: string) {
    return this.prisma.expense.delete({
      where: { id },
    })
  }

  // Suma total de gastos por usuario en un rango de fechas
  // Usado por el módulo de reportes
  sumByUserAndDateRange(userId: string, from: Date, to: Date) {
    return this.prisma.expense.aggregate({
      where: {
        userId,
        date: { gte: from, lte: to },
      },
      _sum: { amount: true },
      _count: true,
    })
  }

  // Agrupa gastos por categoría para los reportes de distribución
  groupByCategory(userId: string) {
    return this.prisma.expense.groupBy({
      by: ['category'],
      where: { userId },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    })
  }
}