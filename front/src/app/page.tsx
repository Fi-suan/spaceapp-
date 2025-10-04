'use client'

import { useSpaceObjects } from '@/hooks/useSpaceObjects'

const metricIcons = {
  farm: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6v6l4 2" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" />
    </svg>
  ),
  fire: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2c-1.5 3-3 5.5-3 8.5 0 3 2 5.5 5 5.5s5-2.5 5-5.5c0-3-1.5-5.5-3-8.5-1 2-2 3.5-2 5.5 0 1.5-1 2.5-2 2.5z" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v4m0 4h.01" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  planet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <circle cx="12" cy="12" r="10" strokeWidth="1.8" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 2a10 10 0 0 0 0 20" />
    </svg>
  ),
} as const

type Trend = "up" | "down" | "neutral"

type Delta = {
  value: string
  trend: Trend
}

type MetricCard = {
  label: string
  value: string
  icon: keyof typeof metricIcons
  delta: Delta
}

const navigation = [
  { label: "Dashboard", active: true },
  { label: "Agriculture", sector: "agronomy" },
  { label: "Insurance", sector: "insurance" },
  { label: "Wildfires", sector: "wildfire" },
  { label: "Reports" },
]

const insightItems = ["Risk Analysis", "Predictions", "Alerts"]

const deltaStyles = (trend: Trend) => {
  if (trend === "up") return "text-accent-green"
  if (trend === "down") return "text-accent-amber"
  return "text-text-subtle"
}

const deltaIcon = (trend: Trend) => {
  if (trend === "up") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 4l5.5 6h-3v6h-5v-6h-3L10 4z" />
      </svg>
    )
  }
  if (trend === "down") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10 16l-5.5-6h3V4h5v6h3L10 16z" />
      </svg>
    )
  }
  return null
}

const TrendDelta = ({ delta }: { delta: Delta }) => (
  <span className={`inline-flex items-center gap-1 text-xs font-medium ${deltaStyles(delta.trend)}`}>
    {deltaIcon(delta.trend)}
    {delta.value}
  </span>
)

const getObjectIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'star':
      return metricIcons.star
    case 'planet':
      return metricIcons.planet
    default:
      return metricIcons.chat
  }
}

