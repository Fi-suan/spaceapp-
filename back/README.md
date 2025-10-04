# SpaceApp Backend

FastAPI REST API для космического приложения.

## Установка

1. Установите зависимости:
```bash
cd back
pip install fastapi uvicorn pydantic-settings
```

## Запуск

```bash
cd back
python app.py
```

Сервер запустится на http://localhost:8000

## API Документация

После запуска доступна по адресам:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Структура проекта

```
back/
├── app/
│   ├── api/          # API роутеры
│   ├── core/         # Конфигурация и база данных
│   └── models/       # Pydantic модели
├── app.py            # Главный файл
└── requirements.txt  # Зависимости
```

## API Эндпоинты

- `GET /` - Главная страница
- `GET /health` - Проверка работоспособности
- `GET /api/v1/space-objects/` - Получить все космические объекты
- `GET /api/v1/space-objects/{id}` - Получить объект по ID
- `POST /api/v1/space-objects/` - Создать новый объект
- `PUT /api/v1/space-objects/{id}` - Обновить объект
- `DELETE /api/v1/space-objects/{id}` - Удалить объект
- `GET /api/v1/space-objects/type/{type}` - Получить объекты по типу

## Пример данных

```json
{
  "id": 1,
  "name": "Земля",
  "type": "planet",
  "description": "Наша планета",
  "distance_from_earth": 0
}
```