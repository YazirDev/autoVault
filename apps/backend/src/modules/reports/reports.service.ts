import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // Gasto total agrupado por mes en un año
  async getMonthlySummary(userId: string, year: number) {
    const from = new Date(year, 0, 1)
    const to = new Date(year, 11, 31)

    const expenses = await this.prisma.expense.findMany({
      where: { userId, date: { gte: from, lte: to } },
      select: { amount: true, date: true, category: true },
    })

    // Agrupa por mes manualmente para tener control total
    const byMonth: Record<number, number> = {}
    for (const expense of expenses) {
      const month = expense.date.getMonth()
      byMonth[month] = (byMonth[month] ?? 0) + Number(expense.amount)
    }

    return Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      total: byMonth[i] ?? 0,
    }))
  }

  // Costo por kilómetro de un vehículo
  // Métrica clave para saber cuánto cuesta realmente usar el auto
  async getCostPerKm(userId: string, vehicleId: string) {
    const [vehicle, expenses] = await Promise.all([
      this.prisma.vehicle.findFirst({
        where: { id: vehicleId, userId },
        select: { currentKm: true, purchaseDate: true },
      }),
      this.prisma.expense.aggregate({
        where: { vehicleId, userId },
        _sum: { amount: true },
      }),
    ])

    if (!vehicle) return null

    const totalExpenses = Number(expenses._sum.amount ?? 0)
    const km = vehicle.currentKm

    return {
      vehicleId,
      totalExpenses,
      totalKm: km,
      costPerKm: km > 0 ? Number((totalExpenses / km).toFixed(2)) : 0,
    }
  }

  // Comparativa de gastos entre todos los vehículos del usuario
  async getVehicleComparison(userId: string) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { userId },
      select: {
        id: true,
        brand: true,
        model: true,
        licensePlate: true,
        currentKm: true,
        expenses: {
          select: { amount: true, category: true },
        },
      },
    })

    return vehicles.map((v) => {
      const total = v.expenses.reduce(
        (sum, e) => sum + Number(e.amount),
        0,
      )
      return {
        vehicleId: v.id,
        label: `${v.brand} ${v.model} (${v.licensePlate})`,
        totalExpenses: total,
        currentKm: v.currentKm,
        costPerKm:
          v.currentKm > 0
            ? Number((total / v.currentKm).toFixed(2))
            : 0,
      }
    })
  }
}