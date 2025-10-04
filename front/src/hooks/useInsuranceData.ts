import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { DashboardInsuranceResponse } from '@/lib/types'

export function useInsuranceData(lat: number, lon: number, region?: string) {
  const [data, setData] = useState<DashboardInsuranceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiClient.getDashboardInsurance(lat, lon, region)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch insurance data')
      console.error('Insurance data fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [lat, lon, region])

  return { data, loading, error, refetch: fetchData }
}

