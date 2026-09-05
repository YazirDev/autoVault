import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'

export interface Expense {
  id: string
  vehicleId: string
  userId: string
  category: string
  amount: number
  description?: string
  date: string
  km?: number
  receiptUrl?: string
  createdAt: string
  vehicle?: {
    brand: string
    model: string
    licensePlate: string
  }
}

export interface CreateExpenseInput {
  vehicleId: string
  category: string
  amount: number
  description?: string
  date: string
  km?: number
}

export function useExpenses() {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: () => api.get<Expense[]>('/expenses'),
  })
}

export function useExpensesByVehicle(vehicleId: string) {
  return useQuery({
    queryKey: ['expenses', 'vehicle', vehicleId],
    queryFn: () => api.get<Expense[]>(`/expenses/vehicle/${vehicleId}`),
    enabled: !!vehicleId,
  })
}

export function useExpenseSummary(from: string, to: string) {
  return useQuery({
    queryKey: ['expenses', 'summary', from, to],
    queryFn: () => api.get<{ _sum: { amount: number }; _count: number }>(
      `/expenses/summary?from=${from}&to=${to}`
    ),
    enabled: !!from && !!to,
  })
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ['expenses', 'categories'],
    queryFn: () => api.get<{ category: string; _sum: { amount: number }; _count: number }[]>(
      '/expenses/categories'
    ),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExpenseInput) =>
      api.post<Expense>('/expenses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
  })
}