const metricIcons = {
  visibility: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M1.5 12c2.1-4.5 6.3-7.5 10.5-7.5S20.4 7.5 22.5 12c-2.1 4.5-6.3 7.5-10.5 7.5S3.6 16.5 1.5 12Z" />
      <circle cx="12" cy="12" r="3.5" strokeWidth="1.8" />
    </svg>
  ),
  pulse: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 12h3.5l2-4 4.5 8 2-4h6" />
    </svg>
  ),
  trophy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M8 3h8v3h3.5a1.5 1.5 0 0 1 0 3h-1.5c-.7 3.5-3 5.5-5 6v2h3v2H8v-2h3v-2c-2-.5-4.3-2.5-5-6H4.5a1.5 1.5 0 0 1 0-3H8V3Z" />
    </svg>
  ),
  chat: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H9l-4 4V6Z" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3ZM5 16l1.3 3.2L9 20.5 6.2 21.7 5 25l-1.3-3.3L1 20.5l2.7-1.3L5 16Zm14 0 1.3 3.2 2.7 1.3-2.8 1.2L19 25l-1.3-3.3-2.7-1.2 2.7-1.3L19 16Z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m13 2-8 12h6l-1 8 8-12h-6l1-8Z" />
    </svg>
  ),
  robot: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <rect x="3" y="6" width="18" height="12" rx="3" strokeWidth="1.6" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <path strokeLinecap="round" strokeWidth="1.6" d="M12 3v3m0 12v3" />
    </svg>
  ),
  crown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 18h16l1-9-4 3-3-6-3 6-4-3 1 9Z" />
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

type ModelCard = {
  name: string
  visibility: number
  presence: number
  delta: Delta
  icon: keyof typeof metricIcons
}

type Prompt = {
  text: string
  score: number
  mentions: number
  trend: "trending" | "rising" | "stable"
}

type Competitor = {
  rank: number
  name: string
  score: number
  delta: Delta
  initials: string
}

type OptimizationBreakdown = {
  label: string
  count: number
}

const metrics: MetricCard[] = [
  {
    label: "Visibility Score",
    value: "8.4",
    icon: "visibility",
    delta: { value: "+12.5%", trend: "up" },
  },
  {
    label: "Presence Score",
    value: "74%",
    icon: "pulse",
    delta: { value: "+8.2%", trend: "up" },
  },
  {
    label: "Average Rank",
    value: "2.3",
    icon: "trophy",
    delta: { value: "-0.4", trend: "down" },
  },
  {
    label: "Mentions",
    value: "1,247",
    icon: "chat",
    delta: { value: "+23.1%", trend: "up" },
  },
]

const models: ModelCard[] = [
  { name: "OpenAI", visibility: 87, presence: 82, delta: { value: "+12.5%", trend: "up" }, icon: "robot" },
  { name: "Claude", visibility: 72, presence: 68, delta: { value: "+5.3%", trend: "up" }, icon: "spark" },
  { name: "Gemini", visibility: 68, presence: 71, delta: { value: "-2.1%", trend: "down" }, icon: "bolt" },
  { name: "Meta AI", visibility: 59, presence: 64, delta: { value: "+8.7%", trend: "up" }, icon: "robot" },
  { name: "Grok", visibility: 42, presence: 45, delta: { value: "0%", trend: "neutral" }, icon: "bolt" },
  { name: "DeepSeek", visibility: 31, presence: 38, delta: { value: "+15.2%", trend: "up" }, icon: "spark" },
]

const prompts: Prompt[] = [
  { text: "What are the best project management tools for remote teams?", score: 94, mentions: 1247, trend: "trending" },
  { text: "How to implement AI in customer service workflows?", score: 89, mentions: 892, trend: "rising" },
  { text: "Best practices for digital marketing automation", score: 85, mentions: 756, trend: "stable" },
  { text: "Software development lifecycle management", score: 82, mentions: 684, trend: "rising" },
]

