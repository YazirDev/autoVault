import { Test, TestingModule } from '@nestjs/testing'
import { AuditService } from './audit.service'
import { PrismaService } from '../../prisma/prisma.service'

const mockPrisma = {
  auditLog: {
    create: jest.fn(),
  },
}

describe('AuditService', () => {
  let service: AuditService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile()

    service = module.get<AuditService>(AuditService)
    jest.clearAllMocks()
  })

  describe('log', () => {
    it('crea un registro de auditoría', async () => {
      mockPrisma.auditLog.create.mockResolvedValue({})
      await service.log({ userId: 'user-1', action: 'AUTH_LOGIN' })
      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: { userId: 'user-1', action: 'AUTH_LOGIN' },
      })
    })

    it('no lanza error si falla el registro', async () => {
      mockPrisma.auditLog.create.mockRejectedValue(new Error('DB error'))
      await expect(
        service.log({ userId: 'user-1', action: 'AUTH_LOGIN' })
      ).resolves.not.toThrow()
    })
  })
})