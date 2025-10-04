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

### 1. Установка зависимостей

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

### 2. Запуск приложения

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
- **CORS** middleware для связи с фронтендом

### Фронтенд
- **Next.js 14** - React фреймворк
- **TypeScript** - типизированный JavaScript
- **TailwindCSS** - утилитарный CSS фреймворк
- **React Hooks** - для управления состоянием

## Возможности

✅ **REST API** с полным CRUD функционалом
✅ **Swagger/OpenAPI** документация
✅ **Современный UI** с темной темой
✅ **Реальное время** обновления данных
✅ **TypeScript** поддержка
✅ **Responsive дизайн**
✅ **Обработка ошибок** и loading состояний

## Разработка

Проект использует:
- FastAPI для создания REST API
- Next.js для создания React приложения
- TypeScript для типобезопасности
- TailwindCSS для стилизации
- CORS для связи фронт-бэк

Изначальные данные включают космические объекты: Землю, Марс и Солнце.