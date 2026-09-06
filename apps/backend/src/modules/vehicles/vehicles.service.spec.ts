import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { VehiclesService } from './vehicles.service'
import { VehiclesRepository } from './vehicles.repository'
import { AuditService } from '../audit/audit.service'

const mockVehicle = {
  id: 'vehicle-1',
  userId: 'user-1',
  brand: 'Toyota',
  model: 'Corolla',
  year: 2020,
  licensePlate: 'ABC-123',
  fuelType: 'GASOLINE' as const,
  currentKm: 45000,
  purchaseDate: null,
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockRepo = {
  findAllByUser: jest.fn(),
  findOneByUser: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}

const mockAudit = {
  log: jest.fn(),
}

describe('VehiclesService', () => {
  let service: VehiclesService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: VehiclesRepository, useValue: mockRepo },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile()

    service = module.get<VehiclesService>(VehiclesService)
    jest.clearAllMocks()
  })

  describe('findAll', () => {
    it('devuelve todos los vehículos del usuario', async () => {
      mockRepo.findAllByUser.mockResolvedValue([mockVehicle])
      const result = await service.findAll('user-1')
      expect(result).toEqual([mockVehicle])
      expect(mockRepo.findAllByUser).toHaveBeenCalledWith('user-1')
    })

    it('devuelve array vacío si no hay vehículos', async () => {
      mockRepo.findAllByUser.mockResolvedValue([])
      const result = await service.findAll('user-1')
      expect(result).toEqual([])
    })
  })

  describe('findOne', () => {
    it('devuelve el vehículo si existe y pertenece al usuario', async () => {
      mockRepo.findOneByUser.mockResolvedValue(mockVehicle)
      const result = await service.findOne('vehicle-1', 'user-1')
      expect(result).toEqual(mockVehicle)
    })

    it('lanza NotFoundException si el vehículo no existe', async () => {
      mockRepo.findOneByUser.mockResolvedValue(null)
      await expect(service.findOne('vehicle-x', 'user-1'))
        .rejects.toThrow(NotFoundException)
    })

    it('lanza NotFoundException si el vehículo no pertenece al usuario', async () => {
      mockRepo.findOneByUser.mockResolvedValue(null)
      await expect(service.findOne('vehicle-1', 'user-2'))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('create', () => {
    it('crea un vehículo y registra auditoría', async () => {
      const dto = {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        licensePlate: 'ABC-123',
        fuelType: 'GASOLINE' as const,
        currentKm: 0,
      }
      mockRepo.create.mockResolvedValue(mockVehicle)
      const result = await service.create('user-1', dto)
      expect(result).toEqual(mockVehicle)
      expect(mockRepo.create).toHaveBeenCalledWith('user-1', dto)
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'VEHICLE_CREATE' })
      )
    })
  })

  describe('update', () => {
    it('actualiza el vehículo si pertenece al usuario', async () => {
      mockRepo.findOneByUser.mockResolvedValue(mockVehicle)
      const updated = { ...mockVehicle, currentKm: 50000 }
      mockRepo.update.mockResolvedValue(updated)
      const result = await service.update('vehicle-1', 'user-1', { currentKm: 50000 })
      expect(result.currentKm).toBe(50000)
    })

    it('lanza NotFoundException si el vehículo no existe', async () => {
      mockRepo.findOneByUser.mockResolvedValue(null)
      await expect(service.update('vehicle-x', 'user-1', {}))
        .rejects.toThrow(NotFoundException)
    })
  })

  describe('remove', () => {
    it('elimina el vehículo y registra auditoría', async () => {
      mockRepo.findOneByUser.mockResolvedValue(mockVehicle)
      mockRepo.delete.mockResolvedValue(mockVehicle)
      await service.remove('vehicle-1', 'user-1')
      expect(mockRepo.delete).toHaveBeenCalledWith('vehicle-1')
      expect(mockAudit.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'VEHICLE_DELETE' })
      )
    })

    it('lanza NotFoundException si el vehículo no existe', async () => {
      mockRepo.findOneByUser.mockResolvedValue(null)
      await expect(service.remove('vehicle-x', 'user-1'))
        .rejects.toThrow(NotFoundException)
    })
  })
})