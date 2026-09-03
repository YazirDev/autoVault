import { Injectable, NotFoundException } from '@nestjs/common'
import { ExpensesRepository } from './expenses.repository'
import { AuditService } from '../audit/audit.service'
import { CreateExpenseDto, UpdateExpenseDto } from '@autovault/validators'
import { AUDIT_ACTIONS } from '@autovault/constants'

@Injectable()
export class ExpensesService {
  constructor(
    private repo: ExpensesRepository,
    private audit: AuditService,
  ) {}

  findAllByUser(userId: string) {
    return this.repo.findAllByUser(userId)
  }

  findAllByVehicle(vehicleId: string, userId: string) {
    return this.repo.findAllByVehicle(vehicleId, userId)
  }

  async findOne(id: string, userId: string) {
    const expense = await this.repo.findOneByUser(id, userId)
    if (!expense) throw new NotFoundException('Gasto no encontrado')
    return expense
  }

  async create(userId: string, dto: CreateExpenseDto) {
    const expense = await this.repo.create(userId, dto)
    await this.audit.log({
      userId,
      action: AUDIT_ACTIONS.CREATE_EXPENSE,
      entity: 'Expense',
      entityId: expense.id,
    })
    return expense
  }

  async update(id: string, userId: string, dto: UpdateExpenseDto) {
    await this.findOne(id, userId)
    return this.repo.update(id, dto)
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId)
    await this.repo.delete(id)
    await this.audit.log({
      userId,
      action: AUDIT_ACTIONS.DELETE_EXPENSE,
      entity: 'Expense',
      entityId: id,
    })
  }

  getSummary(userId: string, from: Date, to: Date) {
    return this.repo.sumByUserAndDateRange(userId, from, to)
  }

  getCategoryBreakdown(userId: string) {
    return this.repo.groupByCategory(userId)
  }
}