"""
Роутер для работы с внешними экологическими данными (NASA, OpenWeatherMap)
"""
from fastapi import APIRouter, Query
from typing import Optional

from app.services.external_apis import (
    firms_client,
    nasa_power_client,
    openweather_client
)

router = APIRouter(
    prefix="/environmental",
    tags=["environmental-data"]
)


@router.get("/fires/active")
async def get_active_fires(
    region: str = Query(default="World", description="Регион для поиска пожаров"),
    days: int = Query(default=1, ge=1, le=10, description="Количество дней назад"),
    source: str = Query(default="VIIRS_SNPP_NRT", description="Источник данных (VIIRS_SNPP_NRT, MODIS_NRT)")
):
    """
    Получить данные об активных пожарах из NASA FIRMS API

    - **region**: World, USA, Europe, и т.д.
    - **days**: От 1 до 10 дней назад
    - **source**: VIIRS_SNPP_NRT или MODIS_NRT

    Требуется FIRMS_API_KEY в переменных окружения.
    Получить ключ: https://firms.modaps.eosdis.nasa.gov/api/
    """
    return await firms_client.get_active_fires(region=region, days=days, source=source)


@router.get("/agriculture/climate")
async def get_agriculture_climate(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота"),
    start_date: Optional[str] = Query(default=None, description="Дата начала (YYYYMMDD)"),
    end_date: Optional[str] = Query(default=None, description="Дата окончания (YYYYMMDD)")
):
    """
    Получить агроклиматические данные из NASA POWER API

    - **latitude**: Широта точки
    - **longitude**: Долгота точки
    - **start_date**: Начальная дата (формат YYYYMMDD)
    - **end_date**: Конечная дата (формат YYYYMMDD)

    Возвращает данные о температуре, осадках, влажности, ветре для сельского хозяйства.
    """
    return await nasa_power_client.get_agroclimatology_data(
        latitude=latitude,
        longitude=longitude,
        start_date=start_date,
        end_date=end_date
    )


@router.get("/weather/current")
async def get_current_weather(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота")
):
    """
    Получить текущую погоду из OpenWeatherMap API

    - **latitude**: Широта точки
    - **longitude**: Долгота точки

    Требуется OPENWEATHER_API_KEY в переменных окружения.
    Получить ключ: https://openweathermap.org/api
    """
    return await openweather_client.get_current_weather(
        latitude=latitude,
        longitude=longitude
    )


@router.get("/air-quality")
async def get_air_quality(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота")
):
    """
    Получить данные о качестве воздуха (AQI) из OpenWeatherMap API

    - **latitude**: Широта точки
    - **longitude**: Долгота точки

    Возвращает индекс качества воздуха и компоненты (PM2.5, PM10, O3, NO2, SO2, CO).

    Требуется OPENWEATHER_API_KEY в переменных окружения.
    """
    return await openweather_client.get_air_quality(
        latitude=latitude,
        longitude=longitude
    )


@router.get("/dashboard/combined")
async def get_combined_dashboard_data(
    latitude: float = Query(default=55.7558, description="Широта"),
    longitude: float = Query(default=37.6173, description="Долгота")
):
    """
    Получить комбинированные данные для дашборда

    Возвращает все данные сразу: пожары, климат, погоду и качество воздуха
    """
    # Запрашиваем все данные параллельно
    fires = await firms_client.get_active_fires(region="World", days=1)
    climate = await nasa_power_client.get_agroclimatology_data(latitude=latitude, longitude=longitude)
    weather = await openweather_client.get_current_weather(latitude=latitude, longitude=longitude)
    air_quality = await openweather_client.get_air_quality(latitude=latitude, longitude=longitude)

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude
        },
        "fires": fires,
        "agriculture_climate": climate,
        "current_weather": weather,
        "air_quality": air_quality
    }
