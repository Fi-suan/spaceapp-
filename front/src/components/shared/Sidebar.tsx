import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { City, KAZAKHSTAN_CITIES } from '@/lib/cities'

const navIcons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  farm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  insurance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  wildfire: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  analysis: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  predictions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  alerts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
}

interface SidebarProps {
  activeRoute: 'dashboard' | 'farm' | 'insurance' | 'wildfire'
  selectedCity: City
  onCityChange: (city: City) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute, selectedCity, onCityChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigation = [
    { label: 'Dashboard', href: '/', key: 'dashboard', icon: navIcons.dashboard, color: 'blue' },
    { label: 'Agriculture', href: '/dashboard/farm', key: 'farm', icon: navIcons.farm, color: 'green' },
    { label: 'Insurance', href: '/dashboard/insurance', key: 'insurance', icon: navIcons.insurance, color: 'purple' },
    { label: 'Wildfires', href: '/dashboard/wildfire', key: 'wildfire', icon: navIcons.wildfire, color: 'orange' },
  ]

  const insightItems = [
    { label: 'Risk Analysis', icon: navIcons.analysis, value: '87%', color: 'text-accent-amber' },
    { label: 'Predictions', icon: navIcons.predictions, value: '+12', color: 'text-accent-green' },
    { label: 'Alerts', icon: navIcons.alerts, value: '5', color: 'text-accent-red' },
  ]

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col overflow-y-auto border-r border-border-subtle bg-midnight-deep p-6 lg:flex">
      <div className="mb-8">
        <Image 
          src="/images/logo.png" 
          alt="EcoLitas Logo" 
          width={240}
          height={60}
          className="w-full h-auto"
          priority
        />
        <p className="text-xs text-text-subtle mt-2 text-center">NASA Space Apps 2025</p>
      </div>

      <nav className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = item.key === activeRoute
            const colorClasses = {
              blue: { bg: 'bg-accent-blue/10', text: 'text-accent-blue' },
              green: { bg: 'bg-accent-green/10', text: 'text-accent-green' },
              purple: { bg: 'bg-accent-purple/10', text: 'text-accent-purple' },
              orange: { bg: 'bg-accent-orange/10', text: 'text-accent-orange' },
            }
            const activeColors = colorClasses[item.color as keyof typeof colorClasses]
            
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? `${activeColors.bg} ${activeColors.text}`
                    : 'text-text-subtle hover:bg-white/5 hover:text-text-primary'
                }`}
              >
                <span className={isActive ? activeColors.text : 'text-text-subtle'}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div>
          <p className="mb-3 px-4 text-xs uppercase tracking-wide text-text-subtle">Insight</p>
          <div className="flex flex-col gap-1">
            {insightItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-text-subtle transition-colors hover:bg-white/5 hover:text-text-primary"
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative mt-auto rounded-2xl bg-navy-800 p-5">
        <p className="text-sm font-semibold text-text-primary mb-2">Location</p>
        <p className="text-xs text-text-muted mb-3">{selectedCity.nameEn}, {selectedCity.country}</p>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80"
          >
            <span>Change Location</span>
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg bg-navy-900 border border-border-subtle shadow-xl overflow-hidden">
              {KAZAKHSTAN_CITIES.map((city) => (
                <button
                  key={city.id}
                  onClick={() => {
                    onCityChange(city)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    city.id === selectedCity.id
                      ? 'bg-accent-blue/20 text-accent-blue font-medium'
                      : 'text-text-primary hover:bg-navy-700'
                  }`}
                >
                  <div className="font-medium">{city.nameEn}</div>
                  <div className="text-xs text-text-muted">{city.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

