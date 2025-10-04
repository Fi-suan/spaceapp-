const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

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

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
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
}

export const apiClient = new ApiClient()
export default apiClient