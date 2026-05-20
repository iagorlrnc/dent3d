import { forwardRef } from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

const baseClass =
  'w-full bg-white/60 border border-white/80 rounded-2xl px-4 py-3 text-dark text-sm font-sans ' +
  'placeholder:text-stone-muted/40 focus:outline-none focus:border-teal-clinic focus:ring-1 focus:ring-teal-clinic/20 backdrop-blur-sm shadow-sm transition-all duration-300'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] tracking-[0.12em] uppercase text-stone-muted font-sans">
          {label}
        </label>
      )}
      <input ref={ref} className={`${baseClass} ${className}`} {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

export function Select({ label, error, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] tracking-[0.12em] uppercase text-stone-muted font-sans">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          className={`${baseClass} pr-10 appearance-none bg-no-repeat bg-[right_1rem_center] [background-size:1em_1em] bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2024%2024'%20fill='none'%20stroke='%237A6F65'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'%3E%3Cpolyline%20points='6%209%2012%2015%2018%209'%3E%3C/polyline%3E%3C/svg%3E")] ${className}`}
          {...props}
        >
          {options.map(o => (
            <option key={o.value} value={o.value} className="bg-cream text-dark">{o.label}</option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] tracking-[0.12em] uppercase text-stone-muted font-sans">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={3}
        className={`${baseClass} resize-y ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'
