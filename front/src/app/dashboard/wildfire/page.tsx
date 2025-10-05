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

            <ChartCard title="AI Spread Forecast" subtitle="Powered by GPT - Fire behavior prediction">
              <div className="space-y-4">
                <div className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                  <p className="font-semibold text-white mb-3">Predicted Spread Direction</p>
                  {data?.spread_forecast && Object.keys(data.spread_forecast).length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-text-muted text-sm">Direction:</span>{' '}
                        <span className="text-white">{data.spread_forecast.direction || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-text-muted text-sm">Speed:</span>{' '}
                        <span className="text-white">{data.spread_forecast.speed_kmh || 0} km/h</span>
                      </div>
                      <div>
                        <span className="text-text-muted text-sm">Confidence:</span>{' '}
                        <span className="text-white capitalize">{data.spread_forecast.confidence || 'medium'}</span>
                      </div>
                      <div>
                        <span className="text-text-muted text-sm">FDI:</span>{' '}
                        <span className="text-accent-red">{data.fire_danger_index.value}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-text-muted">No active fires for forecast</p>
                  )}
                  {data?.spread_forecast?.weather_factor && (
                    <p className="text-xs text-text-subtle mt-3">Factor: {data.spread_forecast.weather_factor}</p>
                  )}
                </div>

                {data?.threatened_areas && data.threatened_areas.length > 0 ? (
                  data.threatened_areas.map((area: { name: string; distance_km: number; eta_hours: number; priority: string }, idx: number) => {
                    const priorityConfig = {
                      critical: { bg: 'bg-accent-red/10', border: 'border-accent-red/20', color: 'text-accent-red', badge: 'red' as const },
                      high: { bg: 'bg-accent-orange/10', border: 'border-accent-orange/20', color: 'text-accent-orange', badge: 'orange' as const },
                      moderate: { bg: 'bg-accent-amber/10', border: 'border-accent-amber/20', color: 'text-accent-amber', badge: 'amber' as const },
                      low: { bg: 'bg-accent-blue/10', border: 'border-accent-blue/20', color: 'text-accent-blue', badge: 'blue' as const }
                    }
                    const config = priorityConfig[area.priority as keyof typeof priorityConfig] || priorityConfig.moderate

                    return (
                      <div key={idx} className={`rounded-xl p-4 border ${config.bg} ${config.border}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`h-5 w-5 ${config.color}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className={`font-semibold ${config.color}`}>{area.priority.charAt(0).toUpperCase() + area.priority.slice(1)} Priority</p>
                          <Badge variant={config.badge} className="ml-auto">{data.evacuation_priority}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary mb-1">• {area.name}</p>
                        <p className="text-sm text-text-secondary mb-3">• Distance: {area.distance_km} km | ETA: ~{area.eta_hours} hours</p>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-xl bg-accent-green/10 p-4 border border-accent-green/20">
                    <p className="text-sm text-accent-green">No immediate threats detected. Continue monitoring.</p>
                  </div>
                )}
              </div>
            </ChartCard>

            <ChartCard title="Air Quality Impact" subtitle="Smoke pollution from wildfires">
              <div className="space-y-3">
                <div className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                  <p className="font-semibold text-white mb-3">Current AQI</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-secondary">{selectedCity.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <ProgressBar
                          value={data?.aqi_smoke.aqi || 0}
                          max={300}
                          color={(data?.aqi_smoke.aqi || 0) > 150 ? 'red' : (data?.aqi_smoke.aqi || 0) > 100 ? 'orange' : 'green'}
                          showPercentage={false}
                          size="sm"
                        />
                      </div>
                      <Badge variant={
                        (data?.aqi_smoke.aqi || 0) > 150 ? 'red' :
                        (data?.aqi_smoke.aqi || 0) > 100 ? 'orange' :
                        (data?.aqi_smoke.aqi || 0) > 50 ? 'amber' : 'green'
                      }>
                        AQI {data?.aqi_smoke.aqi || 0}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <span className="text-text-muted text-sm">Status:</span>{' '}
                      <span className="text-white">{data?.aqi_smoke.status || 'Good'}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-sm">PM2.5:</span>{' '}
                      <span className="text-white">{data?.aqi_smoke.pm2_5 || 0} µg/m³</span>
                    </div>
                  </div>
                </div>

                {data?.air_quality_impact && (
                  <div className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                    <p className="font-semibold text-white mb-2">Smoke Impact Forecast</p>
                    <p className="text-sm text-text-secondary mb-1">
                      Affected radius: ~{data.air_quality_impact.affected_radius_km || 0} km
                    </p>
                    <p className="text-sm text-text-secondary">
                      Severity: <span className="capitalize">{data.air_quality_impact.severity || 'low'}</span>
                    </p>
                  </div>
                )}

                {(data?.active_fires_count || 0) > 0 && (
                  <div className="rounded-xl bg-accent-amber/10 p-3 border border-accent-amber/20">
                    <p className="text-xs text-text-secondary">
                      ⚠️ {data?.active_fires_count} active fire{(data?.active_fires_count || 0) > 1 ? 's' : ''} within {data?.search_radius_km} km may impact air quality
                    </p>
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
