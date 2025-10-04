'use client'

import { StatCard, ProgressBar, Badge, ChartCard, Sidebar } from '@/components/shared'
import { CheckIcon, AlertTriangleIcon, SproutIcon } from '@/components/shared/Icons'
import { LineChart } from '@/components/charts/LineChart'

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

const forecastData = [
  { date: 'Mon', tempMin: 12, tempMax: 24, precipitation: 0 },
  { date: 'Tue', tempMin: 14, tempMax: 26, precipitation: 0 },
  { date: 'Wed', tempMin: 13, tempMax: 25, precipitation: 2 },
  { date: 'Thu', tempMin: 11, tempMax: 23, precipitation: 5 },
  { date: 'Fri', tempMin: 15, tempMax: 27, precipitation: 0 },
  { date: 'Sat', tempMin: 16, tempMax: 28, precipitation: 0 },
  { date: 'Sun', tempMin: 14, tempMax: 26, precipitation: 1 },
]

const aqiData = [
  { time: '00:00', aqi: 42 },
  { time: '04:00', aqi: 38 },
  { time: '08:00', aqi: 45 },
  { time: '12:00', aqi: 52 },
  { time: '16:00', aqi: 48 },
  { time: '20:00', aqi: 44 },
]

export default function FarmDashboard() {
  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar activeRoute="farm" />

        <div className="flex-1 overflow-hidden">
          <header className="border-b border-border-subtle bg-navy-800/40 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-xl font-bold text-white">Farm Health Monitor</h1>
                <p className="text-sm text-text-secondary">Real-time agricultural conditions and forecasts</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="green">● Live Data</Badge>
                <button className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Temperature"
                value="22°C"
                icon={metricIcons.thermometer}
                trend={{ value: "+2°", direction: "up" }}
                iconColor="text-accent-blue"
                iconBg="bg-accent-blue/10"
              />
              <StatCard
                label="Humidity"
                value="65%"
                icon={metricIcons.droplet}
                trend={{ value: "-5%", direction: "down" }}
                iconColor="text-accent-green"
                iconBg="bg-accent-green/10"
              />
              <StatCard
                label="Wind Speed"
                value="12 km/h"
                icon={metricIcons.wind}
                trend={{ value: "Optimal", direction: "neutral" }}
                iconColor="text-accent-purple"
                iconBg="bg-accent-purple/10"
              />
              <StatCard
                label="Frost Risk"
                value="Low"
                icon={metricIcons.alert}
                trend={{ value: "8%", direction: "up" }}
                iconColor="text-accent-amber"
                iconBg="bg-accent-amber/10"
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

              <ChartCard title="Air Quality Index" subtitle="PM2.5 levels today">
                <LineChart
                  data={aqiData}
                  xAxisKey="time"
                  lines={[{ dataKey: 'aqi', color: '#10b981', name: 'AQI' }]}
                  height={250}
                />
              </ChartCard>
            </div>

            <ChartCard
              title="Recommendations"
              subtitle="Based on current weather conditions"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl bg-navy-900 p-4 border border-accent-green/20">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-accent-green"><CheckIcon /></span>
                    <span className="text-sm font-semibold text-text-primary">Spraying Safe</span>
                  </div>
                  <p className="text-xs text-text-muted">Wind speed optimal, no rain forecast for 24h</p>
                </div>
                <div className="rounded-xl bg-navy-900 p-4 border border-accent-amber/20">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-accent-amber"><AlertTriangleIcon /></span>
                    <span className="text-sm font-semibold text-text-primary">Frost Warning</span>
                  </div>
                  <p className="text-xs text-text-muted">Possible frost tonight (-2°C). Cover sensitive crops</p>
                </div>
                <div className="rounded-xl bg-navy-900 p-4 border border-accent-blue/20">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-accent-blue"><SproutIcon /></span>
                    <span className="text-sm font-semibold text-text-primary">Best Planting Days</span>
                  </div>
                  <p className="text-xs text-text-muted">Friday and Saturday ideal for sowing</p>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Risk Alerts" subtitle="Critical conditions requiring attention">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-accent-red/10 p-4 border border-accent-red/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-red/20">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-accent-red">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-accent-red">High Frost Risk</p>
                      <p className="text-sm text-text-muted">May 23-24, temperatures down to -3°C</p>
                    </div>
                  </div>
                  <Badge variant="red">Critical</Badge>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-accent-amber/10 p-4 border border-accent-amber/20">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-amber/20">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-accent-amber">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-accent-amber">Drought Warning</p>
                      <p className="text-sm text-text-muted">No precipitation for 14 days</p>
                    </div>
                  </div>
                  <Badge variant="amber">Medium</Badge>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </main>
  )
}
