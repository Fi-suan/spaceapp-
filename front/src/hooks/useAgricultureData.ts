import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { DashboardAgricultureResponse } from '@/lib/types'

export function useAgricultureData(lat: number, lon: number) {
  const [data, setData] = useState<DashboardAgricultureResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getDashboardAgriculture(lat, lon)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agriculture data')
      console.error('Agriculture data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [lat, lon])

  return { data, loading, error, refetch: fetchData }
}

