import React from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  className?: string
}

export default function Header({ title, subtitle, className = '' }: HeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
