import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ExpensesService } from './expenses.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import {
  CreateExpenseSchema,
  UpdateExpenseSchema,
  CreateExpenseDto,
  UpdateExpenseDto,
} from '@autovault/validators'
import { JwtPayload } from '@autovault/types'

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private service: ExpensesService) {}

  // GET /expenses — todos los gastos del usuario
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAllByUser(user.sub)
  }

  // GET /expenses/vehicle/:vehicleId — gastos de un vehículo
  @Get('vehicle/:vehicleId')
  findByVehicle(
    @Param('vehicleId') vehicleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.findAllByVehicle(vehicleId, user.sub)
  }

  // GET /expenses/summary?from=2024-01-01&to=2024-12-31
  @Get('summary')
  getSummary(
    @Query('from') from: string,
    @Query('to') to: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.getSummary(
      user.sub,
      new Date(from),
      new Date(to),
    )
  }

  // GET /expenses/categories — distribución por categoría
  @Get('categories')
  getCategoryBreakdown(@CurrentUser() user: JwtPayload) {
    return this.service.getCategoryBreakdown(user.sub)
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.findOne(id, user.sub)
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateExpenseSchema))
    dto: CreateExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(user.sub, dto)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateExpenseSchema))
    dto: UpdateExpenseDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.update(id, user.sub, dto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.remove(id, user.sub)
  }
}