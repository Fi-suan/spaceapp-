"""
Роутер для секций дашборда (Agriculture, Insurance, Wildfires, Main Dashboard)
"""
from fastapi import APIRouter, Query
from typing import Optional, Dict, Any

from app.services.external_apis import (
    firms_client,
    nasa_power_client,
    openweather_client
)

router = APIRouter(
    prefix="/dashboard",
    tags=["dashboard-sections"]
)


@router.get("/agriculture")
async def get_agriculture_data(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота")
):
    """
    Получить данные для раздела Agriculture (Сельское хозяйство)

    Возвращает:
    - current_temperature: Текущая температура (°C)
    - frost_risk: Риск заморозков (%, status)
    - aqi_impact: Влияние качества воздуха (PM2.5)
    - humidity: Влажность (%)
    - precipitation: Осадки (mm/day)
    - wind_speed: Скорость ветра (m/s)
    """
    # Получаем данные параллельно
    climate = await nasa_power_client.get_agroclimatology_data(latitude=latitude, longitude=longitude)
    weather = await openweather_client.get_current_weather(latitude=latitude, longitude=longitude)
    air_quality = await openweather_client.get_air_quality(latitude=latitude, longitude=longitude)

    # Извлекаем нужные данные
    current_temp = weather.get("main", {}).get("temp", 0)

    # Рассчитываем риск заморозков из NASA POWER данных
    climate_params = climate.get("properties", {}).get("parameter", {})
    t2m_min_data = climate_params.get("T2M_MIN", {})
    # Берем последнее значение минимальной температуры
    min_temps = [v for v in t2m_min_data.values() if v != -999.0]
    min_temp_recent = min(min_temps) if min_temps else 0

    # Расчет риска заморозков
    if min_temp_recent <= -5:
        frost_risk = {"percentage": 85, "status": "Critical"}
    elif min_temp_recent <= -2:
        frost_risk = {"percentage": 65, "status": "High"}
    elif min_temp_recent <= 0:
        frost_risk = {"percentage": 35, "status": "Medium"}
    elif min_temp_recent <= 2:
        frost_risk = {"percentage": 12, "status": "Low"}
    else:
        frost_risk = {"percentage": 5, "status": "Very Low"}

    # AQI данные
    aqi_list = air_quality.get("list", [{}])
    aqi_components = aqi_list[0].get("components", {}) if aqi_list else {}
    pm2_5 = aqi_components.get("pm2_5", 0)

    # Определяем статус AQI
    if pm2_5 <= 12:
        aqi_status = "Good"
    elif pm2_5 <= 35:
        aqi_status = "Moderate"
    elif pm2_5 <= 55:
        aqi_status = "Unhealthy for Sensitive"
    else:
        aqi_status = "Unhealthy"

    # Получаем последние данные NASA
    t2m_data = climate_params.get("T2M", {})
    avg_temps = [v for v in t2m_data.values() if v != -999.0]
    avg_temp = avg_temps[-1] if avg_temps else current_temp

    rh2m_data = climate_params.get("RH2M", {})
    humidity_values = [v for v in rh2m_data.values() if v != -999.0]
    humidity = humidity_values[-1] if humidity_values else weather.get("main", {}).get("humidity", 0)

    prec_data = climate_params.get("PRECTOTCORR", {})
    prec_values = [v for v in prec_data.values() if v != -999.0]
    precipitation = prec_values[-1] if prec_values else 0

    ws2m_data = climate_params.get("WS2M", {})
    wind_values = [v for v in ws2m_data.values() if v != -999.0]
    wind_speed = wind_values[-1] if wind_values else weather.get("wind", {}).get("speed", 0)

    return {
        "current_temperature": round(current_temp, 1),
        "frost_risk": frost_risk,
        "aqi_impact": {
            "pm2_5": round(pm2_5, 1),
            "status": aqi_status
        },
        "humidity": round(humidity, 1),
        "precipitation": round(precipitation, 2),
        "wind_speed": round(wind_speed, 2),
        "location": {
            "latitude": latitude,
            "longitude": longitude
        }
    }


