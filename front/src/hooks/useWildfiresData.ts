import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { DashboardWildfiresResponse } from '@/lib/types'

export function useWildfiresData(lat: number, lon: number, radiusKm: number = 200) {
  const [data, setData] = useState<DashboardWildfiresResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getDashboardWildfires(lat, lon, radiusKm)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wildfires data')
      console.error('Wildfires data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [lat, lon, radiusKm])

  return { data, loading, error, refetch: fetchData }
}

