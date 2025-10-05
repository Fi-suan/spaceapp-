'use client'

import { useState } from 'react'
import { StatCard, ProgressBar, Badge, ChartCard, Sidebar } from '@/components/shared'
import { LineChart } from '@/components/charts/LineChart'
import { useInsuranceData } from '@/hooks/useInsuranceData'
import { City, DEFAULT_CITY } from '@/lib/cities'

export default function InsuranceDashboard() {
  const [selectedCity, setSelectedCity] = useState<City>(DEFAULT_CITY)
  const { data, loading, error, refetch } = useInsuranceData(selectedCity.id, selectedCity.nameEn)

  if (loading) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-text-muted">Loading insurance data...</p>
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
  const riskData = data?.risk_trends && data.risk_trends.length > 0
    ? data.risk_trends
    : [
        { month: 'Jan', riskScore: 45 },
        { month: 'Feb', riskScore: 52 },
        { month: 'Mar', riskScore: 48 },
        { month: 'Apr', riskScore: 65 },
        { month: 'May', riskScore: 72 },
      ]

  const metricIcons = {
    risk: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    claims: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    verified: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    fraud: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  }

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar activeRoute="insurance" selectedCity={selectedCity} onCityChange={setSelectedCity} />

        <div className="ml-0 flex-1 overflow-hidden lg:ml-72">
          <header className="border-b border-border-subtle bg-navy-800/40 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-xl font-bold text-white">Risk Analytics Platform</h1>
                <p className="text-sm text-text-secondary">Insurance claims verification and risk assessment</p>
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
                label="Risk Assessment"
                value={data?.risk_assessment.level || "Low"}
                icon={metricIcons.risk}
                trend={{ value: `Score: ${data?.risk_assessment.score || 0}`, direction: "neutral" }}
                iconColor="text-accent-amber"
                iconBg="bg-accent-amber/10"
              />
              <StatCard
                label="Avg Temperature"
                value={`${data?.climate_summary.avg_temperature.toFixed(1)}°C`}
                icon={metricIcons.claims}
                trend={{ value: `${data?.climate_summary.days_analyzed} days`, direction: "neutral" }}
                iconColor="text-accent-purple"
                iconBg="bg-accent-purple/10"
              />
              <StatCard
                label="Total Precipitation"
                value={`${data?.climate_summary.total_precipitation.toFixed(1)} mm`}
                icon={metricIcons.verified}
                trend={{ value: `${data?.climate_summary.days_analyzed} days`, direction: "neutral" }}
                iconColor="text-accent-green"
                iconBg="bg-accent-green/10"
              />
              <StatCard
                label="Weather Events"
                value={data?.weather_verified_events.length.toString() || "0"}
                icon={metricIcons.fraud}
                trend={{ value: data?.region || "Moscow", direction: "neutral" }}
                iconColor="text-accent-blue"
                iconBg="bg-accent-blue/10"
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Risk Trends (7 days)" subtitle="Daily risk scores based on weather conditions">
                <LineChart data={riskData} xAxisKey="month" lines={[{ dataKey: 'riskScore', color: '#f59e0b' }]} height={250} />
              </ChartCard>

              <ChartCard title="AI Climate Risks" subtitle="Powered by GPT - Insurance risk analysis">
                <div className="space-y-4">
                  {data?.climate_risks && data.climate_risks.length > 0 ? (
                    data.climate_risks.map((risk: { type: string; count: string; severity: string }, index: number) => {
                      const severityConfig = {
                        critical: 'red' as const,
                        high: 'amber' as const,
                        medium: 'blue' as const,
                        low: 'green' as const
                      }
                      const variant = severityConfig[risk.severity as keyof typeof severityConfig] || 'dark' as const

                      return (
                        <div key={index} className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                          <span className="text-sm text-text-secondary">{risk.type}</span>
                          <Badge variant={variant}>{risk.count}</Badge>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                      <span className="text-sm text-text-secondary">Loading climate risks...</span>
                      <Badge variant="dark">-</Badge>
                    </div>
                  )}
                </div>
              </ChartCard>
            </div>

            <ChartCard title="AI Claim Verification" subtitle="AI-generated verified claims (Powered by GPT)">
              <div className="space-y-3">
                {data?.verified_claims && data.verified_claims.length > 0 ? (
                  data.verified_claims.map((claim: {
                    claim_id: string;
                    type: string;
                    location: string;
                    status: string;
                    evidence: string[];
                    fraud_probability: string
                  }, index: number) => {
                    const statusConfig = {
                      verified: { variant: 'green' as const, label: 'Verified' },
                      pending: { variant: 'amber' as const, label: 'Pending' },
                      rejected: { variant: 'red' as const, label: 'Rejected' }
                    }
                    const config = statusConfig[claim.status as keyof typeof statusConfig] || statusConfig.verified

                    return (
                      <div key={index} className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-white">{claim.claim_id} - {claim.type}</p>
                            <p className="text-sm text-text-muted">{claim.location}</p>
                          </div>
                          <Badge variant={config.variant}>{config.label}</Badge>
                        </div>
                        <div className="space-y-2">
                          {claim.evidence && claim.evidence.map((evidence: string, i: number) => (
                            <p key={i} className="text-sm text-text-secondary">✓ {evidence}</p>
                          ))}
                          <p className="text-sm text-accent-green">Fraud probability: {claim.fraud_probability}</p>
                        </div>
                        <button className="mt-3 text-sm text-accent-blue hover:underline">Download PDF Report →</button>
                      </div>
                    )
                  })
                ) : (
                  <div className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                    <p className="text-sm text-text-muted">No verified claims available. AI is analyzing weather data...</p>
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
