# SpaceApp 🚀

Full-stack космическое приложение с FastAPI бэкендом и Next.js фронтендом.

## Структура проекта

```
spaceapp/
├── back/           # FastAPI бэкенд
│   ├── app/        # Основной код приложения
│   ├── app.py      # Точка входа
│   └── requirements.txt
├── front/          # Next.js фронтенд
│   ├── src/        # Исходный код
│   └── package.json
└── README.md       # Этот файл
```

## Быстрый старт

### Вариант 1: Docker (Рекомендуется) 🐳

1. **Настройте переменные окружения:**
```bash
cp .env.example .env
# Отредактируйте .env и добавьте ваши API ключи
```

2. **Запустите приложение:**
```bash
docker-compose up -d
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Swagger Docs: http://localhost:8080/docs

3. **Остановить:**
```bash
docker-compose down
```

### Вариант 2: Локальная разработка

#### 1. Установка зависимостей

**Бэкенд:**
```bash
cd back
pip install -r requirements.txt
```

**Фронтенд:**
```bash
cd front
npm install
```

#### 2. Настройка переменных окружения
```bash
cp .env.example .env
# Добавьте ваши API ключи в .env файл
```

#### 3. Запуск приложения

**Запустить всё одновременно:**
```bash
npm run dev
```

**Или запустить по отдельности:**

Бэкенд (FastAPI):
```bash
npm run backend
# или
cd back && python app.py
```

Фронтенд (Next.js):
```bash
npm run frontend
# или
cd front && npm run dev
```

## Доступные адреса

**Всё на одном порту через Next.js proxy:**
- **Фронтенд**: http://localhost:3000
- **API**: http://localhost:3000/api/v1/space-objects/
- **Swagger документация**: http://localhost:3000/docs
- **ReDoc документация**: http://localhost:3000/redoc

**Прямой доступ к бэкенду (для разработки):**
- **Бэкенд API**: http://localhost:8001

## API эндпоинты

- `GET /api/v1/space-objects/` - Получить все космические объекты
- `GET /api/v1/space-objects/{id}` - Получить объект по ID
- `POST /api/v1/space-objects/` - Создать новый объект
- `PUT /api/v1/space-objects/{id}` - Обновить объект
- `DELETE /api/v1/space-objects/{id}` - Удалить объект
- `GET /api/v1/space-objects/type/{type}` - Получить объекты по типу

## Технологии

### Бэкенд
- **FastAPI** - современный веб-фреймворк для Python
- **Pydantic** - валидация данных
- **Uvicorn** - ASGI сервер
- **OpenAI GPT-4o-mini** - AI инсайты и анализ
- **NASA POWER API** - агроклиматические данные
- **OpenWeatherMap API** - погода и качество воздуха
- **CORS** middleware для связи с фронтендом

### Фронтенд
- **Next.js 14** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **TailwindCSS** - утилитарный CSS фреймворк
- **Recharts** - графики и визуализация данных
- **React Hooks** - для управления состоянием

### DevOps
- **Docker** - контейнеризация приложения
- **Docker Compose** - оркестрация контейнеров

## Возможности

✅ **Multi-Dashboard Architecture** - Agriculture, Insurance, Wildfire
✅ **AI-Powered Insights** - GPT-4o-mini анализ погоды и рисков
✅ **19 Global Cities** - от Алматы до Кейптауна
✅ **Real-time Weather Data** - NASA POWER + OpenWeatherMap
✅ **Air Quality Monitoring** - CO, NO₂, O₃, SO₂
✅ **Climate Risk Assessment** - страховые риски и фермерские рекомендации
✅ **Interactive Charts** - Recharts визуализация
✅ **Responsive Design** - адаптивный дизайн
✅ **Docker Support** - простой деплой
✅ **TypeScript** - полная типизация

## Требования

- Node.js 22.x
- Python 3.13+
- Docker & Docker Compose (опционально)
- OpenAI API key
- OpenWeatherMap API key

## Структура данных

Приложение интегрирует данные из:
- **NASA POWER API** - температура, осадки, влажность, скорость ветра
- **OpenWeatherMap Air Pollution API** - AQI, PM2.5, CO, NO₂, O₃, SO₂
- **OpenAI GPT-4o-mini** - AI-генерация инсайтов, рисков, рекомендаций