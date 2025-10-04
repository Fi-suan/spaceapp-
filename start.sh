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

# Абсолютные пути для логов/пидов
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

# Запуск бэкенда в фоне (порт 8080)
echo "Старт бэкенда..."
( cd "$SCRIPT_DIR/back" && nohup python app.py > "$LOG_DIR/backend.log" 2>&1 & echo $! > "$LOG_DIR/backend.pid" )

# Ожидание здоровья бэкенда
for i in {1..30}; do
  if curl -fsS http://localhost:8080/health > /dev/null 2>&1; then
    echo "Бэкенд доступен на http://localhost:8080"
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "Внимание: бэкенд не ответил за 30 секунд. См. logs/backend.log"
  fi
done

# Запуск фронтенда в фоне (Next dev на 3000)
echo "Старт фронтенда..."
( cd "$SCRIPT_DIR/front" && nohup npm run dev -- --port 3000 > "$LOG_DIR/frontend.log" 2>&1 & echo $! > "$LOG_DIR/frontend.pid" )

# Ожидание фронтенда
for i in {1..60}; do
  if curl -fsS http://localhost:3000 > /dev/null 2>&1; then
    echo "Фронтенд доступен на http://localhost:3000"
    break
  fi
  sleep 1
  if [ "$i" -eq 60 ]; then
    echo "Внимание: фронтенд не ответил за 60 секунд. См. logs/frontend.log"
  fi
done

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
echo "API: http://localhost:8080"
echo
echo "Логи: $LOG_DIR/backend.log и $LOG_DIR/frontend.log"
