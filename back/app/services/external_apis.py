"""
Клиенты для работы с внешними API (NASA, OpenWeatherMap)
"""
import httpx
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import os


class FirmsAPI:
    """Клиент для NASA FIRMS API - данные о пожарах"""

    BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api"

    def __init__(self, api_key: Optional[str] = None):
        from app.core.config import settings
        self.api_key = api_key or settings.firms_api_key

    async def get_active_fires(
        self,
        region: str = "World",
        days: int = 1,
        source: str = "VIIRS_SNPP_NRT"
    ) -> Dict[str, Any]:
        """
        Получить данные об активных пожарах

        Args:
            region: Регион (World, USA, Europe и т.д.)
            days: Количество дней назад (1-10)
            source: Источник данных (VIIRS_SNPP_NRT, MODIS_NRT)
        """
        if not self.api_key:
            return {
                "error": "FIRMS_API_KEY не настроен",
                "message": "Получите ключ на https://firms.modaps.eosdis.nasa.gov/api/",
                "mock_data": self._get_mock_fire_data()
            }

        url = f"{self.BASE_URL}/area/csv/{self.api_key}/{source}/{region}/{days}"

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url)
                response.raise_for_status()

                # Парсим CSV данные
                lines = response.text.strip().split('\n')
                if len(lines) < 2:
                    return {"fires": [], "count": 0}

                headers = lines[0].split(',')
                fires = []

                for line in lines[1:]:
                    values = line.split(',')
                    fire = dict(zip(headers, values))
                    fires.append(fire)

                return {
                    "fires": fires[:100],  # Ограничиваем для читаемости
                    "count": len(fires),
                    "source": source,
                    "region": region,
                    "days": days
                }

        except Exception as e:
            return {
                "error": str(e),
                "mock_data": self._get_mock_fire_data()
            }

    def _get_mock_fire_data(self) -> List[Dict[str, Any]]:
        """Моковые данные для тестирования"""
        return [
            {
                "latitude": 37.7749,
                "longitude": -122.4194,
                "brightness": 325.5,
                "scan": 1.2,
                "track": 1.3,
                "acq_date": "2024-10-04",
                "acq_time": "1234",
                "satellite": "N",
                "confidence": "high",
                "version": "2.0NRT",
                "bright_t31": 295.0,
                "frp": 12.5
            },
            {
                "latitude": 34.0522,
                "longitude": -118.2437,
                "brightness": 340.2,
                "scan": 1.1,
                "track": 1.2,
                "acq_date": "2024-10-04",
                "acq_time": "1456",
                "satellite": "N",
                "confidence": "high",
                "version": "2.0NRT",
                "bright_t31": 300.0,
                "frp": 15.8
            }
        ]


