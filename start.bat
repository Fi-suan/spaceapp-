@echo off
echo Запуск SpaceApp...
echo.

echo Проверка зависимостей...
cd back
if not exist "venv" (
    echo Установка зависимостей бэкенда...
    pip install fastapi uvicorn pydantic-settings
) else (
    echo Зависимости бэкенда уже установлены
)
cd ../front
if not exist "node_modules" (
    echo Установка зависимостей фронтенда...
    call npm install
) else (
    echo Зависимости фронтенда уже установлены
)
cd ..

echo.
echo Запуск бэкенда и фронтенда...
start "SpaceApp Backend" cmd /k "cd back && python app.py"
timeout /t 3 /nobreak > nul
start "SpaceApp Frontend" cmd /k "cd front && npm run dev"

echo.
echo SpaceApp запущен!
echo.
echo === Единый порт (рекомендуется) ===
echo Сайт: http://localhost:3000
echo API: http://localhost:3000/api/v1/space-objects/
echo Swagger: http://localhost:3000/docs
echo ReDoc: http://localhost:3000/redoc
echo.
echo === Прямой бэкенд (для разработки) ===
echo API: http://localhost:8001
echo.
pause