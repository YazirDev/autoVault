import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateUserDto } from '@autovault/validators'

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
        // Nunca devolvemos googleId ni refreshToken
      },
    })
  }

  update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}