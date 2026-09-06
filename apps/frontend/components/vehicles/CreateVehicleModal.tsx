'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/FormField'
import { useCreateVehicle } from '@/lib/hooks'
import { toast } from '@/components/ui/Toast'

interface Props {
  open: boolean
  onClose: () => void
}

const CURRENT_YEAR = new Date().getFullYear()

export function CreateVehicleModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: CURRENT_YEAR,
    licensePlate: '',
    fuelType: 'GASOLINE' as const,
    currentKm: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { mutate: createVehicle, isPending } = useCreateVehicle()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.brand.trim())       e.brand        = 'La marca es requerida'
    if (!form.model.trim())       e.model        = 'El modelo es requerido'
    if (!form.licensePlate.trim())e.licensePlate = 'La placa es requerida'
    if (form.year < 1900 || form.year > CURRENT_YEAR + 1)
                                  e.year         = 'Año inválido'
    if (form.currentKm < 0)       e.currentKm    = 'El kilometraje no puede ser negativo'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createVehicle(form, {
      onSuccess: () => {
        toast.success('Vehículo agregado correctamente')
        onClose()
        setForm({
          brand: '',
          model: '',
          year: CURRENT_YEAR,
          licensePlate: '',
          fuelType: 'GASOLINE',
          currentKm: 0,
        })
        setErrors({})
      },
    })
  }

  const set = (field: string, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Agregar vehículo"
      description="Registra un nuevo vehículo en tu cuenta"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Marca y modelo */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Marca" required error={errors.brand}>
            <Input
              placeholder="Toyota"
              value={form.brand}
              onChange={e => set('brand', e.target.value)}
              error={!!errors.brand}
            />
          </FormField>
          <FormField label="Modelo" required error={errors.model}>
            <Input
              placeholder="Corolla"
              value={form.model}
              onChange={e => set('model', e.target.value)}
              error={!!errors.model}
            />
          </FormField>
        </div>

        {/* Año y placa */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Año" required error={errors.year}>
            <Input
              type="number"
              min={1900}
              max={CURRENT_YEAR + 1}
              value={form.year}
              onChange={e => set('year', parseInt(e.target.value))}
              error={!!errors.year}
            />
          </FormField>
          <FormField label="Placa" required error={errors.licensePlate}>
            <Input
              placeholder="ABC-123"
              value={form.licensePlate}
              onChange={e => set('licensePlate', e.target.value.toUpperCase())}
              error={!!errors.licensePlate}
            />
          </FormField>
        </div>

        {/* Combustible y km */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Combustible" required>
            <Select
              value={form.fuelType}
              onChange={e => set('fuelType', e.target.value)}
            >
              <option value="GASOLINE">Gasolina</option>
              <option value="DIESEL">Diésel</option>
              <option value="ELECTRIC">Eléctrico</option>
              <option value="HYBRID">Híbrido</option>
            </Select>
          </FormField>
          <FormField label="Kilometraje actual" required error={errors.currentKm}>
            <Input
              type="number"
              min={0}
              value={form.currentKm}
              onChange={e => set('currentKm', parseInt(e.target.value) || 0)}
              error={!!errors.currentKm}
            />
          </FormField>
        </div>

        {/* Botones */}
        <div
          className="flex items-center justify-end gap-3 pt-2"
          style={{ borderTop: '1px solid var(--surface-border)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 rounded-lg text-sm font-medium transition-all duration-150"
            style={{
              color: 'var(--ink-secondary)',
              backgroundColor: 'var(--surface-elevated)',
              border: '1px solid var(--surface-border)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--surface-border-hover)'
              e.currentTarget.style.color = 'var(--ink)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--surface-border)'
              e.currentTarget.style.color = 'var(--ink-secondary)'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50"
            style={{ backgroundColor: 'var(--teal-400)', color: '#FFFFFF' }}
            onMouseEnter={e => {
              if (!isPending) e.currentTarget.style.backgroundColor = 'var(--teal-500)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'var(--teal-400)'
            }}
          >
            {isPending ? (
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
              />
            ) : null}
            {isPending ? 'Guardando...' : 'Agregar vehículo'}
          </button>
        </div>
      </form>
    </Modal>
  )
}