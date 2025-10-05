'use client'

import { useState } from 'react'
import { StatCard, ProgressBar, Badge, ChartCard, Sidebar } from '@/components/shared'
import { CheckIcon, AlertTriangleIcon, SproutIcon } from '@/components/shared/Icons'
import { LineChart } from '@/components/charts/LineChart'
import { useAgricultureData } from '@/hooks/useAgricultureData'
import { City, DEFAULT_CITY } from '@/lib/cities'

const metricIcons = {
  thermometer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  droplet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  wind: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

export default function FarmDashboard() {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY)
  const { data, loading, error, refetch } = useAgricultureData(selectedCity.id)

  // Используем реальные данные из API или fallback к mock данным
  const forecastData = data?.forecast_7day && data.forecast_7day.length > 0
    ? data.forecast_7day
    : [
        { date: 'Mon', tempMin: 12, tempMax: 24, precipitation: 0 },
        { date: 'Tue', tempMin: 14, tempMax: 26, precipitation: 0 },
        { date: 'Wed', tempMin: 13, tempMax: 25, precipitation: 2 },
        { date: 'Thu', tempMin: 11, tempMax: 23, precipitation: 5 },
        { date: 'Fri', tempMin: 15, tempMax: 27, precipitation: 0 },
        { date: 'Sat', tempMin: 16, tempMax: 28, precipitation: 0 },
        { date: 'Sun', tempMin: 14, tempMax: 26, precipitation: 1 },
      ]

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-muted">Loading agricultural data...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-accent-red mb-4">Error: {error}</p>
          <button
            onClick={refetch}
            className="bg-accent-blue px-4 py-2 rounded-lg text-white hover:bg-accent-blue/80"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar activeRoute="farm" selectedCity={selectedCity} onCityChange={setSelectedCity} />

        <div className="ml-0 flex-1 overflow-hidden lg:ml-72">
          <header className="border-b border-border-subtle bg-navy-800/40 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-xl font-bold text-white">Farm Health Monitor</h1>
                <p className="text-sm text-text-secondary">Real-time agricultural conditions and forecasts</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="green">● Live Data</Badge>
                <button 
                  onClick={refetch}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80 disabled:opacity-50"
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
              <StatCard
                label="Current Temperature"
                value={`${data?.current_temperature.toFixed(1)}°C`}
                icon={metricIcons.thermometer}
                trend={{ value: "Real-time", direction: "neutral" }}
                iconColor="text-accent-blue"
                iconBg="bg-accent-blue/10"
              />
              <StatCard
                label="Frost Risk"
                value={`${data?.frost_risk.percentage}%`}
                icon={metricIcons.alert}
                trend={{ value: data?.frost_risk.status || "Low", direction: "neutral" }}
                iconColor="text-accent-amber"
                iconBg="bg-accent-amber/10"
              />
              <StatCard
                label="Humidity"
                value={`${data?.humidity.toFixed(1)}%`}
                icon={metricIcons.droplet}
                trend={{ value: "Normal", direction: "neutral" }}
                iconColor="text-accent-green"
                iconBg="bg-accent-green/10"
              />
              <StatCard
                label="Wind Speed"
                value={`${data?.wind_speed.toFixed(1)} m/s`}
                icon={metricIcons.wind}
                trend={{ value: `${((data?.wind_speed || 0) * 3.6).toFixed(1)} km/h`, direction: "neutral" }}
                iconColor="text-accent-purple"
                iconBg="bg-accent-purple/10"
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="7-Day Forecast" subtitle="Temperature range and precipitation">
                <LineChart
                  data={forecastData}
                  xAxisKey="date"
                  lines={[
                    { dataKey: 'tempMax', color: '#f97316', name: 'Max Temp' },
                    { dataKey: 'tempMin', color: '#3b82f6', name: 'Min Temp' },
                  ]}
                  height={250}
                />
              </ChartCard>

              <ChartCard title="Air Quality Impact" subtitle="PM2.5 and AQI status">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">AQI Status:</span>
                    <Badge variant={data?.aqi_impact.status === 'Good' ? 'green' : 'amber'}>
                      {data?.aqi_impact.status || 'Good'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">PM2.5 Level:</span>
                    <span className="text-lg font-bold text-white">{data?.aqi_impact.pm2_5.toFixed(1)} μg/m³</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Precipitation:</span>
                    <span className="text-lg font-bold text-white">{data?.precipitation.toFixed(1)} mm/day</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <p className="text-xs text-text-muted">
                      Current air quality is {data?.aqi_impact.status.toLowerCase()} for agricultural activities
                    </p>
                  </div>
                </div>
              </ChartCard>
            </div>

            <ChartCard
              title="AI Recommendations"
              subtitle="Based on current weather conditions (Powered by GPT)"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="space-y-3">
                {data?.recommendations && data.recommendations.length > 0 ? (
                  data.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="rounded-xl bg-navy-900 p-4 border border-accent-green/20">
                      <div className="flex items-start gap-3">
                        <span className="text-accent-green flex-shrink-0 mt-0.5"><CheckIcon /></span>
                        <p className="text-sm text-text-primary">{recommendation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-navy-900 p-4 border border-accent-blue/20">
                    <div className="flex items-center gap-2">
                      <span className="text-accent-blue"><CheckIcon /></span>
                      <p className="text-sm text-text-muted">Loading AI recommendations...</p>
                    </div>
                  </div>
                )}
              </div>
            </ChartCard>

            <ChartCard title="AI Risk Alerts" subtitle="Critical conditions detected by AI (Powered by GPT)">
              <div className="space-y-3">
                {data?.risk_alerts && data.risk_alerts.length > 0 ? (
                  data.risk_alerts.map((alert: { level: string; message: string }, index: number) => {
                    const alertConfig = {
                      critical: {
                        bg: 'bg-accent-red/10',
                        border: 'border-accent-red/20',
                        iconBg: 'bg-accent-red/20',
                        iconColor: 'text-accent-red',
                        textColor: 'text-accent-red',
                        badge: 'red' as const
                      },
                      warning: {
                        bg: 'bg-accent-amber/10',
                        border: 'border-accent-amber/20',
                        iconBg: 'bg-accent-amber/20',
                        iconColor: 'text-accent-amber',
                        textColor: 'text-accent-amber',
                        badge: 'amber' as const
                      },
                      info: {
                        bg: 'bg-accent-blue/10',
                        border: 'border-accent-blue/20',
                        iconBg: 'bg-accent-blue/20',
                        iconColor: 'text-accent-blue',
                        textColor: 'text-accent-blue',
                        badge: 'blue' as const
                      }
                    }

                    const config = alertConfig[alert.level as keyof typeof alertConfig] || alertConfig.info

                    return (
                      <div key={index} className={`flex items-center justify-between rounded-xl p-4 border ${config.bg} ${config.border}`}>
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${config.iconBg}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor" className={`h-6 w-6 ${config.iconColor}`}>
                              <circle cx="12" cy="12" r="10" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold ${config.textColor}`}>{alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}</p>
                            <p className="text-sm text-text-muted">{alert.message}</p>
                          </div>
                        </div>
                        <Badge variant={config.badge}>{alert.level}</Badge>
                      </div>
                    )
                  })
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-accent-green/10 p-4 border border-accent-green/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-green/20">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-accent-green">
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-accent-green">All Clear</p>
                        <p className="text-sm text-text-muted">No significant weather risks detected</p>
                      </div>
                    </div>
                    <Badge variant="green">Safe</Badge>
                  </div>
                )}
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </main>
  )
}
