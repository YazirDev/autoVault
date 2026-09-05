import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { UpdateUserSchema, UpdateUserDto } from '@autovault/validators'
import { JwtPayload } from '@autovault/types'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private service: UsersService) {}

  // GET /users/me — perfil del usuario autenticado
  @Get('me')
  findMe(@CurrentUser() user: JwtPayload) {
    return this.service.findMe(user.sub)
  }

  // PATCH /users/me — actualiza nombre o foto
  @Patch('me')
  updateMe(
    @Body(new ZodValidationPipe(UpdateUserSchema))
    dto: UpdateUserDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.service.updateMe(user.sub, dto)
  }
}