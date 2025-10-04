from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.core.config import settings
from app.api.space_objects import router as space_objects_router

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

    @app.get("/")
    async def root():
        """Главная страница API"""
        return {"message": "SpaceApp API работает!", "docs": "/docs"}

    @app.get("/health")
    async def health_check():
        """Проверка работоспособности API"""
        return {"status": "ok", "message": "API работает нормально"}

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port
    )