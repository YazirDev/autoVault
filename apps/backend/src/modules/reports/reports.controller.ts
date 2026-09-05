import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { JwtPayload } from '@autovault/types'

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private service: ReportsService) {}

  // GET /reports/monthly?year=2024
  @Get('monthly')
  getMonthlySummary(
    @Query('year') year: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const targetYear = year
      ? parseInt(year)
      : new Date().getFullYear()
    return this.service.getMonthlySummary(user.sub, targetYear)
  }

  // GET /reports/vehicles — comparativa entre vehículos
  @Get('vehicles')
  getVehicleComparison(@CurrentUser() user: JwtPayload) {
    return this.service.getVehicleComparison(user.sub)
  }

  // GET /reports/cost-per-km/:vehicleId
  @Get('cost-per-km/:vehicleId')
  getCostPerKm(
    @Param('vehicleId') vehicleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.getCostPerKm(user.sub, vehicleId)
  }
}