@router.get("/insurance")
async def get_insurance_data(
    region: str = Query(default="Moscow", description="Регион"),
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота")
):
    """
    Получить данные для раздела Insurance (Страхование)

    Возвращает:
    - weather_verified_events: События подтвержденные погодными данными
    - climate_anomalies: Климатические аномалии
    - risk_assessment: Оценка рисков на основе погоды

    ПРИМЕЧАНИЕ: Реальные claim данные должны быть из базы данных.
    Здесь возвращаются только погодные данные для верификации.
    """
    # Получаем погодные данные для верификации страховых случаев
    climate = await nasa_power_client.get_agroclimatology_data(latitude=latitude, longitude=longitude)
    weather = await openweather_client.get_current_weather(latitude=latitude, longitude=longitude)

    climate_params = climate.get("properties", {}).get("parameter", {})

    # Анализируем аномалии погоды за последние дни
    t2m_data = climate_params.get("T2M", {})
    temps = [v for v in t2m_data.values() if v != -999.0]

    prec_data = climate_params.get("PRECTOTCORR", {})
    precip = [v for v in prec_data.values() if v != -999.0]

    # Определяем экстремальные события
    extreme_events = []

    # Проверка на сильные осадки
    if precip and max(precip) > 10:
        extreme_events.append({
            "type": "Heavy Precipitation",
            "value": f"{max(precip):.1f} mm/day",
            "severity": "High"
        })

    # Проверка на экстремальные температуры
    if temps:
        if min(temps) < -10:
            extreme_events.append({
                "type": "Extreme Cold",
                "value": f"{min(temps):.1f}°C",
                "severity": "Critical"
            })
        elif max(temps) > 35:
            extreme_events.append({
                "type": "Extreme Heat",
                "value": f"{max(temps):.1f}°C",
                "severity": "High"
            })

    # Текущие условия для оценки рисков
    current_temp = weather.get("main", {}).get("temp", 0)
    current_wind = weather.get("wind", {}).get("speed", 0)
    current_clouds = weather.get("clouds", {}).get("all", 0)

    # Оценка общего риска
    risk_score = 0
    if current_temp < 0 or current_temp > 30:
        risk_score += 30
    if current_wind > 10:
        risk_score += 20
    if len(extreme_events) > 0:
        risk_score += 25

    risk_level = "Low"
    if risk_score > 60:
        risk_level = "Critical"
    elif risk_score > 40:
        risk_level = "High"
    elif risk_score > 20:
        risk_level = "Medium"

    return {
        "weather_verified_events": extreme_events,
        "climate_summary": {
            "avg_temperature": round(sum(temps) / len(temps), 1) if temps else 0,
            "total_precipitation": round(sum(precip), 1) if precip else 0,
            "days_analyzed": len(temps)
        },
        "risk_assessment": {
            "score": risk_score,
            "level": risk_level,
            "factors": {
                "temperature": round(current_temp, 1),
                "wind_speed": round(current_wind, 1),
                "cloud_coverage": current_clouds
            }
        },
        "region": region,
        "location": {
            "latitude": latitude,
            "longitude": longitude
        }
    }


@router.get("/wildfires")
async def get_wildfires_data(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота"),
    radius_km: float = Query(default=500, description="Радиус поиска пожаров (км)")
):
    """
    Получить данные для раздела Wildfires (Лесные пожары)

    Возвращает:
    - active_fires_count: Количество активных пожаров в радиусе
    - fire_danger_index: Индекс опасности пожара (0-100)
    - wind_conditions: Условия ветра (скорость, направление)
    - aqi_smoke: Качество воздуха (влияние дыма)
    - nearest_fires: Ближайшие пожары
    """
    # Получаем данные о пожарах
    fires = await firms_client.get_active_fires(region="World", days=1)
    weather = await openweather_client.get_current_weather(latitude=latitude, longitude=longitude)
    air_quality = await openweather_client.get_air_quality(latitude=latitude, longitude=longitude)

    # Фильтруем пожары в радиусе
    import math

    def calculate_distance(lat1, lon1, lat2, lon2):
        """Расчет расстояния между точками (км)"""
        R = 6371  # Радиус Земли в км
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        return R * c

    fires_list = fires.get("fires", [])
    nearby_fires = []

    for fire in fires_list[:1000]:  # Проверяем первые 1000 для производительности
        try:
            fire_lat = float(fire.get("latitude", 0))
            fire_lon = float(fire.get("longitude", 0))
            distance = calculate_distance(latitude, longitude, fire_lat, fire_lon)

            if distance <= radius_km:
                nearby_fires.append({
                    "latitude": fire_lat,
                    "longitude": fire_lon,
                    "distance_km": round(distance, 1),
                    "brightness": float(fire.get("bright_ti4", 0)),
                    "frp": float(fire.get("frp", 0)),
                    "confidence": fire.get("confidence", "n"),
                    "acq_date": fire.get("acq_date", "")
                })
        except (ValueError, TypeError):
            continue

    # Сортируем по расстоянию
    nearby_fires.sort(key=lambda x: x["distance_km"])

    # Расчет Fire Danger Index
    temp = weather.get("main", {}).get("temp", 20)
    humidity = weather.get("main", {}).get("humidity", 50)
    wind_speed = weather.get("wind", {}).get("speed", 0)

    # Формула FDI (упрощенная)
    fdi = 0

    # Температура (0-40 баллов)
    if temp > 30:
        fdi += 40
    elif temp > 25:
        fdi += 30
    elif temp > 20:
        fdi += 20
    else:
        fdi += 10

    # Влажность (0-30 баллов, инвертировано)
    if humidity < 30:
        fdi += 30
    elif humidity < 50:
        fdi += 20
    else:
        fdi += 10

    # Ветер (0-30 баллов)
    if wind_speed > 10:
        fdi += 30
    elif wind_speed > 5:
        fdi += 20
    else:
        fdi += 10

    fdi = min(fdi, 100)  # Ограничиваем 100

    # Определяем уровень опасности
    if fdi >= 80:
        danger_level = "Critical"
    elif fdi >= 60:
        danger_level = "High"
    elif fdi >= 40:
        danger_level = "Moderate"
    else:
        danger_level = "Low"

    # Направление ветра
    wind_deg = weather.get("wind", {}).get("deg", 0)
    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    direction_index = int((wind_deg + 22.5) / 45) % 8
    wind_direction = directions[direction_index]

    # AQI
    aqi_data = air_quality.get("list", [{}])[0] if air_quality.get("list") else {}
    aqi_value = aqi_data.get("main", {}).get("aqi", 1)
    pm2_5 = aqi_data.get("components", {}).get("pm2_5", 0)

    aqi_status_map = {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}
    aqi_status = aqi_status_map.get(aqi_value, "Unknown")

    return {
        "active_fires_count": len(nearby_fires),
        "total_fires_global": fires.get("count", 0),
        "fire_danger_index": {
            "value": fdi,
            "level": danger_level
        },
        "wind_conditions": {
            "speed_ms": round(wind_speed, 2),
            "speed_kmh": round(wind_speed * 3.6, 1),
            "direction": wind_direction,
            "degrees": wind_deg
        },
        "aqi_smoke": {
            "aqi": aqi_value,
            "status": aqi_status,
            "pm2_5": round(pm2_5, 1)
        },
        "nearest_fires": nearby_fires[:10],  # Топ 10 ближайших
        "search_radius_km": radius_km,
        "location": {
            "latitude": latitude,
            "longitude": longitude
        }
    }


