import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { appConfig } from './config/app.config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { VehiclesModule } from './modules/vehicles/vehicles.module'
import { ExpensesModule } from './modules/expenses/expenses.module'
import { MaintenanceModule } from './modules/maintenance/maintenance.module'
import { ReportsModule } from './modules/reports/reports.module'
import { AuditModule } from './modules/audit/audit.module'
import { RATE_LIMIT_TTL, RATE_LIMIT_MAX } from '@autovault/constants'

@Module({
  imports: [
    // ConfigModule carga el .env y lo valida con Zod
    // isGlobal hace que ConfigService esté disponible en todos los módulos
    ConfigModule.forRoot({
      isGlobal: true,
      validate: appConfig,
    }),

    // ThrottlerModule aplica rate limiting globalmente
    // 100 requests por minuto por IP
    ThrottlerModule.forRoot([{
      ttl: RATE_LIMIT_TTL,
      limit: RATE_LIMIT_MAX,
    }]),

    // PrismaModule es @Global() así que no necesita
    // importarse en cada módulo individual
    PrismaModule,

    // Módulos de negocio
    AuthModule,
    UsersModule,
    VehiclesModule,
    ExpensesModule,
    MaintenanceModule,
    ReportsModule,
    AuditModule,
  ],
  providers: [
    // Registra ThrottlerGuard como guard global
    // Se aplica automáticamente a todos los endpoints
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}