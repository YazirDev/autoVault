import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import {
  CreateVehicleSchema,
  UpdateVehicleSchema,
  CreateVehicleDto,
  UpdateVehicleDto,
} from '@autovault/validators'
import { JwtPayload } from '@autovault/types'

// @UseGuards a nivel de clase protege TODOS los endpoints
// del controlador con JWT automáticamente
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private service: VehiclesService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.service.findAll(user.sub)
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
    @Body(new ZodValidationPipe(CreateVehicleSchema))
    dto: CreateVehicleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.create(user.sub, dto)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateVehicleSchema))
    dto: UpdateVehicleDto,
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