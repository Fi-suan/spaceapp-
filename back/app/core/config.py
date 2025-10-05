from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "SpaceApp API"
    app_description: str = "REST API для космического приложения"
    app_version: str = "1.0.0"

    # CORS настройки
    allowed_origins: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://spaceapp-c5mm.onrender.com",  # Production frontend
    ]
    allow_credentials: bool = True
    allowed_methods: list = ["*"]
    allowed_headers: list = ["*"]

    # Сервер настройки
    host: str = "0.0.0.0"
    port: int = 8080
    debug: bool = True

    # API ключи для хакатона
    firms_api_key: str = "7e4b7699d09603e9dc1c35257474ef8a"
    openweather_api_key: str = "3cb51132b357bb5dabdcfe87f5ff9d9e"

    class Config:
        env_file = ".env"

settings = Settings()