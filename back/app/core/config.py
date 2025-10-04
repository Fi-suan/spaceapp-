from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "SpaceApp API"
    app_description: str = "REST API для космического приложения"
    app_version: str = "1.0.0"

    # CORS настройки
    allowed_origins: list = ["*"]  # В продакшене указать конкретные домены
    allow_credentials: bool = True
    allowed_methods: list = ["*"]
    allowed_headers: list = ["*"]

    # Сервер настройки
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True

    class Config:
        env_file = ".env"

settings = Settings()