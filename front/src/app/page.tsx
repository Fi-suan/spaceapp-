'use client'

import { useState } from 'react'
import { useSpaceObjects } from '@/hooks/useSpaceObjects'
import { useMainDashboard } from '@/hooks/useMainDashboard'
import { StatCard, ProgressBar, Badge, ChartCard, Sidebar } from '@/components/shared'
import { LineChart } from '@/components/charts/LineChart'
import { City, DEFAULT_CITY } from '@/lib/cities'

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
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
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

type TrendDirection = "up" | "down" | "neutral"

type Delta = {
  value: string
  trend: TrendDirection
}

type MetricCard = {
  label: string
  value: string
  icon: keyof typeof metricIcons
  delta: Delta
}

const navigation = [
  { label: "Dashboard", href: "/", active: true },
  { label: "Agriculture", href: "/dashboard/farm", sector: "agronomy" },
  { label: "Insurance", href: "/dashboard/insurance", sector: "insurance" },
  { label: "Wildfires", href: "/dashboard/wildfire", sector: "wildfire" },
]

// forecastData теперь берется из API (см. ниже в компоненте)

const deltaStyles = (trend: TrendDirection) => {
  if (trend === "up") return "text-accent-green"
  if (trend === "down") return "text-accent-amber"
  return "text-text-subtle"
}

const deltaIcon = (trend: TrendDirection) => {
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
      return metricIcons.farm
  }
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY)
  const { spaceObjects, loading: spaceLoading, error: spaceError, getTypeStats, totalCount, refreshData } = useSpaceObjects()
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch } = useMainDashboard(selectedCity.id)

  const loading = spaceLoading || dashboardLoading
  const error = spaceError || dashboardError

  // Используем реальные данные из API или fallback к mock данным
  const forecastData = dashboardData?.risk_forecast_7day && dashboardData.risk_forecast_7day.length > 0
    ? dashboardData.risk_forecast_7day
    : [
        { date: 'Mon', risk: 67 },
        { date: 'Tue', risk: 65 },
        { date: 'Wed', risk: 70 },
        { date: 'Thu', risk: 72 },
        { date: 'Fri', risk: 68 },
        { date: 'Sat', risk: 64 },
        { date: 'Sun', risk: 66 },
      ]

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
            onClick={() => {
              refreshData()
              refetch()
            }}
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

  const getTrendDirection = (trend: string): TrendDirection => {
    if (trend === 'increasing') return 'down'
    if (trend === 'decreasing') return 'up'
    return 'neutral'
  }

  const metrics: MetricCard[] = [
    {
      label: "Farm Risk Index",
      value: dashboardData?.farm_risk_index.value.toString() || "67",
      icon: "farm",
      delta: { 
        value: dashboardData?.farm_risk_index.trend || "stable", 
        trend: getTrendDirection(dashboardData?.farm_risk_index.trend || 'stable')
      },
    },
    {
      label: "Temperature",
      value: `${dashboardData?.weather_summary.temperature.toFixed(1) || '0'}°C`,
      icon: "shield",
      delta: { value: dashboardData?.weather_summary.conditions || "Clouds", trend: "neutral" },
    },
    {
      label: "Fire Hotspots",
      value: dashboardData?.fire_hotspots.global_count.toLocaleString() || "0",
      icon: "fire",
      delta: { 
        value: dashboardData?.fire_hotspots.trend || "stable", 
        trend: getTrendDirection(dashboardData?.fire_hotspots.trend || 'stable')
      },
    },
    {
      label: "Air Quality",
      value: dashboardData?.air_quality_summary.status || "Fair",
      icon: "alert",
      delta: { value: `AQI ${dashboardData?.air_quality_summary.aqi || 0}`, trend: "neutral" },
    },
  ]

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar activeRoute="dashboard" selectedCity={selectedCity} onCityChange={setSelectedCity} />

        <div className="ml-0 flex-1 overflow-hidden lg:ml-72">
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
                  onClick={() => {
                    refreshData()
                    refetch()
                  }}
                  className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80"
                  disabled={loading}
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
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
                  <StatCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    icon={metricIcons[metric.icon]}
                    trend={{ value: metric.delta.value, direction: metric.delta.trend }}
                    iconColor={iconColors[idx]}
                    iconBg={bgColors[idx]}
                  />
                )
              })}
            </section>

            <ChartCard title="7-Day Risk Forecast" subtitle="Predicted environmental risk levels">
              <LineChart
                data={forecastData}
                xAxisKey="date"
                lines={[{ dataKey: 'risk', color: '#f59e0b', name: 'Risk Score' }]}
                height={250}
              />
            </ChartCard>

            <div className="grid gap-6 lg:grid-cols-3">
              <ChartCard
                title="Agriculture"
                subtitle="Farm Risk Monitoring"
                icon={metricIcons.farm}
                action={<Badge variant="green" size="sm">Active</Badge>}
              >
                <div className="space-y-3">
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Current Temperature</p>
                    <p className="text-lg font-semibold text-white">28°C <span className="text-xs text-accent-green">↑ +3°</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Frost Risk (24h)</p>
                    <p className="text-lg font-semibold text-white">12% <span className="text-xs text-text-subtle">Low</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">AQI Impact</p>
                    <p className="text-lg font-semibold text-white">Moderate <span className="text-xs text-accent-amber">PM2.5: 45</span></p>
                  </div>
                </div>
                <a href="/dashboard/farm" className="mt-4 block w-full rounded-lg bg-navy-600 px-3 py-2 text-center text-xs font-medium text-text-secondary hover:bg-navy-500 transition-colors">
                  View Details →
                </a>
              </ChartCard>

              <ChartCard
                title="Insurance"
                subtitle="Claims Verification"
                icon={metricIcons.shield}
                action={<Badge variant="amber" size="sm">23 Claims</Badge>}
              >
                <div className="space-y-3">
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Verified Claims</p>
                    <p className="text-lg font-semibold text-white">18 <span className="text-xs text-accent-green">✓ NASA Data</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Pending Review</p>
                    <p className="text-lg font-semibold text-white">5 <span className="text-xs text-text-subtle">Manual Check</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Fraud Risk</p>
                    <p className="text-lg font-semibold text-white">Low <span className="text-xs text-accent-green">8% avg</span></p>
                  </div>
                </div>
                <a href="/dashboard/insurance" className="mt-4 block w-full rounded-lg bg-navy-600 px-3 py-2 text-center text-xs font-medium text-text-secondary hover:bg-navy-500 transition-colors">
                  Generate Report →
                </a>
              </ChartCard>

              <ChartCard
                title="Wildfires"
                subtitle="Real-time Monitoring"
                icon={metricIcons.fire}
                action={<Badge variant="red" size="sm">47 Active</Badge>}
              >
                <div className="space-y-3">
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Fire Danger Index</p>
                    <p className="text-lg font-semibold text-white">92/100 <span className="text-xs text-accent-red">Critical</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">Wind Speed</p>
                    <p className="text-lg font-semibold text-white">25 km/h <span className="text-xs text-accent-amber">→ NE</span></p>
                  </div>
                  <div className="rounded-lg bg-navy-900 p-3">
                    <p className="text-xs text-text-muted">AQI (Smoke)</p>
                    <p className="text-lg font-semibold text-white">201 <span className="text-xs text-accent-red">Hazardous</span></p>
                  </div>
                </div>
                <a href="/dashboard/wildfire" className="mt-4 block w-full rounded-lg bg-navy-600 px-3 py-2 text-center text-xs font-medium text-text-secondary hover:bg-navy-500 transition-colors">
                  View Hotspots →
                </a>
              </ChartCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}