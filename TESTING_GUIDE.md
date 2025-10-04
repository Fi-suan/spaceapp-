# Testing Guide - Frontend API Integration

## Quick Start

```bash
# В корне проекта
./start.sh

# Или отдельно фронтенд (если бэк уже запущен)
cd front
npm run dev
```

Фронтенд: http://localhost:3000  
Бэкенд: http://localhost:8080

## Current Status

✅ **Frontend готов** - все компоненты обновлены и используют реальные API calls  
❌ **Backend endpoints отсутствуют** - нужно реализовать 4 dashboard endpoints

## Что Сейчас Произойдёт

При открытии любой dashboard страницы вы увидите:
1. **Loading spinner** (кратковременно)
2. **Error screen** с сообщением "Failed to fetch ... data"
3. Кнопка **"Retry"** для повторной попытки

Это **нормальное поведение**, так как бэкенд ещё не реализовал dashboard endpoints.

## Как Протестировать После Реализации Backend

### 1. Main Dashboard
```bash
# Проверить API
curl "http://localhost:8080/api/v1/dashboard/main?latitude=55.7558&longitude=37.6173" | jq .

# Открыть в браузере
open http://localhost:3000
```

**Ожидаемый результат:**
- Farm Risk Index: число + тренд (increasing/decreasing/stable)
- Temperature: °C
- Fire Hotspots: количество
- Air Quality: статус + AQI

### 2. Agriculture Page
```bash
# Проверить API
curl "http://localhost:8080/api/v1/dashboard/agriculture?latitude=55.7558&longitude=37.6173" | jq .

# Открыть в браузере
open http://localhost:3000/dashboard/farm
```

**Ожидаемый результат:**
- Current Temperature: °C
- Frost Risk: % + статус (Low/Medium/High)
- Humidity: %
- Wind Speed: m/s (+ km/h в trend)
- AQI Status + PM2.5 level
- Precipitation: mm/day

### 3. Insurance Page
```bash
# Проверить API
curl "http://localhost:8080/api/v1/dashboard/insurance?latitude=55.7558&longitude=37.6173&region=Moscow" | jq .

# Открыть в браузере
open http://localhost:3000/dashboard/insurance
```

**Ожидаемый результат:**
- Risk Assessment: level + score
- Avg Temperature: °C за N дней
- Total Precipitation: mm за N дней
- Weather Events: количество событий
- Region name

### 4. Wildfire Page
```bash
# Проверить API
curl "http://localhost:8080/api/v1/dashboard/wildfires?latitude=55.7558&longitude=37.6173&radius_km=200" | jq .

# Открыть в браузере
open http://localhost:3000/dashboard/wildfire
```

**Ожидаемый результат:**
- Fire Danger Index: value/100 + level
- Active Fires: количество в радиусе / глобально
- Wind Speed: km/h + направление
- AQI (Smoke): значение + статус
- Список ближайших пожаров (до 5 штук):
  - Расстояние (km)
  - Brightness (K)
  - FRP (MW)
  - Confidence level
  - Координаты

## Functional Requirements Checklist

### Loading States ✅
- [ ] Spinner отображается при загрузке
- [ ] Кнопка "Refresh" становится disabled
- [ ] Иконка в кнопке крутится (animate-spin)

### Error Handling ✅
- [ ] Error screen показывается при ошибке
- [ ] Сообщение об ошибке понятное
- [ ] Кнопка "Retry" работает
- [ ] После retry загрузка начинается заново

### Data Display ✅
- [ ] Все метрики отображаются корректно
- [ ] Числа форматируются правильно (toFixed для float)
- [ ] Единицы измерения указаны (°C, %, km/h, etc.)
- [ ] Тренды и статусы показываются
- [ ] Nearest fires list работает (для Wildfire page)

### Refresh Functionality ✅
- [ ] Кнопка "Refresh" вызывает API повторно
- [ ] Loading state отображается во время refresh
- [ ] Данные обновляются после успешного refresh
- [ ] Error handling работает при refresh

## Debugging

### Check Browser Console
```javascript
// Открыть DevTools (F12)
// Вкладка Network -> Filter "fetch" или "XHR"
// Искать запросы к /api/v1/dashboard/*

// Errors будут видны в Console tab
```

### Check Backend Logs
```bash
# Логи бэкенда
tail -f logs/backend.log

# Логи фронтенда (Next.js)
tail -f logs/frontend.log
```

### Common Issues

**1. "Failed to fetch" error**
- Проверьте что бэкенд запущен: `curl http://localhost:8080`
- Проверьте что endpoint существует: `curl http://localhost:8080/docs`

**2. CORS errors**
- Next.js proxy должен обрабатывать CORS автоматически
- Если проблема, проверьте `next.config.js`

**3. Type errors в консоли**
- Проверьте что структура API response совпадает с TypeScript types
- Обновите types в `front/src/lib/types.ts` если нужно

**4. 404 Not Found**
- Backend endpoint ещё не реализован
- Проверьте URL в `front/src/lib/api.ts`

## Mock Data для Тестирования Backend

Если хотите протестировать frontend с mock данными, временно замените хуки:

```typescript
// front/src/hooks/useMainDashboard.ts
export function useMainDashboard(lat: number, lon: number) {
  const [data] = useState({
    farm_risk_index: { value: 70, trend: "stable", factors: { frost_risk: true, humidity_level: 72.8 } },
    fire_hotspots: { global_count: 61971, trend: "increasing" },
    weather_summary: { temperature: 9.9, wind_speed: 4.62, conditions: "Clouds" },
    air_quality_summary: { aqi: 2, status: "Fair" },
    location: { latitude: lat, longitude: lon },
    last_updated: "real-time"
  })
  
  return { data, loading: false, error: null, refetch: () => {} }
}
```

## Performance Expectations

- **Initial Load**: < 2s (зависит от API response time)
- **Refresh**: < 1s
- **Error Display**: immediate
- **Retry**: same as initial load

## Browser Compatibility

Тестировать в:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Все современные features (async/await, fetch API, hooks) supported.

## Next.js Specific

- Pages используют `'use client'` directive (Client Components)
- API calls происходят в browser, не в server
- Hot reload работает для всех изменений
- TypeScript проверки в реальном времени

## Checklist перед Production

- [ ] All API endpoints implemented
- [ ] Error messages переведены на нужный язык
- [ ] Loading timeouts настроены (retry after 30s?)
- [ ] Analytics tracking добавлен (optional)
- [ ] Performance monitoring (optional)
- [ ] Rate limiting handling (если нужно)
- [ ] Refresh intervals настроены (auto-refresh every 5min?)

