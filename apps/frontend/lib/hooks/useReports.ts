import { useQuery } from '@tanstack/react-query'
import { api } from '../api'

export function useMonthlySummary(year?: number) {
  const targetYear = year ?? new Date().getFullYear()
  return useQuery({
    queryKey: ['reports', 'monthly', targetYear],
    queryFn: () =>
      api.get<{ month: number; total: number }[]>(
        `/reports/monthly?year=${targetYear}`
      ),
  })
}

export function useVehicleComparison() {
  return useQuery({
    queryKey: ['reports', 'vehicles'],
    queryFn: () =>
      api.get<{
        vehicleId: string
        label: string
        totalExpenses: number
        currentKm: number
        costPerKm: number
      }[]>('/reports/vehicles'),
  })
}

export function useCostPerKm(vehicleId: string) {
  return useQuery({
    queryKey: ['reports', 'cpk', vehicleId],
    queryFn: () =>
      api.get<{
        vehicleId: string
        totalExpenses: number
        totalKm: number
        costPerKm: number
      }>(`/reports/cost-per-km/${vehicleId}`),
    enabled: !!vehicleId,
  })
}