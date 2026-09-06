import { Test, TestingModule } from '@nestjs/testing'
import { ReportsService } from './reports.service'
import { PrismaService } from '../../prisma/prisma.service'

const mockPrisma = {
  expense: {
    findMany:  jest.fn(),
    aggregate: jest.fn(),
    groupBy:   jest.fn(),
  },
  vehicle: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
}

describe('ReportsService', () => {
  let service: ReportsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<ReportsService>(ReportsService)
    jest.clearAllMocks()
  })

  describe('getMonthlySummary', () => {
    it('devuelve 12 meses aunque no haya datos', async () => {
      mockPrisma.expense.findMany.mockResolvedValue([])
      const result = await service.getMonthlySummary('user-1', 2026)
      expect(result).toHaveLength(12)
      expect(result[0]).toEqual({ month: 1, total: 0 })
      expect(result[11]).toEqual({ month: 12, total: 0 })
    })

    it('agrupa los gastos por mes correctamente', async () => {
      mockPrisma.expense.findMany.mockResolvedValue([
        { amount: 10000, date: new Date('2026-01-15'), category: 'FUEL' },
        { amount: 20000, date: new Date('2026-01-20'), category: 'MAINTENANCE' },
        { amount: 15000, date: new Date('2026-03-10'), category: 'FUEL' },
      ])
      const result = await service.getMonthlySummary('user-1', 2026)
      expect(result[0]!.total).toBe(30000)  // Enero
      expect(result[1]!.total).toBe(0)       // Febrero
      expect(result[2]!.total).toBe(15000)  // Marzo
    })
  })

  describe('getCostPerKm', () => {
    it('devuelve null si el vehículo no existe', async () => {
      mockPrisma.vehicle.findFirst.mockResolvedValue(null)
      mockPrisma.expense.aggregate.mockResolvedValue({ _sum: { amount: null } })
      const result = await service.getCostPerKm('user-1', 'vehicle-x')
      expect(result).toBeNull()
    })

    it('calcula el costo por km correctamente', async () => {
      mockPrisma.vehicle.findFirst.mockResolvedValue({
        currentKm: 50000,
        purchaseDate: null,
      })
      mockPrisma.expense.aggregate.mockResolvedValue({
        _sum: { amount: 500000 },
      })
      const result = await service.getCostPerKm('user-1', 'vehicle-1')
      expect(result?.costPerKm).toBe(10)
    })

    it('devuelve costPerKm de 0 si el km es 0', async () => {
      mockPrisma.vehicle.findFirst.mockResolvedValue({
        currentKm: 0,
        purchaseDate: null,
      })
      mockPrisma.expense.aggregate.mockResolvedValue({
        _sum: { amount: 100000 },
      })
      const result = await service.getCostPerKm('user-1', 'vehicle-1')
      expect(result?.costPerKm).toBe(0)
    })
  })
})