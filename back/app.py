from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import logging

from app.core.config import settings
from app.api.space_objects import router as space_objects_router
from app.api.dashboard_sections import router as dashboard_router
from app.services.cache_manager import city_cache

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Список городов для кэширования
CITIES = [
    # Kazakhstan
    {'id': 'almaty', 'name': 'Алматы', 'latitude': 43.2220, 'longitude': 76.8512},
    {'id': 'astana', 'name': 'Астана', 'latitude': 51.1694, 'longitude': 71.4491},
    {'id': 'pavlodar', 'name': 'Павлодар', 'latitude': 52.2873, 'longitude': 76.9665},
    {'id': 'ekibastuz', 'name': 'Екибастуз', 'latitude': 51.7244, 'longitude': 75.3232},
    {'id': 'aktau', 'name': 'Актау', 'latitude': 43.6506, 'longitude': 51.1603},
    # USA
    {'id': 'los-angeles', 'name': 'Los Angeles', 'latitude': 34.0522, 'longitude': -118.2437},
    {'id': 'miami', 'name': 'Miami', 'latitude': 25.7617, 'longitude': -80.1918},
    # Australia
    {'id': 'sydney', 'name': 'Sydney', 'latitude': -33.8688, 'longitude': 151.2093},
    {'id': 'perth', 'name': 'Perth', 'latitude': -31.9505, 'longitude': 115.8605},
    # Europe
    {'id': 'london', 'name': 'London', 'latitude': 51.5074, 'longitude': -0.1278},
    {'id': 'paris', 'name': 'Paris', 'latitude': 48.8566, 'longitude': 2.3522},
    {'id': 'barcelona', 'name': 'Barcelona', 'latitude': 41.3851, 'longitude': 2.1734},
    # Asia
    {'id': 'tokyo', 'name': 'Tokyo', 'latitude': 35.6762, 'longitude': 139.6503},
    {'id': 'singapore', 'name': 'Singapore', 'latitude': 1.3521, 'longitude': 103.8198},
    {'id': 'dubai', 'name': 'Dubai', 'latitude': 25.2048, 'longitude': 55.2708},
    # South America
    {'id': 'sao-paulo', 'name': 'São Paulo', 'latitude': -23.5505, 'longitude': -46.6333},
    {'id': 'buenos-aires', 'name': 'Buenos Aires', 'latitude': -34.6037, 'longitude': -58.3816},
    # Africa
    {'id': 'cairo', 'name': 'Cairo', 'latitude': 30.0444, 'longitude': 31.2357},
    {'id': 'cape-town', 'name': 'Cape Town', 'latitude': -33.9249, 'longitude': 18.4241}
]

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.app_name,
        description=settings.app_description,
        version=settings.app_version,
        docs_url="/docs",  # Swagger UI
        redoc_url="/redoc"  # ReDoc
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=settings.allow_credentials,
        allow_methods=settings.allowed_methods,
        allow_headers=settings.allowed_headers,
    )

    # Подключение роутеров
    app.include_router(space_objects_router, prefix="/api/v1")
    app.include_router(dashboard_router, prefix="/api/v1")

    @app.on_event("startup")
    async def startup_event():
        """Инициализация кэша при запуске приложения"""
        logger.info("🚀 Starting SpaceApp API...")
        logger.info("📦 Initializing cache for cities...")

        # Инициализируем кэш с загрузкой данных для всех городов
        await city_cache.initialize(CITIES)

        # Запускаем фоновую задачу обновления каждые 20 минут
        asyncio.create_task(city_cache.start_background_refresh(CITIES))
        logger.info("✅ Cache initialized and background refresh started")

    @app.on_event("shutdown")
    async def shutdown_event():
        """Остановка фоновых задач при выключении"""
        logger.info("🛑 Shutting down SpaceApp API...")
        city_cache.stop_background_refresh()
        logger.info("✅ Background tasks stopped")

    @app.get("/")
    async def root():
        """Главная страница API"""
        return {"message": "SpaceApp API работает!", "docs": "/docs"}

    @app.get("/health")
    async def health_check():
        """Проверка работоспособности API"""
        return {"status": "ok", "message": "API работает нормально"}

    @app.get("/cache/stats")
    async def cache_stats():
        """Статистика кэша"""
        return city_cache.get_cache_stats()

    @app.get("/cities")
    async def get_cities():
        """Получить список доступных городов"""
        return {
            "cities": CITIES,
            "total": len(CITIES)
        }

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port
    )