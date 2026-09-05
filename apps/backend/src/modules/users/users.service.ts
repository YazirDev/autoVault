import { Injectable, NotFoundException } from '@nestjs/common'
import { UsersRepository } from './users.repository'
import { UpdateUserDto } from '@autovault/validators'

@Injectable()
export class UsersService {
  constructor(private repo: UsersRepository) {}

  async findMe(userId: string) {
    const user = await this.repo.findById(userId)
    if (!user) throw new NotFoundException('Usuario no encontrado')
    return user
  }

  async updateMe(userId: string, dto: UpdateUserDto) {
    await this.findMe(userId)
    return this.repo.update(userId, dto)
  }
}