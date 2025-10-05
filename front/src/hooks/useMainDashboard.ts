import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { DashboardMainResponse } from '@/lib/types'

export function useMainDashboard(cityId: string) {
  const [data, setData] = useState<DashboardMainResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getDashboardMain(cityId)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch main dashboard data')
      console.error('Main dashboard data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [cityId])

  return { data, loading, error, refetch: fetchData }
}