@router.get("/main")
async def get_main_dashboard_data(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота")
):
    """
    Получить данные для главного дашборда (Main Dashboard)

    Возвращает сводку по всем разделам:
    - farm_risk_index: Индекс риска для ферм
    - fire_hotspots: Количество очагов пожаров
    - weather_summary: Сводка погоды
    - air_quality_summary: Качество воздуха
    """
    # Получаем данные со всех источников
    climate = await nasa_power_client.get_agroclimatology_data(latitude=latitude, longitude=longitude)
    weather = await openweather_client.get_current_weather(latitude=latitude, longitude=longitude)
    air_quality = await openweather_client.get_air_quality(latitude=latitude, longitude=longitude)
    fires = await firms_client.get_active_fires(region="World", days=1)

    # Рассчитываем Farm Risk Index
    climate_params = climate.get("properties", {}).get("parameter", {})
    t2m_min_data = climate_params.get("T2M_MIN", {})
    min_temps = [v for v in t2m_min_data.values() if v != -999.0]
    min_temp = min(min_temps) if min_temps else 0

    humidity_data = climate_params.get("RH2M", {})
    humidity_values = [v for v in humidity_data.values() if v != -999.0]
    avg_humidity = sum(humidity_values) / len(humidity_values) if humidity_values else 50

    # Farm Risk (0-100)
    farm_risk = 50  # Базовый
    if min_temp < 0:
        farm_risk += 20  # Риск заморозков
    if avg_humidity < 40:
        farm_risk += 15  # Засуха
    elif avg_humidity > 80:
        farm_risk += 10  # Переувлажнение

    farm_risk = min(farm_risk, 100)

    # Количество пожаров (глобально и локально)
    total_fires = fires.get("count", 0)

    # AQI
    aqi_data = air_quality.get("list", [{}])[0] if air_quality.get("list") else {}
    aqi_value = aqi_data.get("main", {}).get("aqi", 1)

    # Погодная сводка
    temp = weather.get("main", {}).get("temp", 0)
    wind_speed = weather.get("wind", {}).get("speed", 0)

    return {
        "farm_risk_index": {
            "value": farm_risk,
            "trend": "stable",
            "factors": {
                "frost_risk": min_temp < 0,
                "humidity_level": round(avg_humidity, 1)
            }
        },
        "fire_hotspots": {
            "global_count": total_fires,
            "trend": "increasing"
        },
        "weather_summary": {
            "temperature": round(temp, 1),
            "wind_speed": round(wind_speed, 2),
            "conditions": weather.get("weather", [{}])[0].get("main", "Clear")
        },
        "air_quality_summary": {
            "aqi": aqi_value,
            "status": {1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very Poor"}.get(aqi_value, "Unknown")
        },
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "last_updated": "real-time"
    }
