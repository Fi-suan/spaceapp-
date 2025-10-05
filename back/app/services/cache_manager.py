"""
Менеджер кэширования данных для городов с автоматическим обновлением
"""
import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging

from app.services.external_apis import (
    firms_client,
    nasa_power_client,
    openweather_client
)

logger = logging.getLogger(__name__)


class CityDataCache:
    """Кэш данных для городов"""

    def __init__(self):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._last_update: Dict[str, datetime] = {}
        self._update_interval = timedelta(minutes=20)
        self._is_running = False
        self._background_task: Optional[asyncio.Task] = None

    async def initialize(self, cities: List[Dict[str, Any]]):
        """Инициализация кэша с загрузкой данных для всех городов"""
        logger.info(f"Initializing cache for {len(cities)} cities...")

        # Загружаем данные для всех городов параллельно
        tasks = [self._fetch_city_data(city) for city in cities]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for i, (city, result) in enumerate(zip(cities, results)):
            if isinstance(result, Exception):
                logger.error(f"Error loading data for {city['name']}: {result}")
            else:
                self._cache[city['id']] = result
                self._last_update[city['id']] = datetime.now()
                logger.info(f"✓ Loaded data for {city['name']}")

        logger.info(f"Cache initialized with {len(self._cache)} cities")

    async def _fetch_city_data(self, city: Dict[str, Any]) -> Dict[str, Any]:
        """Загрузка всех данных для города"""
        lat = city['latitude']
        lon = city['longitude']

        # Загружаем все данные параллельно
        climate_task = nasa_power_client.get_agroclimatology_data(latitude=lat, longitude=lon)
        weather_task = openweather_client.get_current_weather(latitude=lat, longitude=lon)
        air_quality_task = openweather_client.get_air_quality(latitude=lat, longitude=lon)
        fires_task = firms_client.get_active_fires(region="World", days=1)

        climate, weather, air_quality, fires = await asyncio.gather(
            climate_task, weather_task, air_quality_task, fires_task
        )

        return {
            "city_id": city['id'],
            "city_name": city['name'],
            "latitude": lat,
            "longitude": lon,
            "climate": climate,
            "weather": weather,
            "air_quality": air_quality,
            "fires": fires,
            "ai_insights": None,  # Будет заполнено при первом запросе
            "cached_at": datetime.now().isoformat(),
            "expires_at": (datetime.now() + self._update_interval).isoformat()
        }

    def get_cached_data(self, city_id: str) -> Optional[Dict[str, Any]]:
        """Получить кэшированные данные города"""
        return self._cache.get(city_id)

    def is_stale(self, city_id: str) -> bool:
        """Проверить, устарели ли данные города"""
        if city_id not in self._last_update:
            return True

        last_update = self._last_update[city_id]
        return datetime.now() - last_update > self._update_interval

    async def refresh_city(self, city: Dict[str, Any]):
        """Обновить данные для конкретного города"""
        try:
            logger.info(f"Refreshing data for {city['name']}...")
            data = await self._fetch_city_data(city)
            self._cache[city['id']] = data
            self._last_update[city['id']] = datetime.now()
            logger.info(f"✓ Refreshed data for {city['name']}")
        except Exception as e:
            logger.error(f"Error refreshing {city['name']}: {e}")

    async def refresh_all(self, cities: List[Dict[str, Any]]):
        """Обновить данные для всех городов"""
        logger.info(f"Refreshing all {len(cities)} cities...")
        tasks = [self.refresh_city(city) for city in cities]
        await asyncio.gather(*tasks, return_exceptions=True)
        logger.info("All cities refreshed")

    async def start_background_refresh(self, cities: List[Dict[str, Any]]):
        """Запустить фоновое обновление данных каждые 20 минут"""
        self._is_running = True
        logger.info(f"Starting background refresh task (every {self._update_interval.total_seconds() / 60} minutes)...")

        while self._is_running:
            try:
                # Ждем 20 минут
                await asyncio.sleep(self._update_interval.total_seconds())

                # Обновляем все города
                await self.refresh_all(cities)

            except asyncio.CancelledError:
                logger.info("Background refresh task cancelled")
                break
            except Exception as e:
                logger.error(f"Error in background refresh: {e}")
                # Продолжаем работу даже при ошибке
                continue

    def stop_background_refresh(self):
        """Остановить фоновое обновление"""
        self._is_running = False
        if self._background_task:
            self._background_task.cancel()

    def update_ai_insights(self, city_id: str, ai_insights: Dict[str, Any]):
        """Обновить AI инсайты для города в кэше"""
        if city_id in self._cache:
            self._cache[city_id]["ai_insights"] = ai_insights
            logger.info(f"AI insights cached for {city_id}")

    def get_ai_insights(self, city_id: str) -> Optional[Dict[str, Any]]:
        """Получить закэшированные AI инсайты"""
        if city_id in self._cache:
            return self._cache[city_id].get("ai_insights")
        return None

    def get_cache_stats(self) -> Dict[str, Any]:
        """Получить статистику кэша"""
        return {
            "cached_cities": list(self._cache.keys()),
            "total_cities": len(self._cache),
            "last_updates": {
                city_id: last_update.isoformat()
                for city_id, last_update in self._last_update.items()
            },
            "update_interval_minutes": self._update_interval.total_seconds() / 60
        }


# Глобальный экземпляр кэша
city_cache = CityDataCache()
