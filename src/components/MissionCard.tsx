import React from 'react'

interface MissionCardProps {
  title: string
  description: string
  status: 'active' | 'completed' | 'planned'
  launchDate: Date
  agency: string
  className?: string
}

export default function MissionCard({ 
  title, 
  description, 
  status, 
  launchDate, 
  agency, 
  className = '' 
}: MissionCardProps) {
  const statusColors = {
    active: 'bg-green-500',
    completed: 'bg-blue-500',
    planned: 'bg-yellow-500'
  }
  
  const statusLabels = {
    active: 'Active',
    completed: 'Completed',
    planned: 'Planned'
  }
  
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
      </div>
      
      <p className="text-gray-300 mb-4">{description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>{agency}</span>
        <span>{launchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>
  )
}
