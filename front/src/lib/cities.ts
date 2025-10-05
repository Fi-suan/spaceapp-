export interface City {
  id: string
  name: string
  nameEn: string
  latitude: number
  longitude: number
  country: string
}

export const CITIES: City[] = [
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
  },
  // USA
  {
    id: 'los-angeles',
    name: 'Лос-Анджелес',
    nameEn: 'Los Angeles',
    latitude: 34.0522,
    longitude: -118.2437,
    country: 'USA'
  },
  {
    id: 'miami',
    name: 'Майами',
    nameEn: 'Miami',
    latitude: 25.7617,
    longitude: -80.1918,
    country: 'USA'
  },
  // Australia
  {
    id: 'sydney',
    name: 'Сидней',
    nameEn: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    country: 'Australia'
  },
  {
    id: 'perth',
    name: 'Перт',
    nameEn: 'Perth',
    latitude: -31.9505,
    longitude: 115.8605,
    country: 'Australia'
  },
  // Europe
  {
    id: 'london',
    name: 'Лондон',
    nameEn: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'UK'
  },
  {
    id: 'paris',
    name: 'Париж',
    nameEn: 'Paris',
    latitude: 48.8566,
    longitude: 2.3522,
    country: 'France'
  },
  {
    id: 'barcelona',
    name: 'Барселона',
    nameEn: 'Barcelona',
    latitude: 41.3851,
    longitude: 2.1734,
    country: 'Spain'
  },
  // Asia
  {
    id: 'tokyo',
    name: 'Токио',
    nameEn: 'Tokyo',
    latitude: 35.6762,
    longitude: 139.6503,
    country: 'Japan'
  },
  {
    id: 'singapore',
    name: 'Сингапур',
    nameEn: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    country: 'Singapore'
  },
  {
    id: 'dubai',
    name: 'Дубай',
    nameEn: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    country: 'UAE'
  },
  // South America
  {
    id: 'sao-paulo',
    name: 'Сан-Паулу',
    nameEn: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    country: 'Brazil'
  },
  {
    id: 'buenos-aires',
    name: 'Буэнос-Айрес',
    nameEn: 'Buenos Aires',
    latitude: -34.6037,
    longitude: -58.3816,
    country: 'Argentina'
  },
  // Africa
  {
    id: 'cairo',
    name: 'Каир',
    nameEn: 'Cairo',
    latitude: 30.0444,
    longitude: 31.2357,
    country: 'Egypt'
  },
  {
    id: 'cape-town',
    name: 'Кейптаун',
    nameEn: 'Cape Town',
    latitude: -33.9249,
    longitude: 18.4241,
    country: 'South Africa'
  }
]

export const DEFAULT_CITY = CITIES[0] // Almaty

// Keep backward compatibility
export const KAZAKHSTAN_CITIES = CITIES

