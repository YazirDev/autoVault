import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  licensePlate: string
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'
  currentKm: number
  createdAt: string
  updatedAt: string
}

export interface CreateVehicleInput {
  brand: string
  model: string
  year: number
  licensePlate: string
  fuelType: 'GASOLINE' | 'DIESEL' | 'ELECTRIC' | 'HYBRID'
  currentKm: number
  purchaseDate?: string
}

// Obtener todos los vehículos del usuario
export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: () => api.get<Vehicle[]>('/vehicles'),
  })
}

// Obtener un vehículo por ID
export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => api.get<Vehicle>(`/vehicles/${id}`),
    enabled: !!id,
  })
}

// Crear vehículo
export function useCreateVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVehicleInput) =>
      api.post<Vehicle>('/vehicles', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}

// Actualizar vehículo
export function useUpdateVehicle(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<CreateVehicleInput>) =>
      api.patch<Vehicle>(`/vehicles/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
      queryClient.invalidateQueries({ queryKey: ['vehicles', id] })
    },
  })
}

// Eliminar vehículo
export function useDeleteVehicle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/vehicles/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] })
    },
  })
}