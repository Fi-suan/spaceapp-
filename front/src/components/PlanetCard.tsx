import React from 'react'

interface PlanetCardProps {
  name: string
  type: 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf'
  distance: string
  diameter: string
  moons: number
  imageUrl?: string
  className?: string
}

export default function PlanetCard({ 
  name, 
  type, 
  distance, 
  diameter, 
  moons, 
  imageUrl, 
  className = '' 
}: PlanetCardProps) {
  const typeColors = {
    terrestrial: 'bg-yellow-500',
    gas_giant: 'bg-orange-500',
    ice_giant: 'bg-blue-500',
    dwarf: 'bg-gray-500'
  }
  
  const typeLabels = {
    terrestrial: 'Terrestrial',
    gas_giant: 'Gas Giant',
    ice_giant: 'Ice Giant',
    dwarf: 'Dwarf Planet'
  }
  
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer ${className}`}>
      {/* Planet Image Placeholder */}
      <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-white text-2xl font-bold">{name.charAt(0)}</div>
        )}
      </div>
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${typeColors[type]}`}>
          {typeLabels[type]}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-300">
        <div className="flex justify-between">
          <span>Distance:</span>
          <span>{distance}</span>
        </div>
        <div className="flex justify-between">
          <span>Diameter:</span>
          <span>{diameter}</span>
        </div>
        <div className="flex justify-between">
          <span>Moons:</span>
          <span>{moons}</span>
        </div>
      </div>
    </div>
  )
}
