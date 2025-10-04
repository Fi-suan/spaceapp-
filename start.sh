#!/bin/bash

echo "Запуск SpaceApp..."
echo

echo "Проверка зависимостей..."
cd back
if [ ! -d "venv" ]; then
    echo "Установка зависимостей бэкенда..."
    pip install fastapi uvicorn pydantic-settings
else
    echo "Зависимости бэкенда уже установлены"
fi
cd ../front
if [ ! -d "node_modules" ]; then
    echo "Установка зависимостей фронтенда..."
    npm install
else
    echo "Зависимости фронтенда уже установлены"
fi
cd ..

echo
echo "Запуск бэкенда и фронтенда..."

# Запуск бэкенда в фоне
gnome-terminal --title="SpaceApp Backend" -- bash -c "cd back && python app.py; exec bash" &
sleep 3

# Запуск фронтенда в фоне
gnome-terminal --title="SpaceApp Frontend" -- bash -c "cd front && npm run dev; exec bash" &

echo
echo "SpaceApp запущен!"
echo
echo "=== Единый порт (рекомендуется) ==="
echo "Сайт: http://localhost:3000"
echo "API: http://localhost:3000/api/v1/space-objects/"
echo "Swagger: http://localhost:3000/docs"
echo "ReDoc: http://localhost:3000/redoc"
echo
echo "=== Прямой бэкенд (для разработки) ==="
echo "API: http://localhost:8001"
echo
echo "Нажмите Enter для завершения..."
read