const competitors: Competitor[] = [
  { rank: 1, name: "AI8 Digital", score: 8.4, delta: { value: "+0.3", trend: "up" }, initials: "A8" },
  { rank: 2, name: "TechCorp Solutions", score: 7.9, delta: { value: "-0.1", trend: "down" }, initials: "TC" },
  { rank: 3, name: "InnovateLabs", score: 7.6, delta: { value: "+0.2", trend: "up" }, initials: "IL" },
  { rank: 4, name: "NextGen Analytics", score: 7.2, delta: { value: "0", trend: "neutral" }, initials: "NG" },
  { rank: 5, name: "DataWise Pro", score: 6.8, delta: { value: "-0.4", trend: "down" }, initials: "DW" },
]

const navigation = [
  { label: "Dashboard", active: true },
  { label: "Reports" },
  { label: "Prompts" },
  { label: "Optimize" },
  { label: "Insight" },
]

const insightItems = ["Intelligence", "Sentiment", "Citations"]

const optimizationScore = {
  value: 74,
  breakdown: [
    { label: "Critical", count: 2 },
    { label: "Opportunities", count: 5 },
    { label: "Resolved", count: 12 },
  ] as OptimizationBreakdown[],
}

const visibilitySeries = [135, 130, 125, 118, 120, 115, 112]
const presenceSeries = [120, 110, 105, 95, 100, 92, 88]

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

const formatPercent = (value: number) => `${value}%`

const TrendDelta = ({ delta }: { delta: Delta }) => (
  <span className={`inline-flex items-center gap-1 text-xs font-medium ${deltaStyles(delta.trend)}`}>
    {deltaIcon(delta.trend)}
    {delta.value}
  </span>
)

