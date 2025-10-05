import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { DashboardAgricultureResponse } from '@/lib/types'

export function useAgricultureData(cityId: string) {
  const [data, setData] = useState<DashboardAgricultureResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      console.log('[useAgricultureData] Fetching data for city:', cityId)
      setLoading(true)
      setError(null)
      const result = await apiClient.getDashboardAgriculture(cityId)
      console.log('[useAgricultureData] Data received:', {
        cityId,
        hasData: !!result,
        keys: result ? Object.keys(result) : []
      })
      setData(result)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch agriculture data'
      setError(errorMsg)
      console.error('[useAgricultureData] Fetch error:', {
        cityId,
        error: errorMsg,
        fullError: err
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [cityId])

  return { data, loading, error, refetch: fetchData }
}

