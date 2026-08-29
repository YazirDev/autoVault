export type FuelType = 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'

export interface Vehicle {
  id: string
  userId: string
  brand: string
  model: string
  year: number
  licensePlate: string
  fuelType: FuelType
  currentKm: number
  purchaseDate?: Date
  createdAt: Date
  updatedAt: Date
}