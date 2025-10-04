import React from 'react'

interface ToolbarItem {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}

interface BottomToolbarProps {
  items: ToolbarItem[]
  className?: string
}

export default function BottomToolbar({ items, className = '' }: BottomToolbarProps) {
  // Ensure maximum 4 items as per design guidelines
  const displayItems = items.slice(0, 4)
  
  if (displayItems.length < 3) {
    console.warn('BottomToolbar should have at least 3 items for better UX')
  }
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/20 ${className}`}>
      <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
        {displayItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              item.active 
                ? 'text-blue-400 bg-blue-400/10' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
