// Weather & Climate Data Types
export interface WeatherCurrent {
  temperature: number
  humidity: number
  wind_speed: number
  wind_direction: string
  aqi: number
  uv_index: number
  conditions: string
  timestamp: string
}

export interface WeatherForecast {
  date: string
  temp_min: number
  temp_max: number
  precipitation: number
  humidity: number
  wind_speed: number
  frost_risk: boolean
  aqi?: number
}

// Farm/Agriculture Types
export interface FarmRecommendation {
  spraying_safe: boolean
  frost_warning: {
    active: boolean
    temperature?: number
    time?: string
  }
  best_work_days: string[]
  drought_risk: 'low' | 'medium' | 'high'
}

export interface FarmAlert {
  type: 'frost' | 'drought' | 'storm' | 'heat'
  severity: 'low' | 'medium' | 'high' | 'critical'
  date: string
  message: string
  temperature?: number
  days_without_rain?: number
}

// Insurance Types
export interface InsuranceRisk {
  region: string
  period: string
  risk_score: number
  frost_events: Array<{
    date: string
    temperature: number
  }>
  drought_days: number
  fires: Array<{
    lat: number
    lon: number
    area_ha: number
    distance_km: number
  }>
  ndvi: {
    current: number
    previous_year: number
    change_percent: number
  }
}

export interface Claim {
  claim_id: string
  type: 'drought' | 'frost' | 'flood' | 'fire'
  region: string
  period: {
    start: string
    end: string
  }
  verification: {
    precipitation_mm: number
    days_above_30c?: number
    days_below_0c?: number
    ndvi_drop_percent: number
    fraud_probability: number
  }
  status: 'pending' | 'verified' | 'rejected'
}

// Wildfire Types
export interface Fire {
  fire_id: string
  lat: number
  lon: number
  area_ha: number
  intensity: 'low' | 'medium' | 'high'
  detected_at: string
  region: string
}

export interface FireSpreadForecast {
  fire_id: string
  region: string
  weather: {
    wind_speed_kmh: number
    wind_direction_deg: number
    wind_direction: string
    humidity_percent: number
    temperature_c: number
    fwi: number
  }
  threats: Array<{
    type: 'settlement' | 'protected_forest' | 'infrastructure'
    name: string
    distance_km: number
    eta_hours: number
  }>
}

export interface AirQualityArea {
  city: string
  aqi: number
  category: 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous'
  pm25: number
  pm10?: number
  recommendations: string[]
}

export interface WildfireRiskRegion {
  name: string
  fwi: number
  risk_level: 'low' | 'medium' | 'high' | 'critical'
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  timestamp: string
  status: 'success' | 'error'
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Dashboard API Response Types

export interface DashboardAgricultureResponse {
  current_temperature: number
  frost_risk: {
    percentage: number
    status: string
  }
  aqi_impact: {
    pm2_5: number
    status: string
  }
  humidity: number
  precipitation: number
  wind_speed: number
  location: {
    latitude: number
    longitude: number
  }
}

export interface DashboardInsuranceResponse {
  weather_verified_events: Array<{
    date: string
    type: string
    severity: string
  }>
  climate_summary: {
    avg_temperature: number
    total_precipitation: number
    days_analyzed: number
  }
  risk_assessment: {
    score: number
    level: string
    factors: {
      temperature: number
      wind_speed: number
      cloud_coverage: number
    }
  }
  region: string
  location: {
    latitude: number
    longitude: number
  }
}

export interface NearestFire {
  latitude: number
  longitude: number
  distance_km: number
  brightness: number
  frp: number
  confidence: string
  acq_date: string
}

export interface DashboardWildfiresResponse {
  active_fires_count: number
  total_fires_global: number
  fire_danger_index: {
    value: number
    level: string
  }
  wind_conditions: {
    speed_ms: number
    speed_kmh: number
    direction: string
    degrees: number
  }
  aqi_smoke: {
    aqi: number
    status: string
    pm2_5: number
  }
  nearest_fires: NearestFire[]
  search_radius_km: number
  location: {
    latitude: number
    longitude: number
  }
}

export interface DashboardMainResponse {
  farm_risk_index: {
    value: number
    trend: string
    factors: {
      frost_risk: boolean
      humidity_level: number
    }
  }
  fire_hotspots: {
    global_count: number
    trend: string
  }
  weather_summary: {
    temperature: number
    wind_speed: number
    conditions: string
  }
  air_quality_summary: {
    aqi: number
    status: string
  }
  location: {
    latitude: number
    longitude: number
  }
  last_updated: string
}

