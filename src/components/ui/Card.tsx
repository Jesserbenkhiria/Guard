import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export function Card({ children, className, title, subtitle, action }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-navy-200 bg-white shadow-sm', className)}>
      {(title || action) && (
        <div className="flex items-start justify-between border-b border-navy-100 px-6 py-4">
          <div>
            {title && <h3 className="text-base font-semibold text-navy-900">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-sm text-navy-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn(!title && !action && 'p-6', title && 'p-6')}>{children}</div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  trend?: string
  variant?: 'default' | 'warning' | 'success' | 'error'
}

const statVariants = {
  default: 'bg-white border-navy-200',
  warning: 'bg-amber-50 border-amber-200',
  success: 'bg-emerald-50 border-emerald-200',
  error: 'bg-red-50 border-red-200',
}

const iconVariants = {
  default: 'bg-navy-100 text-navy-700',
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
}

export function StatCard({ label, value, icon, trend, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border p-5 shadow-sm', statVariants[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-navy-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-navy-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-navy-400">{trend}</p>}
        </div>
        <div className={cn('rounded-lg p-3', iconVariants[variant])}>{icon}</div>
      </div>
    </div>
  )
}
