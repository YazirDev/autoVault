import { Module } from '@nestjs/common'
import { ExpensesController } from './expenses.controller'
import { ExpensesService } from './expenses.service'
import { ExpensesRepository } from './expenses.repository'
import { AuditModule } from '../audit/audit.module'

@Module({
  imports: [AuditModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpensesRepository],
  exports: [ExpensesService],
})
export class ExpensesModule {}