import React from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  action?: React.ReactNode
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  action,
}) => {
  return (
    <div className="rounded-2xl bg-navy-800 p-6 border border-border-subtle">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-text-subtle">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

