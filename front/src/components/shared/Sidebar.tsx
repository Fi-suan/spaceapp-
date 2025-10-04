import React from 'react'
import Link from 'next/link'

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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeRoute }) => {
  const navigation = [
    { label: 'Dashboard', href: '/', key: 'dashboard', icon: navIcons.dashboard },
    { label: 'Agriculture', href: '/dashboard/farm', key: 'farm', icon: navIcons.farm },
    { label: 'Insurance', href: '/dashboard/insurance', key: 'insurance', icon: navIcons.insurance },
    { label: 'Wildfires', href: '/dashboard/wildfire', key: 'wildfire', icon: navIcons.wildfire },
  ]

  const insightItems = [
    { label: 'Risk Analysis', icon: navIcons.analysis, value: '87%', color: 'text-accent-amber' },
    { label: 'Predictions', icon: navIcons.predictions, value: '+12', color: 'text-accent-green' },
    { label: 'Alerts', icon: navIcons.alerts, value: '5', color: 'text-accent-red' },
  ]

  return (
    <aside className="hidden w-72 flex-col border-r border-border-subtle bg-midnight-deep p-6 lg:flex">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue font-semibold text-lg">
          DP
        </div>
        <div>
          <p className="text-sm text-text-subtle">NASA Space Apps 2024</p>
          <p className="text-lg font-semibold text-text-primary">Data Pathways</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = item.key === activeRoute
            return (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-subtle hover:bg-white/5 hover:text-text-primary'
                }`}
              >
                <span className={isActive ? 'text-accent-blue' : 'text-text-subtle'}>
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

      <div className="mt-auto rounded-2xl bg-navy-800 p-5">
        <p className="text-sm font-semibold text-text-primary">Location</p>
        <p className="text-xs text-text-muted">Krasnoyarsk Region, Russia</p>
        <button className="mt-4 w-full rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80">
          Change Location
        </button>
      </div>
    </aside>
  )
}

