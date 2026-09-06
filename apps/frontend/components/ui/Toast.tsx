'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Warning, X, Info } from '@phosphor-icons/react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

// Store global simple sin librerías
let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

function notify(listeners: ((t: Toast[]) => void)[], toasts: Toast[]) {
  listeners.forEach(l => l([...toasts]))
}

export const toast = {
  success: (message: string) => {
    const id = Math.random().toString(36).slice(2)
    toasts = [...toasts, { id, type: 'success', message }]
    notify(listeners, toasts)
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id)
      notify(listeners, toasts)
    }, 3500)
  },
  error: (message: string) => {
    const id = Math.random().toString(36).slice(2)
    toasts = [...toasts, { id, type: 'error', message }]
    notify(listeners, toasts)
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id)
      notify(listeners, toasts)
    }, 4500)
  },
  info: (message: string) => {
    const id = Math.random().toString(36).slice(2)
    toasts = [...toasts, { id, type: 'info', message }]
    notify(listeners, toasts)
    setTimeout(() => {
      toasts = toasts.filter(t => t.id !== id)
      notify(listeners, toasts)
    }, 3000)
  },
}

const TOAST_CONFIG = {
  success: { icon: CheckCircle, color: '#22C55E', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.20)'  },
  error:   { icon: Warning,     color: '#EF4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.20)'  },
  info:    { icon: Info,        color: '#539091', bg: 'rgba(83,144,145,0.10)', border: 'rgba(83,144,145,0.20)' },
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setItems)
    return () => {
      listeners = listeners.filter(l => l !== setItems)
    }
  }, [])

  const remove = (id: string) => {
    toasts = toasts.filter(t => t.id !== id)
    notify(listeners, toasts)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {items.map(item => {
          const cfg = TOAST_CONFIG[item.type]
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: `1px solid ${cfg.border}`,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                minWidth: '280px',
                maxWidth: '380px',
              }}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cfg.bg }}
              >
                <cfg.icon size={13} weight="bold" style={{ color: cfg.color }} />
              </div>
              <p className="flex-1 text-sm" style={{ color: 'var(--ink)' }}>
                {item.message}
              </p>
              <button
                onClick={() => remove(item.id)}
                className="w-5 h-5 flex items-center justify-center rounded transition-colors duration-150 flex-shrink-0"
                style={{ color: 'var(--ink-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-muted)')}
              >
                <X size={11} weight="bold" />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}