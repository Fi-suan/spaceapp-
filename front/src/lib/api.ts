import {
  WeatherCurrent,
  WeatherForecast,
  FarmRecommendation,
  FarmAlert,
  InsuranceRisk,
  Claim,
  Fire,
  FireSpreadForecast,
  AirQualityArea,
  WildfireRiskRegion,
  ApiResponse,
  DashboardAgricultureResponse,
  DashboardInsuranceResponse,
  DashboardWildfiresResponse,
  DashboardMainResponse,
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

console.log('[API] Initializing API client:', {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV
})

export interface SpaceObject {
  id: number
  name: string
  type: string
  description?: string
  distance_from_earth?: number
}

export interface SpaceObjectCreate {
  name: string
  type: string
  description?: string
  distance_from_earth?: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    console.log('[API] Request:', {
      url,
      baseUrl: this.baseUrl,
      endpoint,
      method: options?.method || 'GET'
    })

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      console.log('[API] Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details')
        console.error('[API] Error response:', {
          url,
          status: response.status,
          statusText: response.statusText,
          body: errorText
        })
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('[API] Success:', { url, dataKeys: Object.keys(data) })
      return data
    } catch (error) {
      console.error('[API] Request failed:', {
        url,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }

  // Получить все космические объекты
  async getSpaceObjects(): Promise<SpaceObject[]> {
    return this.request<SpaceObject[]>('/space-objects/')
  }

  // Получить объект по ID
  async getSpaceObject(id: number): Promise<SpaceObject> {
    return this.request<SpaceObject>(`/space-objects/${id}`)
  }

  // Создать новый объект
  async createSpaceObject(data: SpaceObjectCreate): Promise<SpaceObject> {
    return this.request<SpaceObject>('/space-objects/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Обновить объект
  async updateSpaceObject(id: number, data: SpaceObjectCreate): Promise<SpaceObject> {
    return this.request<SpaceObject>(`/space-objects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Удалить объект
  async deleteSpaceObject(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/space-objects/${id}`, {
      method: 'DELETE',
    })
  }

  // Получить объекты по типу
  async getSpaceObjectsByType(type: string): Promise<SpaceObject[]> {
    return this.request<SpaceObject[]>(`/space-objects/type/${type}`)
  }

  // Проверка здоровья API
  async healthCheck(): Promise<{ status: string; message: string }> {
    const url = '/health'
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }

  // === Weather & Farm Endpoints ===
  async getCurrentWeather(lat: number, lon: number): Promise<ApiResponse<WeatherCurrent>> {
    return this.request(`/weather/current?lat=${lat}&lon=${lon}`)
  }

  async getWeatherForecast(lat: number, lon: number, days: number = 7): Promise<ApiResponse<WeatherForecast[]>> {
    return this.request(`/weather/forecast?lat=${lat}&lon=${lon}&days=${days}`)
  }

  async getFarmRecommendations(lat: number, lon: number): Promise<ApiResponse<FarmRecommendation>> {
    return this.request(`/recommendations/farm?lat=${lat}&lon=${lon}`)
  }

  async getFarmAlerts(lat: number, lon: number): Promise<ApiResponse<FarmAlert[]>> {
    return this.request(`/alerts/farm?lat=${lat}&lon=${lon}`)
  }

  // === Insurance Endpoints ===
  async getInsuranceRisks(region: string, period: string): Promise<ApiResponse<InsuranceRisk>> {
    return this.request(`/insurance/risks?region=${region}&period=${period}`)
  }

  async getClaimVerification(claimId: string): Promise<ApiResponse<Claim>> {
    return this.request(`/insurance/claims/${claimId}`)
  }

  async getRiskForecast(period: string = 'next_month'): Promise<ApiResponse<WildfireRiskRegion[]>> {
    return this.request(`/insurance/forecast?period=${period}`)
  }

  async downloadClaimReport(claimId: string): Promise<Blob> {
    const url = `${this.baseUrl}/insurance/claims/${claimId}/report?format=pdf`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.blob()
  }

  // === Wildfire Endpoints ===
  async getActiveFires(region?: string): Promise<ApiResponse<{ fires: Fire[]; total_count: number; danger_index: number }>> {
    const query = region ? `?region=${region}` : ''
    return this.request(`/wildfire/active-fires${query}`)
  }

  async getFireSpreadForecast(fireId: string): Promise<ApiResponse<FireSpreadForecast>> {
    return this.request(`/wildfire/fires/${fireId}/spread-forecast`)
  }

  async getAirQualitySmoke(affectedOnly: boolean = true): Promise<ApiResponse<{ affected_areas: AirQualityArea[] }>> {
    return this.request(`/wildfire/air-quality?affected=${affectedOnly}`)
  }

  async getWildfireRiskForecast(hours: number = 48): Promise<ApiResponse<{ regions: WildfireRiskRegion[] }>> {
    return this.request(`/wildfire/risk-forecast?hours=${hours}`)
  }

  // === Dashboard Endpoints ===
  async getDashboardAgriculture(cityId: string): Promise<DashboardAgricultureResponse> {
    return this.request(`/dashboard/agriculture?city_id=${cityId}`)
  }

  async getDashboardInsurance(cityId: string, region?: string): Promise<DashboardInsuranceResponse> {
    const regionParam = region ? `&region=${region}` : ''
    return this.request(`/dashboard/insurance?city_id=${cityId}${regionParam}`)
  }

  async getDashboardWildfires(cityId: string, radiusKm: number = 200): Promise<DashboardWildfiresResponse> {
    return this.request(`/dashboard/wildfires?city_id=${cityId}&radius_km=${radiusKm}`)
  }

  async getDashboardMain(cityId: string): Promise<DashboardMainResponse> {
    return this.request(`/dashboard/main?city_id=${cityId}`)
  }
}

export const apiClient = new ApiClient()
export default apiClient