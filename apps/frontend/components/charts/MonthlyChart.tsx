'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const MOCK_DATA = [
  { mes: 'Ene', gastos: 42000 },
  { mes: 'Feb', gastos: 38500 },
  { mes: 'Mar', gastos: 51000 },
  { mes: 'Abr', gastos: 33000 },
  { mes: 'May', gastos: 47500 },
  { mes: 'Jun', gastos: 29000 },
  { mes: 'Jul', gastos: 55000 },
  { mes: 'Ago', gastos: 41000 },
  { mes: 'Sep', gastos: 36500 },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="rounded-lg px-3 py-2.5 text-sm"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: '1px solid var(--surface-border-hover)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      }}
    >
      <p className="text-xs font-medium mb-1" style={{ color: 'var(--ink-muted)' }}>
        {label}
      </p>
      <p className="tabular font-semibold" style={{ color: 'var(--ink)' }}>
        ₡{payload[0].value.toLocaleString('es-CR')}
      </p>
    </div>
  )
}

export function MonthlyChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={MOCK_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#539091" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#539091" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgba(83,144,145,0.08)"
          vertical={false}
        />
        <XAxis
          dataKey="mes"
          tick={{ fill: 'var(--ink-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--ink-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `₡${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(83,144,145,0.2)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="gastos"
          stroke="#539091"
          strokeWidth={2}
          fill="url(#tealGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#539091', stroke: 'var(--surface-card)', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}