import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import type { AlertLevel } from '../../types'
import { cn } from '../../lib/utils'

interface StatusBadgeProps {
  level: AlertLevel
  label?: string
  showIcon?: boolean
}

const config: Record<AlertLevel, { bg: string; text: string; icon: typeof CheckCircle2; defaultLabel: string }> = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-700',
    icon: CheckCircle2,
    defaultLabel: 'Accepté',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    icon: AlertTriangle,
    defaultLabel: 'Avertissement',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    icon: XCircle,
    defaultLabel: 'Bloquant',
  },
}

export function StatusBadge({ level, label, showIcon = true }: StatusBadgeProps) {
  const { bg, text, icon: Icon, defaultLabel } = config[level]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        bg,
        text,
      )}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" />}
      {label ?? defaultLabel}
    </span>
  )
}

interface AlertBannerProps {
  level: AlertLevel
  message: string
}

export function AlertBanner({ level, message }: AlertBannerProps) {
  const { bg, text, icon: Icon } = config[level]
  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-3', bg, text)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