class NASAPowerAPI:
    """Клиент для NASA POWER API - агроклиматические данные"""

    BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

    async def get_agroclimatology_data(
        self,
        latitude: float = 55.7558,  # Москва по умолчанию
        longitude: float = 37.6173,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Получить агроклиматические данные

        Args:
            latitude: Широта
            longitude: Долгота
            start_date: Дата начала (YYYYMMDD)
            end_date: Дата окончания (YYYYMMDD)
        """
        # Если даты не указаны, берем последние 14 дней (чтобы гарантировать 7 точек с учетом задержки NASA API)
        if not start_date:
            start_date = (datetime.now() - timedelta(days=14)).strftime("%Y%m%d")
        if not end_date:
            end_date = (datetime.now() - timedelta(days=1)).strftime("%Y%m%d")  # Вчера, т.к. данные за сегодня еще нет

        params = {
            "parameters": "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M,WS2M",  # Температура, осадки, влажность, ветер
            "community": "AG",  # Agriculture community
            "longitude": longitude,
            "latitude": latitude,
            "start": start_date,
            "end": end_date,
            "format": "JSON"
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()

                return {
                    "location": {
                        "latitude": latitude,
                        "longitude": longitude
                    },
                    "parameters": data.get("parameters", {}),
                    "properties": data.get("properties", {}),
                    "dates": {
                        "start": start_date,
                        "end": end_date
                    }
                }

        except Exception as e:
            return {
                "error": str(e),
                "mock_data": self._get_mock_agro_data()
            }

    def _get_mock_agro_data(self) -> Dict[str, Any]:
        """Моковые данные для тестирования"""
        today = datetime.now().strftime("%Y%m%d")
        return {
            "T2M": {today: 22.5},  # Температура 2м над землей (°C)
            "T2M_MAX": {today: 28.0},  # Макс температура
            "T2M_MIN": {today: 15.0},  # Мин температура
            "PRECTOTCORR": {today: 2.5},  # Осадки (мм)
            "RH2M": {today: 65.0},  # Влажность (%)
            "WS2M": {today: 3.5}  # Скорость ветра (м/с)
        }


class OpenWeatherAPI:
    """Клиент для OpenWeatherMap API - погода и качество воздуха"""

    BASE_URL = "https://api.openweathermap.org/data/2.5"

    def __init__(self, api_key: Optional[str] = None):
        from app.core.config import settings
        self.api_key = api_key or settings.openweather_api_key

    async def get_current_weather(
        self,
        latitude: float = 55.7558,  # Москва
        longitude: float = 37.6173
    ) -> Dict[str, Any]:
        """Получить текущую погоду"""
        if not self.api_key:
            return {
                "error": "OPENWEATHER_API_KEY не настроен",
                "message": "Получите ключ на https://openweathermap.org/api",
                "mock_data": self._get_mock_weather_data()
            }

        url = f"{self.BASE_URL}/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": self.api_key,
            "units": "metric",
            "lang": "ru"
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()

        except Exception as e:
            return {
                "error": str(e),
                "mock_data": self._get_mock_weather_data()
            }

    async def get_air_quality(
        self,
        latitude: float = 55.7558,
        longitude: float = 37.6173
    ) -> Dict[str, Any]:
        """Получить данные о качестве воздуха (AQI)"""
        if not self.api_key:
            return {
                "error": "OPENWEATHER_API_KEY не настроен",
                "message": "Получите ключ на https://openweathermap.org/api",
                "mock_data": self._get_mock_aqi_data()
            }

        url = f"{self.BASE_URL}/air_pollution"
        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": self.api_key
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()

        except Exception as e:
            return {
                "error": str(e),
                "mock_data": self._get_mock_aqi_data()
            }

    def _get_mock_weather_data(self) -> Dict[str, Any]:
        """Моковые данные погоды (реалистичные для демо)"""
        return {
            "coord": {"lon": 37.6173, "lat": 55.7558},
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "base": "stations",
            "main": {
                "temp": 8.5,  # Реалистичная температура для октября в Москве
                "feels_like": 6.2,
                "temp_min": 5.0,
                "temp_max": 12.0,
                "pressure": 1015,
                "humidity": 72,
                "sea_level": 1015,
                "grnd_level": 998
            },
            "visibility": 10000,
            "wind": {
                "speed": 2.5,
                "deg": 190,
                "gust": 4.0
            },
            "clouds": {"all": 10},
            "dt": 1696435200,
            "sys": {
                "type": 2,
                "id": 2000314,
                "country": "RU",
                "sunrise": 1696392000,
                "sunset": 1696433400
            },
            "timezone": 10800,
            "id": 524901,
            "name": "Moscow",
            "cod": 200,
            "note": "⚠️ DEMO DATA - OpenWeather API key not configured or inactive"
        }

    def _get_mock_aqi_data(self) -> Dict[str, Any]:
        """Моковые данные AQI (реалистичные для демо)"""
        return {
            "coord": {"lon": 37.6173, "lat": 55.7558},
            "list": [{
                "main": {"aqi": 2},  # 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
                "components": {
                    "co": 290.39,     # Carbon monoxide (μg/m³)
                    "no": 0.52,       # Nitrogen monoxide
                    "no2": 25.73,     # Nitrogen dioxide
                    "o3": 42.15,      # Ozone
                    "so2": 8.42,      # Sulphur dioxide
                    "pm2_5": 18.5,    # Fine particles matter (хорошо для города)
                    "pm10": 35.2,     # Coarse particulate matter
                    "nh3": 1.23       # Ammonia
                },
                "dt": 1696435200
            }],
            "note": "⚠️ DEMO DATA - OpenWeather API key not configured or inactive"
        }


# Создаем синглтон экземпляры
firms_client = FirmsAPI()
nasa_power_client = NASAPowerAPI()
openweather_client = OpenWeatherAPI()
