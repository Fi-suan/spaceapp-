# Frontend-Backend Integration Status

## ✅ Completed

### 1. API Client (`front/src/lib/api.ts`)
Добавлены новые методы для dashboard endpoints:
- `getDashboardAgriculture(lat, lon)` → `/api/v1/dashboard/agriculture`
- `getDashboardInsurance(lat, lon, region?)` → `/api/v1/dashboard/insurance`
- `getDashboardWildfires(lat, lon, radiusKm?)` → `/api/v1/dashboard/wildfires`
- `getDashboardMain(lat, lon)` → `/api/v1/dashboard/main`

### 2. TypeScript Types (`front/src/lib/types.ts`)
Созданы интерфейсы для всех API responses:
- `DashboardAgricultureResponse`
- `DashboardInsuranceResponse`
- `DashboardWildfiresResponse`
- `DashboardMainResponse`
- `NearestFire`

### 3. Custom Hooks (`front/src/hooks/`)
Созданы хуки для каждого раздела:
- `useAgricultureData.ts` - для Farm Health Monitor
- `useInsuranceData.ts` - для Risk Analytics Platform
- `useWildfiresData.ts` - для Wildfire Command Center
- `useMainDashboard.ts` - для главной страницы

Каждый хук содержит:
- Loading state
- Error handling
- Automatic data fetching on mount
- Manual refetch function

### 4. Updated Pages

#### Main Dashboard (`front/src/app/page.tsx`)
- Интегрирован `useMainDashboard` hook
- Реальные данные отображаются в метриках:
  - Farm Risk Index (значение + тренд)
  - Temperature (из weather_summary)
  - Fire Hotspots (global_count)
  - Air Quality (status + AQI)
- Добавлена кнопка Refresh с loading state

#### Agriculture Page (`front/src/app/dashboard/farm/page.tsx`)
- Интегрирован `useAgricultureData` hook
- Реальные данные:
  - Current Temperature (°C)
  - Frost Risk (% + status)
  - Humidity (%)
  - Wind Speed (m/s + km/h conversion)
  - AQI Impact (status + PM2.5)
  - Precipitation (mm/day)
- Loading spinner и error handling

#### Insurance Page (`front/src/app/dashboard/insurance/page.tsx`)
- Интегрирован `useInsuranceData` hook
- Реальные данные:
  - Risk Assessment (level + score)
  - Avg Temperature (°C)
  - Total Precipitation (mm)
  - Weather Events (количество)
  - Region name

#### Wildfire Page (`front/src/app/dashboard/wildfire/page.tsx`)
- Интегрирован `useWildfiresData` hook
- Реальные данные:
  - Fire Danger Index (value/100 + level)
  - Active Fires (local + global count)
  - Wind Speed (km/h + direction)
  - AQI Smoke (status + value)
  - Nearest Fires list (расстояние, brightness, FRP, coordinates)
- Badge с динамическим цветом по уровню риска

### 5. UI Improvements
- Все страницы имеют кнопку "Refresh" с иконкой refresh (анимация при загрузке)
- Loading spinners при загрузке данных
- Error states с кнопкой "Retry"
- Disabled состояние кнопок во время загрузки

## ⚠️ Backend Requirements

Для полной работы интеграции нужно реализовать следующие endpoints на бэкенде:

### 1. Main Dashboard
```
GET /api/v1/dashboard/main?latitude={lat}&longitude={lon}
```
Response: см. `DashboardMainResponse` в types.ts

### 2. Agriculture
```
GET /api/v1/dashboard/agriculture?latitude={lat}&longitude={lon}
```
Response: см. `DashboardAgricultureResponse` в types.ts

### 3. Insurance
```
GET /api/v1/dashboard/insurance?latitude={lat}&longitude={lon}&region={region}
```
Response: см. `DashboardInsuranceResponse` в types.ts

### 4. Wildfires
```
GET /api/v1/dashboard/wildfires?latitude={lat}&longitude={lon}&radius_km={radius}
```
Response: см. `DashboardWildfiresResponse` в types.ts

## 🧪 Testing

### Default Coordinates
Все запросы используют координаты по умолчанию:
- Latitude: `55.7558`
- Longitude: `37.6173`
- Region: `Moscow` (для Insurance)
- Radius: `200` km (для Wildfires)

### How to Test
1. Запустите фронтенд: `cd front && npm run dev`
2. Откройте http://localhost:3000
3. Перейдите на каждую страницу:
   - `/` - Main Dashboard
   - `/dashboard/farm` - Agriculture
   - `/dashboard/insurance` - Insurance
   - `/dashboard/wildfire` - Wildfires

Сейчас будут показываться ошибки загрузки, так как backend endpoints ещё не реализованы.

## 📝 Next Steps

1. **Backend Team**: Реализовать 4 dashboard endpoints согласно спецификации из промпта
2. **Testing**: После реализации бэкенда проверить все страницы
3. **Fine-tuning**: Возможно потребуется корректировка типов, если структура response немного отличается
4. **Location Selection**: В будущем можно добавить UI для выбора других координат
5. **Caching**: Рассмотреть возможность кэширования данных в React Query или SWR

## 🎯 Benefits

- Полное разделение concerns (data fetching отделён от UI)
- Переиспользуемые хуки
- TypeScript type safety
- Consistent error handling
- Loading states для лучшего UX
- Easy to test и extend

## 📚 Documentation

Все типы данных задокументированы в:
- `front/src/lib/types.ts` - TypeScript interfaces
- Промпт с примерами API responses (в чате)

