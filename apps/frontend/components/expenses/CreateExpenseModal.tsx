'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { FormField, Input, Select } from '@/components/ui/FormField'
import { useCreateExpense } from '@/lib/hooks'
import { useVehicles } from '@/lib/hooks'
import { toast } from '@/components/ui/Toast'

interface Props {
  open: boolean
  onClose: () => void
}

const CATEGORIES = [
  { value: 'FUEL',        label: 'Combustible'   },
  { value: 'MAINTENANCE', label: 'Mantenimiento'  },
  { value: 'INSURANCE',   label: 'Seguro'         },
  { value: 'TAX',         label: 'Impuesto'       },
  { value: 'REPAIR',      label: 'Reparación'     },
  { value: 'PARKING',     label: 'Parqueo'        },
  { value: 'TOLL',        label: 'Peaje'          },
  { value: 'OTHER',       label: 'Otro'           },
]

export function CreateExpenseModal({ open, onClose }: Props) {
  const today = new Date().toISOString().split('T')[0]!

  const [form, setForm] = useState({
    vehicleId:   '',
    category:    'FUEL',
    amount:      0,
    description: '',
    date:        today,
    km:          '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: vehicles } = useVehicles()
  const { mutate: createExpense, isPending } = useCreateExpense()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.vehicleId)    e.vehicleId   = 'Selecciona un vehículo'
    if (form.amount <= 0)   e.amount      = 'El monto debe ser mayor a 0'
    if (!form.date)         e.date        = 'La fecha es requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    createExpense(
      {
        vehicleId:   form.vehicleId,
        category:    form.category,
        amount:      form.amount,
        description: form.description || undefined,
        date:        form.date,
        km:          form.km ? parseInt(form.km) : undefined,
      },
      {
        onSuccess: () => {
          toast.success('Gasto registrado correctamente')
          onClose()
          setForm({
            vehicleId:   '',
            category:    'FUEL',
            amount:      0,
            description: '',
            date:        today,
            km:          '',
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
      title="Registrar gasto"
      description="Agrega un nuevo gasto a tu historial"
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

        {/* Categoría */}
        <FormField label="Categoría" required>
          <Select
            value={form.category}
            onChange={e => set('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </Select>
        </FormField>

        {/* Monto y fecha */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Monto (₡)" required error={errors.amount}>
            <Input
              type="number"
              min={0}
              step={100}
              placeholder="0"
              value={form.amount || ''}
              onChange={e => set('amount', parseFloat(e.target.value) || 0)}
              error={!!errors.amount}
            />
          </FormField>
          <FormField label="Fecha" required error={errors.date}>
            <Input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              error={!!errors.date}
            />
          </FormField>
        </div>

        {/* Descripción y KM */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Descripción">
            <Input
              placeholder="Opcional"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </FormField>
          <FormField label="Kilometraje">
            <Input
              type="number"
              min={0}
              placeholder="Opcional"
              value={form.km}
              onChange={e => set('km', e.target.value)}
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
            {isPending && (
              <div
                className="w-4 h-4 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}
              />
            )}
            {isPending ? 'Guardando...' : 'Registrar gasto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}