const ProgressBar = ({ value, color }: { value: number; color: string }) => {
  const clamped = Math.max(0, Math.min(value, 100))

  return (
    <div className="mt-2 h-2 w-full rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export default function Home() {
  const scoreArc = (optimizationScore.value / 100) * 360

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border-subtle bg-navy-900/80 p-6 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue font-semibold">A8</div>
            <div>
              <p className="text-sm text-text-subtle">LLM Analytics Platform</p>
              <p className="text-lg font-semibold text-text-primary">AI8 Digital</p>
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
            <p className="text-sm font-semibold text-text-primary">Upgrade to Pro</p>
            <p className="text-xs text-text-muted">Unlock advanced analytics</p>
            <button className="mt-4 w-full rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80">
              Upgrade Now
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <header className="border-b border-border-subtle bg-navy-900/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-text-muted">Monitor your brand's visibility across AI models</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-text-muted hover:border-white/20">
                  Live Data
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4h12v9H6l-2 3V4Z" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-10 px-6 py-10">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                  <div className="mb-6 flex items-center justify-between text-text-subtle">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-accent-blue">
                      {metricIcons[metric.icon]}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-semibold text-white">{metric.value}</p>
                    <TrendDelta delta={metric.delta} />
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg text-white">Visibility & Presence Trends</h2>
                    <p className="text-sm text-text-muted">Track your brand's performance across AI models over the last 7 days</p>
                  </div>
                  <div className="flex rounded-full bg-white/5 p-1 text-xs">
                    <button className="rounded-full bg-accent-blue px-3 py-1 font-medium text-white">
                      Visibility & Presence
                    </button>
                    <button className="px-3 py-1 text-text-muted hover:text-text-primary">
                      Mentions & Citations
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  <svg viewBox="0 0 400 160" className="w-full">
                    <defs>
                      <linearGradient id="blueLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#4f8cff" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id="greenLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <polyline
                      points={presenceSeries.map((y, index) => `${20 + index * 60},${y}`).join(" ")}
                      fill="none"
                      stroke="url(#greenLine)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <polyline
                      points={visibilitySeries.map((y, index) => `${20 + index * 60},${y}`).join(" ")}
                      fill="none"
                      stroke="url(#blueLine)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <g fill="#4f8cff">
                      {visibilitySeries.map((y, index) => (
                        <circle key={`blue-${index}`} cx={20 + index * 60} cy={y} r="4" />
                      ))}
                    </g>
                    <g fill="#22c55e">
                      {presenceSeries.map((y, index) => (
                        <circle key={`green-${index}`} cx={20 + index * 60} cy={y} r="4" />
                      ))}
                    </g>
                  </svg>
                </div>
              </div>

              <div className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg text-white">Site Optimization Score</h2>
                    <p className="text-sm text-text-muted">LLM visibility optimization status</p>
                  </div>
                  <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-text-muted hover:border-white/20">
                    View Details
                  </button>
                </div>

                <div className="mt-8 flex flex-col items-center gap-6">
                  <div
                    className="relative flex h-44 w-44 items-center justify-center rounded-full bg-white/5"
                    style={{
                      backgroundImage: `conic-gradient(#22c55e 0deg, #22c55e ${scoreArc}deg, rgba(255,255,255,0.08) ${scoreArc}deg)`,
                    }}
                  >
                    <div className="h-32 w-32 rounded-full bg-navy-900/90" />
                    <div className="absolute text-center">
                      <p className="text-3xl font-semibold text-white">{optimizationScore.value}%</p>
                      <p className="text-xs uppercase tracking-wide text-text-subtle">Overall Score</p>
                    </div>
                  </div>

                  <div className="w-full space-y-3 text-sm">
                    {optimizationScore.breakdown.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-text-muted">{item.label}</span>
                        <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-text-primary">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-white">Model Performance</h2>
                  <p className="text-sm text-text-muted">Your brand visibility across different AI language models</p>
                </div>
                <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-text-muted hover:border-white/20">
                  View Details
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {models.map((model) => (
                  <div key={model.name} className="flex flex-col gap-3 rounded-xl border border-white/5 bg-navy-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-accent-blue">
                        {metricIcons[model.icon]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{model.name}</p>
                        <TrendDelta delta={model.delta} />
                      </div>
                    </div>
                    <div>
                      <p className="flex items-center justify-between text-xs uppercase tracking-wide text-text-subtle">
                        <span>Visibility</span>
                        <span className="font-semibold text-text-primary">{(model.visibility / 10).toFixed(1)}/10</span>
                      </p>
                      <ProgressBar value={model.visibility} color="bg-accent-blue" />
                    </div>
                    <div>
                      <p className="flex items-center justify-between text-xs uppercase tracking-wide text-text-subtle">
                        <span>Presence</span>
                        <span className="font-semibold text-text-primary">{formatPercent(model.presence)}</span>
                      </p>
                      <ProgressBar value={model.presence} color="bg-accent-green" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
              <div className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg text-white">Top Performing Prompts</h2>
                    <p className="text-sm text-text-muted">Prompts driving the highest visibility and mentions</p>
                  </div>
                  <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-text-muted hover:border-white/20">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {prompts.map((prompt) => (
                    <div key={prompt.text} className="rounded-xl border border-white/5 bg-navy-900/40 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-white">{prompt.text}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                            <span className="inline-flex items-center gap-1">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3 10c3-5.5 11-6 14 0-3 5.5-11 6-14 0Zm7 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
                              </svg>
                              Score {prompt.score}/100
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-3.5 w-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 5h12M5 9h10M6 13h8M7 17h6" />
                              </svg>
                              Mentions {prompt.mentions.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-text-muted">
                          {prompt.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg text-white">Competitor Ranking</h2>
                    <p className="text-sm text-text-muted">How you rank against key competitors in AI visibility</p>
                  </div>
                  <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-text-muted hover:border-white/20">
                    View Full Report
                  </button>
                </div>

                <div className="space-y-3">
                  {competitors.map((competitor) => (
                    <div
                      key={competitor.rank}
                      className={`flex items-center justify-between gap-3 rounded-xl border border-white/5 px-4 py-3 ${
                        competitor.rank === 1 ? "bg-accent-blue/10" : "bg-navy-900/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-text-subtle">#{competitor.rank}</span>
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold ${
                            competitor.rank === 1 ? "bg-accent-blue text-white" : "bg-white/5 text-text-primary"
                          }`}
                        >
                          {competitor.rank === 1 ? metricIcons.crown : competitor.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{competitor.name}</p>
                          <p className="text-xs text-text-muted">Score {competitor.score.toFixed(1)}</p>
                        </div>
                      </div>
                      <TrendDelta delta={competitor.delta} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
