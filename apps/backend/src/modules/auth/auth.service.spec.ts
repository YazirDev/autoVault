import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { PrismaService } from '../../prisma/prisma.service'
import { AuditService } from '../audit/audit.service'

const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  picture: null,
  googleId: 'google-123',
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    upsert:     jest.fn(),
    update:     jest.fn(),
  },
}

const mockJwt = {
  signAsync: jest.fn().mockResolvedValue('mock-token'),
}

const mockConfig = {
  get: jest.fn((key: string) => {
    const config: Record<string, string> = {
      GOOGLE_CLIENT_ID:     'client-id',
      GOOGLE_CLIENT_SECRET: 'client-secret',
    }
    return config[key]
  }),
}

const mockAudit = { log: jest.fn() }

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService,  useValue: mockPrisma  },
        { provide: JwtService,     useValue: mockJwt     },
        { provide: ConfigService,  useValue: mockConfig  },
        { provide: AuditService,   useValue: mockAudit   },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    jest.clearAllMocks()
  })

  describe('refreshTokens', () => {
    it('lanza UnauthorizedException si el usuario no tiene refresh token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, refreshToken: null })
      await expect(service.refreshTokens('user-1', 'some-token'))
        .rejects.toThrow(UnauthorizedException)
    })

    it('lanza UnauthorizedException si el usuario no existe', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)
      await expect(service.refreshTokens('user-x', 'some-token'))
        .rejects.toThrow(UnauthorizedException)
    })
  })

  describe('logout', () => {
    it('borra el refresh token del usuario', async () => {
      mockPrisma.user.update.mockResolvedValue(mockUser)
      await service.logout('user-1')
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { refreshToken: null },
      })
    })

    it('registra auditoría al hacer logout', async () => {
      mockPrisma.user.update.mockResolvedValue(mockUser)
      await service.logout('user-1', '127.0.0.1')
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'AUTH_LOGOUT', userId: 'user-1' })
      )
    })
  })
})