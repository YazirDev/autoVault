import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { ExpensesRepository } from './expenses.repository'
import { AuditService } from '../audit/audit.service'

const mockExpense = {
  id: 'expense-1',
  vehicleId: 'vehicle-1',
  userId: 'user-1',
  category: 'FUEL',
  amount: 18500,
  description: 'Gasolina',
  date: new Date(),
  km: null,
  receiptUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockRepo = {
  findAllByUser:        jest.fn(),
  findAllByVehicle:     jest.fn(),
  findOneByUser:        jest.fn(),
  create:               jest.fn(),
  update:               jest.fn(),
  delete:               jest.fn(),
  sumByUserAndDateRange:jest.fn(),
  groupByCategory:      jest.fn(),
}

const mockAudit = { log: jest.fn() }

describe('ExpensesService', () => {
  let service: ExpensesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: ExpensesRepository, useValue: mockRepo },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile()

    service = module.get<ExpensesService>(ExpensesService)
    jest.clearAllMocks()
  })

  describe('findAllByUser', () => {
    it('devuelve todos los gastos del usuario', async () => {
      mockRepo.findAllByUser.mockResolvedValue([mockExpense])
      const result = await service.findAllByUser('user-1')
      expect(result).toEqual([mockExpense])
    })
  })

  describe('findOne', () => {
    it('devuelve el gasto si existe', async () => {
      mockRepo.findOneByUser.mockResolvedValue(mockExpense)
      const result = await service.findOne('expense-1', 'user-1')
      expect(result).toEqual(mockExpense)
    })

    it('lanza NotFoundException si no existe', async () => {
      mockRepo.findOneByUser.mockResolvedValue(null)
      await expect(service.findOne('expense-x', 'user-1'))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('crea un gasto y registra auditoría', async () => {
      const dto = {
        vehicleId: 'vehicle-1',
        category: 'FUEL',
        amount: 18500,
        date: '2026-09-05',
      }
      mockRepo.create.mockResolvedValue(mockExpense)
      const result = await service.create('user-1', dto)
      expect(result).toEqual(mockExpense)
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'EXPENSE_CREATE' })
      )
    })
  })

  describe('remove', () => {
    it('elimina el gasto y registra auditoría', async () => {
      mockRepo.findOneByUser.mockResolvedValue(mockExpense)
      mockRepo.delete.mockResolvedValue(mockExpense)
      await service.remove('expense-1', 'user-1')
      expect(mockRepo.delete).toHaveBeenCalledWith('expense-1')
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'EXPENSE_DELETE' })
      )
    })
  })

  describe('getSummary', () => {
    it('llama al repositorio con las fechas correctas', async () => {
      const from = new Date('2026-09-01')
      const to   = new Date('2026-09-30')
      mockRepo.sumByUserAndDateRange.mockResolvedValue({ _sum: { amount: 100000 }, _count: 5 })
      await service.getSummary('user-1', from, to)
      expect(mockRepo.sumByUserAndDateRange).toHaveBeenCalledWith('user-1', from, to)
    })
  })
})