import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Se ejecuta automáticamente cuando NestJS arranca el módulo
  async onModuleInit() {
    await this.$connect()
  }

  // Se ejecuta automáticamente cuando NestJS apaga el módulo
  // Evita conexiones colgadas a la base de datos
  async onModuleDestroy() {
    await this.$disconnect()
  }
}