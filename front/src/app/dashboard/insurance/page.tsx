'use client'

import { StatCard, ProgressBar, Badge, ChartCard, Sidebar } from '@/components/shared'
import { LineChart } from '@/components/charts/LineChart'

export default function InsuranceDashboard() {
  const riskData = [
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
        <Sidebar activeRoute="insurance" />

        <div className="flex-1 overflow-hidden">
          <header className="border-b border-border-subtle bg-navy-800/40 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-xl font-bold text-white">Risk Analytics Platform</h1>
                <p className="text-sm text-text-secondary">Insurance claims verification and risk assessment</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="green">● Live Data</Badge>
                <button className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80">
                  Export Report
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Risk Level"
                value="65/100"
                icon={metricIcons.risk}
                trend={{ value: "Medium", direction: "neutral" }}
                iconColor="text-accent-amber"
                iconBg="bg-accent-amber/10"
              />
              <StatCard
                label="Total Claims"
                value="23"
                icon={metricIcons.claims}
                trend={{ value: "+8%", direction: "up" }}
                iconColor="text-accent-purple"
                iconBg="bg-accent-purple/10"
              />
              <StatCard
                label="Verified"
                value="18"
                icon={metricIcons.verified}
                trend={{ value: "78%", direction: "up" }}
                iconColor="text-accent-green"
                iconBg="bg-accent-green/10"
              />
              <StatCard
                label="Fraud Risk"
                value="8%"
                icon={metricIcons.fraud}
                trend={{ value: "Low", direction: "up" }}
                iconColor="text-accent-blue"
                iconBg="bg-accent-blue/10"
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Regional Risk Trends" subtitle="Monthly risk scores">
                <LineChart data={riskData} xAxisKey="month" lines={[{ dataKey: 'riskScore', color: '#f59e0b' }]} height={250} />
              </ChartCard>

              <ChartCard title="Climate Risks" subtitle="Current period">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                    <span className="text-sm text-text-secondary">Frost Events</span>
                    <Badge variant="dark">2 events</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                    <span className="text-sm text-text-secondary">Drought Days</span>
                    <Badge variant="dark">18 days</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                    <span className="text-sm text-text-secondary">Fire Incidents</span>
                    <Badge variant="dark">3 within 50km</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-navy-900 p-3">
                    <span className="text-sm text-text-secondary">NDVI Change</span>
                    <Badge variant="red">-12% vs last year</Badge>
                  </div>
                </div>
              </ChartCard>
            </div>

            <ChartCard title="Claim Verification" subtitle="Recent insurance claims">
              <div className="space-y-3">
                <div className="rounded-xl bg-navy-900 p-4 border border-border-subtle">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-white">Claim #4521 - Drought Loss</p>
                      <p className="text-sm text-text-muted">Krasnoyarsk Region, May 2024</p>
                    </div>
                    <Badge variant="green">Verified</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-text-secondary">✓ 0 mm precipitation: May 01-19</p>
                    <p className="text-sm text-text-secondary">✓ Temperature &gt;30°C: 14 days</p>
                    <p className="text-sm text-text-secondary">✓ NDVI dropped 28%</p>
                    <p className="text-sm text-accent-green">Fraud probability: 8% (Low)</p>
                  </div>
                  <button className="mt-3 text-sm text-accent-blue hover:underline">Download PDF Report →</button>
                </div>
              </div>
            </ChartCard>
          </div>
        </div>
      </div>
    </main>
  )
}
