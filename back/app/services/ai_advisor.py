"""
Сервис для генерации AI рекомендаций и предупреждений через OpenAI API
"""
import json
import logging
from typing import Dict, Any, List
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)


class AIAdvisor:
    """Класс для работы с OpenAI API для генерации аграрных рекомендаций"""

    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = "gpt-4o-mini"  # Более современная и быстрая модель

    async def generate_agriculture_insights(
        self,
        weather_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Генерация рекомендаций и предупреждений для сельского хозяйства

        Args:
            weather_data: Данные о погоде и климате

        Returns:
            Dict с полями:
            - recommendations: List[str] - список рекомендаций
            - risk_alerts: List[Dict] - список предупреждений с уровнями риска
        """
        try:
            # Формируем контекст для AI
            context = self._format_weather_context(weather_data)

            # Системный промпт
            system_prompt = """You are an expert agricultural advisor and meteorologist.
Your task is to analyze weather conditions and provide actionable recommendations and risk alerts for farmers.

You MUST respond ONLY with a valid JSON object in this exact format:
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

Rules:
- Provide 3-5 specific, actionable recommendations based on current weather
- Include 1-3 risk alerts if there are weather hazards
- Risk alert levels: "critical", "warning", "info"
- Focus on frost risks, precipitation, air quality (PM2.5), wind, and temperature extremes
- Be concise and practical
- Respond ONLY with the JSON object, no additional text"""

            # Запрос к OpenAI
            logger.info(f"Sending request to OpenAI with context length: {len(context)} chars")

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": context}
                ],
                temperature=0.7,
                max_tokens=500
            )

            # Парсим ответ
            ai_response = response.choices[0].message.content.strip()
            logger.info(f"AI Response received: {ai_response[:200]}...")  # Первые 200 символов

            # Извлекаем JSON из ответа
            parsed_data = json.loads(ai_response)

            return {
                "recommendations": parsed_data.get("recommendations", []),
                "risk_alerts": parsed_data.get("risk_alerts", [])
            }

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {e}")
            logger.error(f"Raw AI response was: {ai_response if 'ai_response' in locals() else 'No response'}")
            return self._get_fallback_insights(weather_data)
        except Exception as e:
            logger.error(f"Error generating AI insights: {type(e).__name__}: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return self._get_fallback_insights(weather_data)

    def _format_weather_context(self, weather_data: Dict[str, Any]) -> str:
        """Форматирование погодных данных в текст для AI"""

        temp = weather_data.get("current_temperature", 0)
        frost_risk = weather_data.get("frost_risk", {})
        aqi = weather_data.get("aqi_impact", {})
        humidity = weather_data.get("humidity", 0)
        precipitation = weather_data.get("precipitation", 0)
        wind_speed = weather_data.get("wind_speed", 0)
        forecast = weather_data.get("forecast_7day", [])

        context = f"""Current Agricultural Weather Conditions:

Temperature: {temp}°C
Frost Risk: {frost_risk.get('percentage', 0)}% ({frost_risk.get('status', 'Unknown')})
Air Quality (PM2.5): {aqi.get('pm2_5', 0)} µg/m³ (Status: {aqi.get('status', 'Unknown')})
Humidity: {humidity}%
Precipitation: {precipitation} mm/day
Wind Speed: {wind_speed} m/s

7-Day Forecast:"""

        for day in forecast[:7]:
            context += f"\n- {day.get('date')}: {day.get('tempMin')}°C to {day.get('tempMax')}°C, Precip: {day.get('precipitation')} mm"

        context += "\n\nBased on these conditions, provide agricultural recommendations and risk alerts."

        return context

    def _get_fallback_insights(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """Запасные рекомендации если AI не сработал"""

        temp = weather_data.get("current_temperature", 0)
        frost_risk = weather_data.get("frost_risk", {})
        aqi = weather_data.get("aqi_impact", {})

        recommendations = []
        risk_alerts = []

        # Базовые правила
        if frost_risk.get("percentage", 0) > 50:
            recommendations.append("Apply frost protection measures to sensitive crops")
            risk_alerts.append({
                "level": "critical",
                "message": f"High frost risk ({frost_risk.get('percentage')}%). Protect vulnerable plants."
            })

        if temp > 30:
            recommendations.append("Increase irrigation frequency due to high temperatures")
            risk_alerts.append({
                "level": "warning",
                "message": "High temperatures may stress crops. Monitor soil moisture."
            })

        if aqi.get("pm2_5", 0) > 35:
            recommendations.append("Consider delaying outdoor agricultural work due to poor air quality")
            risk_alerts.append({
                "level": "warning",
                "message": f"Poor air quality (PM2.5: {aqi.get('pm2_5')}). Limit outdoor exposure."
            })

        if weather_data.get("precipitation", 0) < 1:
            recommendations.append("Monitor soil moisture levels - low precipitation expected")

        if len(recommendations) == 0:
            recommendations = [
                "Current conditions are favorable for normal farming operations",
                "Continue regular crop monitoring and maintenance",
                "Monitor weather forecasts for any sudden changes"
            ]

        if len(risk_alerts) == 0:
            risk_alerts.append({
                "level": "info",
                "message": "No significant weather risks detected at this time"
            })

        return {
            "recommendations": recommendations,
            "risk_alerts": risk_alerts
        }


# Глобальный экземпляр с вашим API ключом
ai_advisor = AIAdvisor(api_key="sk-proj-nVt8SxPLUeuKmVDDIx6TT3BlbkFJLwUst1mfQjpMkYm5rBnQ")
