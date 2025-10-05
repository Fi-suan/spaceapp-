'use client'

import { useState } from 'react'
import { StatCard, ProgressBar, Badge, ChartCard, Sidebar } from '@/components/shared'
import { BarChart } from '@/components/charts/BarChart'
import { useWildfiresData } from '@/hooks/useWildfiresData'
import { City, DEFAULT_CITY } from '@/lib/cities'

const DEFAULT_RADIUS = 200

export default function WildfireDashboard() {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY)
  const { data, loading, error, refetch } = useWildfiresData(selectedCity.id, DEFAULT_RADIUS)

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-muted">Loading wildfire data...</p>
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
  // Используем реальные данные из API или fallback к mock данным
  const fwiData = data?.fwi_by_region && data.fwi_by_region.length > 0
    ? data.fwi_by_region
    : [
        { region: 'North', fwi: 88 },
        { region: 'South', fwi: 82 },
        { region: 'East', fwi: 67 },
        { region: 'West', fwi: 54 },
        { region: 'Central', fwi: 70 },
      ]

  const metricIcons = {
    danger: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    fire: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      </svg>
    ),
    wind: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    smoke: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  }

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar activeRoute="wildfire" selectedCity={selectedCity} onCityChange={setSelectedCity} />

        <div className="ml-0 flex-1 overflow-hidden lg:ml-72">
          <header className="border-b border-border-subtle bg-navy-800/40 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-xl font-bold text-white">Wildfire Command Center</h1>
                <p className="text-sm text-text-secondary">Real-time fire monitoring and risk assessment</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={data?.fire_danger_index.level === 'Low' ? 'green' : 'red'}>
                  <svg viewBox="0 0 8 8" fill="currentColor" className="h-2 w-2 mr-1.5">
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  {data?.fire_danger_index.level || 'Low'} Risk
                </Badge>
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
                label="Fire Danger Index"
                value={`${data?.fire_danger_index.value}/100`}
                icon={metricIcons.danger}
                trend={{ value: data?.fire_danger_index.level || "Low", direction: "neutral" }}
                iconColor="text-accent-red"
                iconBg="bg-accent-red/10"
              />
              <StatCard
                label="Active Fires"
                value={`${data?.active_fires_count || 0}`}
                icon={metricIcons.fire}
                trend={{ value: `${data?.total_fires_global.toLocaleString() || 0} global`, direction: "neutral" }}
                iconColor="text-accent-orange"
                iconBg="bg-accent-orange/10"
              />
              <StatCard
                label="Wind Speed"
                value={`${data?.wind_conditions.speed_kmh.toFixed(1)} km/h`}
                icon={metricIcons.wind}
                trend={{ value: data?.wind_conditions.direction || "N", direction: "neutral" }}
                iconColor="text-accent-blue"
                iconBg="bg-accent-blue/10"
              />
              <StatCard
                label="AQI (Smoke)"
                value={`${data?.aqi_smoke.aqi || 0}`}
                icon={metricIcons.smoke}
                trend={{ value: data?.aqi_smoke.status || "Good", direction: "neutral" }}
                iconColor="text-accent-purple"
                iconBg="bg-accent-purple/10"
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Regional Fire Risk (48h)" subtitle="Fire Weather Index by region">
                <BarChart data={fwiData} xAxisKey="region" bars={[{ dataKey: 'fwi', color: '#f97316' }]} height={250} />
              </ChartCard>

              <ChartCard title="Nearest Fires" subtitle={`Within ${data?.search_radius_km} km radius`}>
                <div className="space-y-3">
                  {data?.nearest_fires && data.nearest_fires.length > 0 ? (
                    data.nearest_fires.slice(0, 5).map((fire, idx) => (
                      <div key={idx} className={`rounded-xl p-4 border ${
                        fire.distance_km < 50 
                          ? 'bg-accent-red/10 border-accent-red/20' 
                          : 'bg-accent-orange/10 border-accent-orange/20'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-semibold ${fire.distance_km < 50 ? 'text-accent-red' : 'text-accent-orange'}`}>
                            {fire.distance_km.toFixed(1)} km away
                          </span>
                          <Badge variant={fire.distance_km < 50 ? 'red' : 'orange'}>
                            {fire.confidence}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-muted">Brightness: {fire.brightness.toFixed(1)} K</p>
                        <p className="text-sm text-text-muted">FRP: {fire.frp.toFixed(2)} MW | Date: {fire.acq_date}</p>
                        <p className="text-xs text-text-subtle mt-1">Lat: {fire.latitude.toFixed(4)}, Lon: {fire.longitude.toFixed(4)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-muted">No fires detected within {data?.search_radius_km} km</p>
                  )}
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Spread Forecast" subtitle="Fire #3421 - Threat assessment">
              <div className="space-y-4">
                <div className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                  <p className="font-semibold text-white mb-3">Weather Conditions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-text-muted text-sm">Wind:</span>{' '}
                      <span className="text-white">25 km/h NE</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-sm">Humidity:</span>{' '}
                      <span className="text-white">18%</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-sm">Temp:</span>{' '}
                      <span className="text-white">34°C</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-sm">FWI:</span>{' '}
                      <span className="text-accent-red">92</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl bg-accent-red/10 p-4 border border-accent-red/20">
                  <div className="flex items-center gap-2 mb-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-accent-red">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-semibold text-accent-red">Evacuation Required</p>
                  </div>
                  <p className="text-sm text-text-secondary mb-1">• Settlement "Berezovka" (15 km, ETA ~4 hours)</p>
                  <p className="text-sm text-text-secondary mb-3">• Protected forest zone (8 km, ETA ~2 hours)</p>
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-accent-red px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-red/80">
                      Dispatch Brigade
                    </button>
                    <button className="rounded-lg bg-navy-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-600">
                      Alert Residents
                    </button>
                  </div>
                </div>
              </div>
            </ChartCard>

            <ChartCard title="Air Quality - Affected Areas" subtitle="Smoke pollution levels">
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                  <span className="text-text-secondary">Krasnoyarsk</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <ProgressBar value={201} max={300} color="red" showPercentage={false} size="sm" />
                    </div>
                    <Badge variant="red">AQI 201</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                  <span className="text-text-secondary">Abakan</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32">
                      <ProgressBar value={156} max={300} color="orange" showPercentage={false} size="sm" />
                    </div>
                    <Badge variant="orange">AQI 156</Badge>
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </main>
  )
}
