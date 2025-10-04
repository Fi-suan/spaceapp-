export interface City {
  id: string
  name: string
  nameEn: string
  latitude: number
  longitude: number
  country: string
}

export const KAZAKHSTAN_CITIES: City[] = [
  {
    id: 'almaty',
    name: 'Алматы',
    nameEn: 'Almaty',
    latitude: 43.2220,
    longitude: 76.8512,
    country: 'Kazakhstan'
  },
  {
    id: 'astana',
    name: 'Астана',
    nameEn: 'Astana',
    latitude: 51.1694,
    longitude: 71.4491,
    country: 'Kazakhstan'
  },
  {
    id: 'pavlodar',
    name: 'Павлодар',
    nameEn: 'Pavlodar',
    latitude: 52.2873,
    longitude: 76.9665,
    country: 'Kazakhstan'
  },
  {
    id: 'ekibastuz',
    name: 'Екибастуз',
    nameEn: 'Ekibastuz',
    latitude: 51.7244,
    longitude: 75.3232,
    country: 'Kazakhstan'
  },
  {
    id: 'aktau',
    name: 'Актау',
    nameEn: 'Aktau',
    latitude: 43.6506,
    longitude: 51.1603,
    country: 'Kazakhstan'
  }
]

export const DEFAULT_CITY = KAZAKHSTAN_CITIES[0] // Almaty

