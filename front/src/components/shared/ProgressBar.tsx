import React from 'react'

interface ProgressBarProps {
  label?: string
  value: number
  max?: number
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'amber'
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  blue: 'bg-accent-blue',
  green: 'bg-accent-green',
  purple: 'bg-accent-purple',
  orange: 'bg-accent-orange',
  red: 'bg-accent-red',
  amber: 'bg-accent-amber',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max = 100,
  color = 'blue',
  showPercentage = true,
  size = 'md',
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
          {showPercentage && <span className="text-sm font-semibold text-text-primary">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`w-full rounded-full bg-navy-700 ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

