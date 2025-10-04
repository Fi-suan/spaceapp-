import React from 'react'

interface ChipProps {
  children: React.ReactNode
  variant?: 'default' | 'selected' | 'disabled'
  onClick?: () => void
  className?: string
}

export default function Chip({ 
  children, 
  variant = 'default', 
  onClick, 
  className = '' 
}: ChipProps) {
  const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors'
  
  const variantClasses = {
    default: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    selected: 'bg-blue-600 text-white border border-blue-600',
    disabled: 'bg-gray-600/50 text-gray-400 border border-gray-600/50 cursor-not-allowed'
  }
  
  const clickableClasses = variant !== 'disabled' ? 'cursor-pointer' : ''
  
  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${clickableClasses} ${className}`}
      onClick={variant !== 'disabled' ? onClick : undefined}
    >
      {children}
    </span>
  )
}

// ChipGroup component to ensure chips come in sets of 3 or more
interface ChipGroupProps {
  children: React.ReactNode
  className?: string
}

export function ChipGroup({ children, className = '' }: ChipGroupProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  )
}