export default function Home() {
  const { spaceObjects, loading, error, getTypeStats, totalCount, refreshData } = useSpaceObjects()

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-muted">Loading environmental data...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-accent-red mb-4">Data loading error: {error}</p>
          <button
            onClick={refreshData}
            className="bg-accent-blue px-4 py-2 rounded-lg text-white hover:bg-accent-blue/80"
          >
            Retry Connection
          </button>
        </div>
      </main>
    )
  }

  const typeStats = getTypeStats()
  const totalObjects = totalCount
  const planetCount = typeStats['planet'] || 0
  const starCount = typeStats['star'] || 0
  const otherCount = totalObjects - planetCount - starCount

  const metrics: MetricCard[] = [
    {
      label: "Farm Risk Index",
      value: "67",
      icon: "farm",
      delta: { value: "-12%", trend: "up" },
    },
    {
      label: "Active Claims",
      value: "23",
      icon: "shield",
      delta: { value: "+8%", trend: "down" },
    },
    {
      label: "Fire Hotspots",
      value: "47",
      icon: "fire",
      delta: { value: "+15", trend: "down" },
    },
    {
      label: "Critical Alerts",
      value: "5",
      icon: "alert",
      delta: { value: "High", trend: "down" },
    },
  ]

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border-subtle bg-midnight-deep p-6 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue font-semibold">DP</div>
            <div>
              <p className="text-sm text-text-subtle">NASA Space Apps 2024</p>
              <p className="text-lg font-semibold text-text-primary">Data Pathways</p>
            </div>
          </div>

          <nav className="flex flex-1 flex-col gap-8">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <button
                  key={item.label}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-accent-blue/10 text-accent-blue"
                      : "text-text-subtle hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-lg border border-border-subtle ${
                      item.active ? "border-accent-blue/60 bg-accent-blue/10" : ""
                    }`}
                  />
                  {item.label}
                </button>
              ))}
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-wide text-text-subtle">Insight</p>
              <div className="flex flex-col gap-1">
                {insightItems.map((item) => (
                  <button
                    key={item}
                    className="flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-text-subtle transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    <span className="h-5 w-5 rounded-lg border border-border-subtle" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <div className="mt-auto rounded-2xl bg-navy-800 p-5">
            <p className="text-sm font-semibold text-text-primary">Sync Data</p>
            <p className="text-xs text-text-muted">Real-time NASA & Weather APIs</p>
            <button
              onClick={refreshData}
              className="mt-4 w-full rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80"
            >
              Refresh Data
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <header className="border-b border-border-subtle bg-navy-800/40 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-xl font-bold text-white">Climate & Environmental Risk Dashboard</h1>
                <p className="text-sm text-text-secondary">Real-time monitoring for Agriculture • Insurance • Wildfire Management</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-lg px-3 py-2 text-xs font-medium ${
                  error
                    ? 'bg-accent-red/10 text-accent-red'
                    : 'bg-accent-green/10 text-accent-green'
                }`}>
                  {error ? '● Offline' : '● Live Data'}
                </span>
                <button
                  onClick={refreshData}
                  className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric, idx) => {
                const iconColors = ['text-accent-green', 'text-accent-purple', 'text-accent-orange', 'text-accent-amber']
                const bgColors = ['bg-accent-green/10', 'bg-accent-purple/10', 'bg-accent-orange/10', 'bg-accent-amber/10']
                return (
                  <div key={metric.label} className="rounded-2xl bg-navy-800/60 p-6 shadow-card border border-border-subtle">
                    <div className="mb-6 flex items-center justify-between text-text-subtle">
                      <span className="text-sm font-medium text-text-secondary">{metric.label}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${bgColors[idx]} ${iconColors[idx]}`}>
                        {metricIcons[metric.icon]}
                      </div>
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-3xl font-bold text-white">{metric.value}</p>
                      <TrendDelta delta={metric.delta} />
                    </div>
                  </div>
                )
              })}
            </section>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-green/10 text-accent-green">
                      {metricIcons.farm}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Agriculture</h2>
                      <p className="text-xs text-text-subtle">Farm Risk Monitoring</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-accent-green/10 px-2 py-1 text-xs font-medium text-accent-green">Active</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Current Temperature</p>
                    <p className="text-lg font-semibold text-white">28°C <span className="text-xs text-accent-green">↑ +3°</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Frost Risk (24h)</p>
                    <p className="text-lg font-semibold text-white">12% <span className="text-xs text-text-subtle">Low</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">AQI Impact</p>
                    <p className="text-lg font-semibold text-white">Moderate <span className="text-xs text-accent-amber">PM2.5: 45</span></p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-navy-600 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-navy-500">
                  View Details →
                </button>
              </section>

              <section className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-purple/10 text-accent-purple">
                      {metricIcons.shield}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Insurance</h2>
                      <p className="text-xs text-text-subtle">Claims Verification</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-accent-amber/10 px-2 py-1 text-xs font-medium text-accent-amber">23 Claims</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Verified Claims</p>
                    <p className="text-lg font-semibold text-white">18 <span className="text-xs text-accent-green">✓ NASA Data</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Pending Review</p>
                    <p className="text-lg font-semibold text-white">5 <span className="text-xs text-text-subtle">Manual Check</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Fraud Risk</p>
                    <p className="text-lg font-semibold text-white">Low <span className="text-xs text-accent-green">8% avg</span></p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-navy-600 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-navy-500">
                  Generate Report →
                </button>
              </section>

              <section className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-orange/10 text-accent-orange">
                      {metricIcons.fire}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Wildfires</h2>
                      <p className="text-xs text-text-subtle">Real-time Monitoring</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-accent-red/10 px-2 py-1 text-xs font-medium text-accent-red">47 Active</span>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Fire Danger Index</p>
                    <p className="text-lg font-semibold text-white">92/100 <span className="text-xs text-accent-red">Critical</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">Wind Speed</p>
                    <p className="text-lg font-semibold text-white">25 km/h <span className="text-xs text-accent-amber">→ NE</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900/60 p-3">
                    <p className="text-xs text-text-muted">AQI (Smoke)</p>
                    <p className="text-lg font-semibold text-white">201 <span className="text-xs text-accent-red">Hazardous</span></p>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-navy-600 px-3 py-2 text-xs font-medium text-text-secondary hover:bg-navy-500">
                  View Hotspots →
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}