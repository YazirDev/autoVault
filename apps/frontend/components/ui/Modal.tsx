'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@phosphor-icons/react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  width?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  width = 'max-w-md',
}: ModalProps) {
  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className={`w-full ${width} rounded-2xl p-6`}
              style={{
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--surface-border-hover)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2
                    className="text-base font-semibold"
                    style={{ color: 'var(--ink)' }}
                  >
                    {title}
                  </h2>
                  {description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--ink-muted)' }}>
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-colors duration-150 flex-shrink-0"
                  style={{ color: 'var(--ink-muted)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--surface-overlay)'
                    e.currentTarget.style.color = 'var(--ink)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = 'var(--ink-muted)'
                  }}
                >
                  <X size={15} weight="bold" />
                </button>
              </div>

              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}