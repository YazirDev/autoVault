interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: 'var(--ink-secondary)' }}>
        {label}
        {required && <span style={{ color: 'var(--danger)' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs" style={{ color: 'var(--danger)' }}>{error}</p>
      )}
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={`w-full h-9 px-3 rounded-lg text-sm outline-none transition-all duration-150 ${className ?? ''}`}
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--surface-border-hover)'}`,
        color: 'var(--ink)',
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--teal-400)'
        e.currentTarget.style.boxShadow = error
          ? '0 0 0 3px rgba(220,38,38,0.08)'
          : '0 0 0 3px rgba(83,144,145,0.10)'
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--surface-border-hover)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...props}
    />
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export function Select({ error, children, className, ...props }: SelectProps) {
  return (
    <select
      className={`w-full h-9 px-3 rounded-lg text-sm outline-none transition-all duration-150 ${className ?? ''}`}
      style={{
        backgroundColor: 'var(--surface-elevated)',
        border: `1px solid ${error ? 'var(--danger)' : 'var(--surface-border-hover)'}`,
        color: 'var(--ink)',
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--teal-400)'
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(83,144,145,0.10)'
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--surface-border-hover)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      {...props}
    >
      {children}
    </select>
  )
}