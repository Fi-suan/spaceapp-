import React from 'react'

type TrendDirection = 'up' | 'down' | 'neutral'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: string
    direction: TrendDirection
  }
  iconColor?: string
  iconBg?: string
}

const TrendIcon = ({ direction }: { direction: TrendDirection }) => {
  if (direction === 'up') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 4l5.5 6h-3v6h-5v-6h-3L10 4z" />
      </svg>
    )
  }
  if (direction === 'down') {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 16l-5.5-6h3V4h5v6h3L10 16z" />
      </svg>
    )
  }
  return null
}

const trendColor = (direction: TrendDirection) => {
  if (direction === 'up') return 'text-accent-green'
  if (direction === 'down') return 'text-accent-red'
  return 'text-text-subtle'
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  iconColor = 'text-accent-blue',
  iconBg = 'bg-accent-blue/10',
}) => {
  return (
    <div className="rounded-2xl bg-navy-800 p-6 border border-border-subtle transition-all hover:border-border-muted">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        {icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-white">{value}</p>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor(trend.direction)}`}>
            <TrendIcon direction={trend.direction} />
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}

