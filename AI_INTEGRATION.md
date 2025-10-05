# AI Integration для Agriculture Dashboard

## Обзор

Реализована интеграция с OpenAI GPT-3.5-turbo для генерации персонализированных рекомендаций и предупреждений на основе реальных погодных данных.

## Как это работает

### 1. Backend (FastAPI)

**Файл:** `back/app/services/ai_advisor.py`

- Класс `AIAdvisor` обрабатывает запросы к OpenAI API
- Метод `generate_agriculture_insights()` принимает погодные данные и возвращает:
  - `recommendations`: список рекомендаций для фермеров
  - `risk_alerts`: список предупреждений с уровнями риска (critical/warning/info)

**Формат ответа AI:**
```json
{
  "recommendations": [
    "recommendation 1",
    "recommendation 2",
    "recommendation 3"
  ],
  "risk_alerts": [
    {
      "level": "critical",
      "message": "alert message"
    },
    {
      "level": "warning",
      "message": "alert message"
    }
  ]
}
```

### 2. API Endpoint

**Файл:** `back/app/api/dashboard_sections.py`

Эндпоинт `/dashboard/agriculture` теперь возвращает дополнительные поля:
- `recommendations`: AI-сгенерированные рекомендации
- `risk_alerts`: AI-обнаруженные риски

### 3. Frontend (Next.js)

**Файл:** `front/src/app/dashboard/farm/page.tsx`

Два обновленных блока:
- **AI Recommendations** - отображает список рекомендаций с зелеными иконками
- **AI Risk Alerts** - отображает предупреждения с цветовой кодировкой:
  - 🔴 Critical (красный)
  - 🟡 Warning (оранжевый)
  - 🔵 Info (синий)

## Что анализирует AI

AI получает следующие данные:
- Текущая температура
- Риск заморозков (процент и статус)
- Качество воздуха (PM2.5)
- Влажность
- Осадки
- Скорость ветра
- 7-дневный прогноз погоды

## Системный промпт

AI настроен как эксперт-агроном и метеоролог, который:
- Анализирует погодные условия
- Предоставляет практичные рекомендации
- Определяет риски (заморозки, осадки, качество воздуха, экстремальные температуры)
- Отвечает строго в формате JSON

## Fallback система

Если AI не отвечает или возникает ошибка, используется запасная логика:
- Базовые правила на основе пороговых значений
- Гарантирует, что пользователь всегда получит рекомендации

## API Key

Ключ OpenAI захардкоден в `ai_advisor.py`:
```python
ai_advisor = AIAdvisor(api_key="sk-proj-nVt8SxPLUeuKmVDDIx6TT3BlbkFJLwUst1mfQjpMkYm5rBnQ")
```

⚠️ **Для продакшена:** переместить ключ в переменные окружения (`.env`)

## Использование

### Запрос к API:
```bash
GET /dashboard/agriculture?city_id=moscow
```

### Ответ:
```json
{
  "current_temperature": 15.2,
  "frost_risk": {...},
  "recommendations": [
    "Apply frost protection measures to sensitive crops",
    "Monitor soil moisture due to low precipitation",
    "Consider delaying outdoor work due to moderate air quality"
  ],
  "risk_alerts": [
    {
      "level": "critical",
      "message": "High frost risk (65%). Protect vulnerable plants."
    }
  ]
}
```

## Производительность

- Время ответа AI: ~2-3 секунды
- Используется GPT-3.5-turbo (быстрый и доступный)
- Температура: 0.7 (баланс между креативностью и точностью)
- Max tokens: 500

## Будущие улучшения

1. Кэширование AI ответов для одинаковых погодных условий
2. Поддержка других языков
3. Интеграция с историческими данными
4. Персонализация по типу культур
5. Переход на GPT-4 для более точных рекомендаций
