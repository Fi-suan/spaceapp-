import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  const baseClasses = 'bg-white/10 backdrop-blur-sm rounded-xl border border-white/20'
  const hoverClasses = hover ? 'hover:bg-white/20 transition-colors cursor-pointer' : ''
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  )
}
