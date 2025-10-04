'use client'

import { useSpaceObjects } from '@/hooks/useSpaceObjects'

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
  { label: "Reports" },
  { label: "Objects" },
  { label: "Analytics" },
  { label: "Settings" },
]

const insightItems = ["Intelligence", "Statistics", "Explorer"]

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
          <p className="text-text-muted">Загрузка космических данных...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-midnight text-text-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Ошибка загрузки: {error}</p>
          <button
            onClick={refreshData}
            className="bg-accent-blue px-4 py-2 rounded-lg text-white hover:bg-accent-blue/80"
          >
            Попробовать снова
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
      label: "Всего объектов",
      value: totalObjects.toString(),
      icon: "visibility",
      delta: { value: "+100%", trend: "up" },
    },
    {
      label: "Планет",
      value: planetCount.toString(),
      icon: "pulse",
      delta: { value: `${Math.round((planetCount / totalObjects) * 100)}%`, trend: "up" },
    },
    {
      label: "Звезд",
      value: starCount.toString(),
      icon: "trophy",
      delta: { value: `${Math.round((starCount / totalObjects) * 100)}%`, trend: "up" },
    },
    {
      label: "Других объектов",
      value: otherCount.toString(),
      icon: "chat",
      delta: { value: `${Math.round((otherCount / totalObjects) * 100)}%`, trend: "neutral" },
    },
  ]

  return (
    <main className="min-h-screen bg-midnight text-text-primary">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-border-subtle bg-navy-900/80 p-6 lg:flex">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue font-semibold">SA</div>
            <div>
              <p className="text-sm text-text-subtle">Space Analytics Platform</p>
              <p className="text-lg font-semibold text-text-primary">SpaceApp</p>
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
            <p className="text-sm font-semibold text-text-primary">Обновить данные</p>
            <p className="text-xs text-text-muted">Синхронизация с API</p>
            <button
              onClick={refreshData}
              className="mt-4 w-full rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80"
            >
              Обновить
            </button>
          </div>
        </aside>

        <div className="flex-1 overflow-hidden">
          <header className="border-b border-border-subtle bg-navy-900/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
              <div>
                <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
                <p className="text-sm text-text-muted">Мониторинг космических объектов через API</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                  error
                    ? 'border-red-400/20 text-red-400'
                    : 'border-green-400/20 text-green-400'
                }`}>
                  {error ? 'API Недоступен' : 'API Подключен'}
                </span>
                <button
                  onClick={refreshData}
                  className="flex items-center gap-2 rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-blue/80"
                >
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Обновить данные
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

            <section className="rounded-2xl bg-navy-800/60 p-6 shadow-card">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-white">Космические объекты</h2>
                  <p className="text-sm text-text-muted">Список всех объектов из базы данных</p>
                </div>
                <button
                  onClick={refreshData}
                  className="rounded-lg border border-white/10 px-3 py-1 text-xs text-text-muted hover:border-white/20"
                >
                  Обновить
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {spaceObjects.map((obj) => (
                  <div key={obj.id} className="flex flex-col gap-3 rounded-xl border border-white/5 bg-navy-900/40 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-accent-blue">
                        {getObjectIcon(obj.type)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{obj.name}</p>
                        <p className="text-xs text-text-muted capitalize">{obj.type}</p>
                      </div>
                    </div>
                    {obj.description && (
                      <p className="text-xs text-text-subtle">{obj.description}</p>
                    )}
                    {obj.distance_from_earth !== undefined && (
                      <p className="text-xs text-text-muted">
                        Расстояние: {obj.distance_from_earth} св. лет
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {spaceObjects.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-text-muted">Нет данных о космических объектах</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}