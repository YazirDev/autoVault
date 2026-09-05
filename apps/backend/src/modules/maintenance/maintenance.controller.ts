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
import { MaintenanceService } from './maintenance.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import {
  CreateMaintenanceSchema,
  UpdateMaintenanceSchema,
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
} from '@autovault/validators'
import { JwtPayload } from '@autovault/types'

@Controller('maintenance')
@UseGuards(JwtAuthGuard)
export class MaintenanceController {
  constructor(private service: MaintenanceService) {}

  // GET /maintenance — todos los mantenimientos del usuario
  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAllByUser(user.sub)
  }

  // GET /maintenance/upcoming?days=30
  @Get('upcoming')
  findUpcoming(
    @Query('days') days: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.findUpcoming(user.sub, days ? parseInt(days) : 30)
  }

  // GET /maintenance/vehicle/:vehicleId
  @Get('vehicle/:vehicleId')
  findByVehicle(
    @Param('vehicleId') vehicleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.findAllByVehicle(vehicleId, user.sub)
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
    @Body(new ZodValidationPipe(CreateMaintenanceSchema))
    dto: CreateMaintenanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(user.sub, dto)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateMaintenanceSchema))
    dto: UpdateMaintenanceDto,
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