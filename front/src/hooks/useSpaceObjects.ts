'use client'

import { useState, useEffect } from 'react'
import { apiClient, SpaceObject } from '@/lib/api'

export function useSpaceObjects() {
  const [spaceObjects, setSpaceObjects] = useState<SpaceObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSpaceObjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getSpaceObjects()
      setSpaceObjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch space objects')
      console.error('Error fetching space objects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpaceObjects()
  }, [])

  const refreshData = () => {
    fetchSpaceObjects()
  }

  // Получить статистику по типам
  const getTypeStats = () => {
    const stats: Record<string, number> = {}
    spaceObjects.forEach(obj => {
      stats[obj.type] = (stats[obj.type] || 0) + 1
    })
    return stats
  }

  // Получить объекты по типу
  const getObjectsByType = (type: string) => {
    return spaceObjects.filter(obj => obj.type.toLowerCase() === type.toLowerCase())
  }

  return {
    spaceObjects,
    loading,
    error,
    refreshData,
    getTypeStats,
    getObjectsByType,
    totalCount: spaceObjects.length
  }
}