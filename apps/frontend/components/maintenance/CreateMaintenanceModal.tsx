'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/FormField'
import { useCreateMaintenance } from '@/lib/hooks'
import { useVehicles } from '@/lib/hooks'

interface Props {
  open: boolean
  onClose: () => void
}

const MAINTENANCE_TYPES = [
  'Cambio de aceite',
  'Cambio de llantas',
  'Revisión de frenos',
  'Sincronización',
  'Cambio de filtros',
  'Revisión general',
  'Alineación y balanceo',
  'Cambio de batería',
  'Revisión de transmisión',
  'Otro',
]

export function CreateMaintenanceModal({ open, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0]!

  const [form, setForm] = useState({
    vehicleId:   '',
    type:        'Cambio de aceite',
    customType:  '',
    description: '',
    date:        today,
    km:          '',
    cost:        0,
    nextDueKm:   '',
    nextDueDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: vehicles } = useVehicles()
  const { mutate: createMaintenance, isPending } = useCreateMaintenance()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.vehicleId) e.vehicleId = 'Selecciona un vehículo'
    if (!form.type)      e.type      = 'El tipo es requerido'
    if (!form.date)      e.date      = 'La fecha es requerida'
    if (form.cost <= 0)  e.cost      = 'El costo debe ser mayor a 0'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const type = form.type === 'Otro' ? form.customType : form.type

    createMaintenance(
      {
        vehicleId:   form.vehicleId,
        type,
        description: form.description || undefined,
        date:        form.date,
        km:          form.km ? parseInt(form.km) : undefined,
        cost:        form.cost,
        nextDueKm:   form.nextDueKm ? parseInt(form.nextDueKm) : undefined,
        nextDueDate: form.nextDueDate || undefined,
      },
      {
        onSuccess: () => {
          onClose()
          setForm({
            vehicleId:   '',
            type:        'Cambio de aceite',
            customType:  '',
            description: '',
            date:        today,
            km:          '',
            cost:        0,
            nextDueKm:   '',
            nextDueDate: '',
          })
          setErrors({})
        },
      },
    )
  }

  const set = (field: string, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }))

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar mantenimiento"
      description="Agrega un registro de mantenimiento al historial"
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Vehículo */}
        <FormField label="Vehículo" required error={errors.vehicleId}>
          <Select
            value={form.vehicleId}
            onChange={e => set('vehicleId', e.target.value)}
            error={!!errors.vehicleId}
          >
            <option value="">Selecciona un vehículo</option>
            {vehicles?.map(v => (
              <option key={v.id} value={v.id}>
                {v.brand} {v.model} ({v.licensePlate})
              </option>
            ))}
          </Select>
        </FormField>

        {/* Tipo */}
        <FormField label="Tipo de mantenimiento" required error={errors.type}>
          <Select
            value={form.type}
            onChange={e => set('type', e.target.value)}
            error={!!errors.type}
          >
            {MAINTENANCE_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </FormField>

        {/* Tipo personalizado si selecciona Otro */}
        {form.type === 'Otro' && (
          <FormField label="Especifica el tipo" required>
            <Input
              placeholder="Describe el mantenimiento"
              value={form.customType}
              onChange={e => set('customType', e.target.value)}
            />
          </FormField>
        )}

        {/* Fecha y costo */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Fecha" required error={errors.date}>
            <Input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              error={!!errors.date}
            />
          </FormField>
          <FormField label="Costo (₡)" required error={errors.cost}>
            <Input
              type="number"
              min={0}
              step={100}
              placeholder="0"
              value={form.cost || ''}
              onChange={e => set('cost', parseFloat(e.target.value) || 0)}
              error={!!errors.cost}
            />
          </FormField>
        </div>

        {/* KM actual y descripción */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Kilometraje actual">
            <Input
              type="number"
              min={0}
              placeholder="Opcional"
              value={form.km}
              onChange={e => set('km', e.target.value)}
            />
          </FormField>
          <FormField label="Descripción">
            <Input
              placeholder="Opcional"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </FormField>
        </div>

        {/* Próximo mantenimiento */}
        <div
          className="rounded-lg p-3 flex flex-col gap-3"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--surface-border)',
          }}
        >
          <p className="text-xs font-medium" style={{ color: 'var(--ink-muted)' }}>
            Próximo mantenimiento (opcional)
          </p>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="KM límite">
              <Input
                type="number"
                min={0}
                placeholder="Ej: 50000"
                value={form.nextDueKm}
                onChange={e => set('nextDueKm', e.target.value)}
              />
            </FormField>
            <FormField label="Fecha límite">
              <Input
                type="date"
                value={form.nextDueDate}
                onChange={e => set('nextDueDate', e.target.value)}
              />
            </FormField>
          </div>
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
            {isPending && (
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
              />
            )}
            {isPending ? 'Guardando...' : 'Registrar mantenimiento'}
          </button>
        </div>
      </form>
    </Modal>
  )
}