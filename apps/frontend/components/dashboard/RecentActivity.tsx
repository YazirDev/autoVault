import { Receipt, Wrench, GasPump, Warning } from '@phosphor-icons/react'

const ACTIVITIES = [
  {
    id: 1,
    icon: GasPump,
    label: 'Combustible',
    vehicle: 'Toyota Corolla 2020',
    amount: -18500,
    date: 'Hoy, 8:32 am',
    color: '#539091',
  },
  {
    id: 2,
    icon: Wrench,
    label: 'Cambio de aceite',
    vehicle: 'Honda Civic 2019',
    amount: -35000,
    date: 'Ayer, 2:15 pm',
    color: '#68C3B7',
  },
  {
    id: 3,
    icon: Receipt,
    label: 'Seguro trimestral',
    vehicle: 'Toyota Corolla 2020',
    amount: -95000,
    date: '3 sep, 10:00 am',
    color: '#A8DCD9',
  },
  {
    id: 4,
    icon: Warning,
    label: 'Mantenimiento próximo',
    vehicle: 'Honda Civic 2019',
    amount: 0,
    date: 'En 5 días',
    color: '#D97706',
    isAlert: true,
  },
]

export function RecentActivity() {
  return (
    <div className="flex flex-col gap-1">
      {ACTIVITIES.map((item, i) => (
        <div
          key={item.id}
          className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors duration-150 cursor-pointer"
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {/* Icono */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${item.color}18` }}
          >
            <item.icon size={15} weight="duotone" style={{ color: item.color }} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--ink)' }}>
              {item.label}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--ink-muted)' }}>
              {item.vehicle}
            </p>
          </div>

          {/* Monto y fecha */}
          <div className="text-right flex-shrink-0">
            {item.amount !== 0 ? (
              <p
                className="tabular text-sm font-medium"
                style={{ color: item.amount < 0 ? 'var(--danger)' : 'var(--success)' }}
              >
                {item.amount < 0 ? '-' : '+'}₡{Math.abs(item.amount).toLocaleString('es-CR')}
              </p>
            ) : (
              <p className="text-xs font-medium" style={{ color: '#D97706' }}>
                Alerta
              </p>
            )}
            <p className="text-xs" style={{ color: 'var(--ink-disabled)' }}>
              {item.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}