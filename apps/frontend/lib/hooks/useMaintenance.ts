import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

export interface Maintenance {
  id: string
  vehicleId: string
  userId: string
  type: string
  description?: string
  date: string
  km?: number
  cost: number
  nextDueKm?: number
  nextDueDate?: string
  vehicle?: {
    brand: string
    model: string
    licensePlate: string
  }
}

export interface CreateMaintenanceInput {
  vehicleId: string
  type: string
  description?: string
  date: string
  km?: number
  cost: number
  nextDueKm?: number
  nextDueDate?: string
}

export function useMaintenance() {
  return useQuery({
    queryKey: ['maintenance'],
    queryFn: () => api.get<Maintenance[]>('/maintenance'),
  })
}

export function useUpcomingMaintenance(days = 30) {
  return useQuery({
    queryKey: ['maintenance', 'upcoming', days],
    queryFn: () =>
      api.get<Maintenance[]>(`/maintenance/upcoming?days=${days}`),
  })
}

export function useCreateMaintenance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateMaintenanceInput) =>
      api.post<Maintenance>('/maintenance', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
    },
  })
}

export function useDeleteMaintenance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/maintenance/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
    },
  })
}