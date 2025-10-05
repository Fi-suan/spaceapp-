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
Your task is to analyze weather conditions and provide actionable recommendations, risk alerts, and interesting weather facts for farmers.

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
  ],
  "weather_facts": [
    "interesting fact about current conditions 1",
    "interesting fact about current conditions 2",
    "interesting fact about current conditions 3"
  ]
}

Rules:
- Provide 3-5 specific, actionable recommendations based on current weather
- Include 1-3 risk alerts if there are weather hazards
- Risk alert levels: "critical", "warning", "info"
- Focus on frost risks, precipitation, air quality (PM2.5, CO, NO2, O3, SO2), wind, and temperature extremes
- Analyze air pollutants: CO (safe <4000), NO2 (safe <40), O3 (safe <100), SO2 (safe <20) in µg/m³
- Provide 3-4 practical and interesting facts for farmers about current conditions
- Weather facts should be farmer-friendly tips, observations, or useful information about:
  * How current conditions affect specific crops
  * Best timing for farming activities based on weather
  * Impact on soil, pests, or plant growth
  * Simple ways to optimize farming in these conditions
- Make facts practical, engaging, and directly useful for farming decisions
- Be concise and down-to-earth
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
                "risk_alerts": parsed_data.get("risk_alerts", []),
                "weather_facts": parsed_data.get("weather_facts", [])
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
        air_components = weather_data.get("air_quality_components", {})
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

Air Quality Components:
- Carbon Monoxide (CO): {air_components.get('co', 0)} µg/m³
- Nitrogen Dioxide (NO2): {air_components.get('no2', 0)} µg/m³
- Ozone (O3): {air_components.get('o3', 0)} µg/m³
- Sulphur Dioxide (SO2): {air_components.get('so2', 0)} µg/m³

7-Day Forecast:"""

        for day in forecast[:7]:
            context += f"\n- {day.get('date')}: {day.get('tempMin')}°C to {day.get('tempMax')}°C, Precip: {day.get('precipitation')} mm"

        context += "\n\nBased on these conditions, provide agricultural recommendations, risk alerts, and interesting weather facts."

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

        # Weather facts fallback - practical tips for farmers
        humidity = weather_data.get('humidity', 0)
        weather_facts = []

        if temp < 5:
            weather_facts.append(f"Cold weather ({temp}°C) slows plant growth - consider using row covers for sensitive crops")
        elif temp > 25:
            weather_facts.append(f"Warm temperatures ({temp}°C) speed up evaporation - increase watering frequency by 20-30%")
        else:
            weather_facts.append(f"Current temperature ({temp}°C) is optimal for most crop growth and field work")

        if humidity > 70:
            weather_facts.append(f"High humidity ({humidity}%) creates favorable conditions for fungal diseases - check crops regularly")
        elif humidity < 40:
            weather_facts.append(f"Low humidity ({humidity}%) increases water stress - monitor soil moisture closely")

        if aqi.get("pm2_5", 0) > 35:
            weather_facts.append("Poor air quality may reduce photosynthesis efficiency - ensure adequate irrigation")
        else:
            weather_facts.append("Good air quality supports healthy plant growth and efficient photosynthesis")

        if len(weather_facts) < 3:
            weather_facts.append("Monitor daily forecasts to plan irrigation and field work efficiently")

        return {
            "recommendations": recommendations,
            "risk_alerts": risk_alerts,
            "weather_facts": weather_facts
        }


    async def generate_insurance_insights(
        self,
        climate_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Генерация страховых рисков и верификации claims

        Args:
            climate_data: Климатические данные и экстремальные события

        Returns:
            Dict с полями:
            - climate_risks: List[Dict] - климатические риски для страховых компаний
            - verified_claims: List[Dict] - верифицированные страховые случаи
        """
        try:
            # Формируем контекст для AI
            context = self._format_insurance_context(climate_data)

            # Системный промпт для страховых рисков
            system_prompt = """You are an expert insurance analyst and climate risk assessor.
Your task is to analyze climate and weather data to identify insurance risks, verify claims, and provide insights.

You MUST respond ONLY with a valid JSON object in this exact format:
{
  "climate_risks": [
    {
      "type": "Frost Events",
      "count": "2 events",
      "severity": "medium"
    },
    {
      "type": "Drought Days",
      "count": "18 days",
      "severity": "high"
    }
  ],
  "verified_claims": [
    {
      "claim_id": "CLM-2024-001",
      "type": "Drought Loss",
      "location": "Region name",
      "status": "verified",
      "evidence": ["Evidence point 1", "Evidence point 2"],
      "fraud_probability": "8%"
    }
  ],
  "insurance_insights": [
    "interesting insurance fact 1",
    "interesting insurance fact 2",
    "interesting insurance fact 3"
  ]
}

Rules:
- Provide 3-5 climate risks based on weather events
- Generate 1-2 realistic verified insurance claims based on the data
- Provide 3-4 practical insurance insights about current risks
- Insurance insights should be useful information about:
  * How current weather affects insurance premiums or coverage
  * Historical claim patterns in similar conditions
  * Risk mitigation strategies for property owners
  * Impact of climate trends on insurance costs
- Severity levels: "low", "medium", "high", "critical"
- Status: "verified", "pending", "rejected"
- Focus on extreme weather events: frost, drought, floods, storms, fires
- Be specific with numbers and evidence
- Make insights practical and informative for insurance holders
- Respond ONLY with the JSON object, no additional text"""

            # Запрос к OpenAI
            logger.info(f"Sending insurance request to OpenAI with context length: {len(context)} chars")

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": context}
                ],
                temperature=0.7,
                max_tokens=700
            )

            # Парсим ответ
            ai_response = response.choices[0].message.content.strip()
            logger.info(f"AI Insurance Response received: {ai_response[:200]}...")

            # Извлекаем JSON из ответа
            parsed_data = json.loads(ai_response)

            return {
                "climate_risks": parsed_data.get("climate_risks", []),
                "verified_claims": parsed_data.get("verified_claims", []),
                "insurance_insights": parsed_data.get("insurance_insights", [])
            }

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI insurance response as JSON: {e}")
            logger.error(f"Raw AI response was: {ai_response if 'ai_response' in locals() else 'No response'}")
            return self._get_fallback_insurance_insights(climate_data)
        except Exception as e:
            logger.error(f"Error generating AI insurance insights: {type(e).__name__}: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return self._get_fallback_insurance_insights(climate_data)

    def _format_insurance_context(self, climate_data: Dict[str, Any]) -> str:
        """Форматирование климатических данных для страхового анализа"""

        extreme_events = climate_data.get("weather_verified_events", [])
        risk_assessment = climate_data.get("risk_assessment", {})
        climate_summary = climate_data.get("climate_summary", {})
        region = climate_data.get("region", "Unknown Region")

        context = f"""Insurance Climate Risk Assessment for {region}:

Risk Assessment Level: {risk_assessment.get('level', 'Unknown')} (Score: {risk_assessment.get('score', 0)})

Climate Summary ({climate_summary.get('days_analyzed', 0)} days):
- Average Temperature: {climate_summary.get('avg_temperature', 0)}°C
- Total Precipitation: {climate_summary.get('total_precipitation', 0)} mm
- Current Conditions: {risk_assessment.get('factors', {}).get('temperature', 0)}°C, Wind: {risk_assessment.get('factors', {}).get('wind_speed', 0)} m/s

Extreme Weather Events Detected:"""

        if extreme_events:
            for event in extreme_events:
                context += f"\n- {event.get('type')}: {event.get('value')} (Severity: {event.get('severity', 'Unknown')})"
        else:
            context += "\n- No extreme events detected in the period"

        context += "\n\nBased on this data, identify insurance risks and generate realistic claim verifications."

        return context

    def _get_fallback_insurance_insights(self, climate_data: Dict[str, Any]) -> Dict[str, Any]:
        """Запасные страховые инсайты если AI не сработал"""

        extreme_events = climate_data.get("weather_verified_events", [])
        region = climate_data.get("region", "Unknown Region")

        climate_risks = []
        verified_claims = []

        # Генерируем риски на основе экстремальных событий
        frost_count = sum(1 for e in extreme_events if "Cold" in e.get("type", ""))
        heat_count = sum(1 for e in extreme_events if "Heat" in e.get("type", ""))
        precip_count = sum(1 for e in extreme_events if "Precipitation" in e.get("type", ""))

        if frost_count > 0:
            climate_risks.append({
                "type": "Frost Events",
                "count": f"{frost_count} events",
                "severity": "high" if frost_count > 2 else "medium"
            })

        if heat_count > 0:
            climate_risks.append({
                "type": "Heat Waves",
                "count": f"{heat_count} events",
                "severity": "high" if heat_count > 3 else "medium"
            })

        if precip_count > 0:
            climate_risks.append({
                "type": "Heavy Precipitation",
                "count": f"{precip_count} events",
                "severity": "medium"
            })

        # Добавляем базовые риски
        if len(climate_risks) < 3:
            climate_risks.append({
                "type": "Drought Days",
                "count": "Monitoring",
                "severity": "low"
            })

        # Генерируем пример верифицированного claim
        if extreme_events and len(extreme_events) > 0:
            event = extreme_events[0]
            verified_claims.append({
                "claim_id": "CLM-2024-AUTO",
                "type": f"{event.get('type', 'Weather')} Damage",
                "location": region,
                "status": "verified",
                "evidence": [
                    f"Weather event confirmed: {event.get('value')}",
                    f"Severity level: {event.get('severity', 'Medium')}"
                ],
                "fraud_probability": "12%"
            })

        # Insurance insights fallback
        insurance_insights = []

        if precip_count > 0:
            insurance_insights.append(f"Heavy precipitation events increase flood insurance claims by 40-60% on average")

        if frost_count > 0:
            insurance_insights.append(f"Frost damage claims typically spike within 48 hours of cold events - document damage promptly")

        if len(climate_risks) > 2:
            insurance_insights.append("Multiple weather risks detected - consider comprehensive property insurance coverage")
        else:
            insurance_insights.append("Current conditions are relatively stable - good time to review insurance policy terms")

        if len(insurance_insights) < 3:
            insurance_insights.append("Climate-related insurance claims have increased 30% globally over the past decade")

        return {
            "climate_risks": climate_risks if climate_risks else [{"type": "No Risks", "count": "0", "severity": "low"}],
            "verified_claims": verified_claims if verified_claims else [],
            "insurance_insights": insurance_insights
        }


    async def generate_wildfire_insights(
        self,
        fire_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Генерация прогноза распространения пожара и рекомендаций

        Args:
            fire_data: Данные о пожарах и погодных условиях

        Returns:
            Dict с полями:
            - spread_forecast: Dict - прогноз распространения пожара
            - threatened_areas: List[Dict] - угрожаемые территории
            - evacuation_priority: str - приоритет эвакуации
        """
        try:
            # Формируем контекст для AI
            context = self._format_wildfire_context(fire_data)

            # Системный промпт для прогноза пожаров
            system_prompt = """You are an expert wildfire behavior analyst and emergency response coordinator.
Your task is to analyze fire conditions and provide spread forecasts and evacuation recommendations.

You MUST respond ONLY with a valid JSON object in this exact format:
{
  "spread_forecast": {
    "direction": "Northeast",
    "speed_kmh": 12.5,
    "confidence": "high",
    "weather_factor": "Strong winds accelerating spread"
  },
  "threatened_areas": [
    {
      "name": "Settlement Name",
      "distance_km": 15,
      "eta_hours": 4,
      "priority": "critical"
    }
  ],
  "evacuation_priority": "immediate",
  "air_quality_impact": {
    "affected_radius_km": 50,
    "severity": "hazardous"
  }
}

Rules:
- Analyze wind direction, speed, temperature, humidity for spread prediction
- Provide realistic ETA for threatened areas based on fire conditions
- Priority levels: "critical", "high", "moderate", "low"
- Evacuation priority: "immediate", "prepare", "monitor"
- Be specific with numbers and distances
- Consider weather conditions in forecast
- Respond ONLY with the JSON object, no additional text"""

            # Запрос к OpenAI
            logger.info(f"Sending wildfire request to OpenAI with context length: {len(context)} chars")

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": context}
                ],
                temperature=0.7,
                max_tokens=600
            )

            # Парсим ответ
            ai_response = response.choices[0].message.content.strip()
            logger.info(f"AI Wildfire Response received: {ai_response[:200]}...")

            # Извлекаем JSON из ответа
            parsed_data = json.loads(ai_response)

            return {
                "spread_forecast": parsed_data.get("spread_forecast", {}),
                "threatened_areas": parsed_data.get("threatened_areas", []),
                "evacuation_priority": parsed_data.get("evacuation_priority", "monitor"),
                "air_quality_impact": parsed_data.get("air_quality_impact", {})
            }

        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI wildfire response as JSON: {e}")
            logger.error(f"Raw AI response was: {ai_response if 'ai_response' in locals() else 'No response'}")
            return self._get_fallback_wildfire_insights(fire_data)
        except Exception as e:
            logger.error(f"Error generating AI wildfire insights: {type(e).__name__}: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return self._get_fallback_wildfire_insights(fire_data)

    def _format_wildfire_context(self, fire_data: Dict[str, Any]) -> str:
        """Форматирование данных о пожарах для AI"""

        fire_count = fire_data.get("active_fires_count", 0)
        fdi = fire_data.get("fire_danger_index", {})
        wind = fire_data.get("wind_conditions", {})
        nearest_fires = fire_data.get("nearest_fires", [])
        region = fire_data.get("region", "Unknown Region")

        context = f"""Wildfire Spread Forecast for {region}:

Active Fires: {fire_count} within monitoring area
Fire Danger Index: {fdi.get('value', 0)}/100 ({fdi.get('level', 'Unknown')})

Weather Conditions:
- Wind: {wind.get('speed_kmh', 0)} km/h {wind.get('direction', 'N')}
- Temperature: {fire_data.get('temperature', 20)}°C
- Humidity: {fire_data.get('humidity', 50)}%

Nearest Active Fires:"""

        if nearest_fires:
            for i, fire in enumerate(nearest_fires[:3], 1):
                context += f"\n{i}. Distance: {fire.get('distance_km', 0)} km, Brightness: {fire.get('brightness', 0)} K, FRP: {fire.get('frp', 0)} MW"
        else:
            context += "\n- No immediate fires detected"

        context += "\n\nProvide spread forecast, threatened areas, and evacuation recommendations based on these conditions."

        return context

    def _get_fallback_wildfire_insights(self, fire_data: Dict[str, Any]) -> Dict[str, Any]:
        """Запасной прогноз пожаров если AI не сработал"""

        wind = fire_data.get("wind_conditions", {})
        fire_count = fire_data.get("active_fires_count", 0)
        fdi = fire_data.get("fire_danger_index", {})
        nearest_fires = fire_data.get("nearest_fires", [])

        # Определяем направление распространения по ветру
        wind_dir = wind.get("direction", "N")
        wind_speed = wind.get("speed_kmh", 0)

        # Базовый прогноз
        spread_forecast = {
            "direction": wind_dir,
            "speed_kmh": round(wind_speed * 0.6, 1),  # Огонь обычно медленнее ветра
            "confidence": "medium",
            "weather_factor": f"Wind-driven spread towards {wind_dir}"
        }

        threatened_areas = []
        evacuation_priority = "monitor"

        # Определяем угрозы на основе близости пожаров и FDI
        if nearest_fires and len(nearest_fires) > 0:
            closest_fire = nearest_fires[0]
            distance = closest_fire.get("distance_km", 100)

            if distance < 50 and fdi.get("value", 0) > 70:
                evacuation_priority = "immediate"
                threatened_areas.append({
                    "name": f"Area within {int(distance + 15)} km radius",
                    "distance_km": int(distance + 15),
                    "eta_hours": int((distance + 15) / max(spread_forecast["speed_kmh"], 1)),
                    "priority": "critical"
                })
            elif distance < 100 and fdi.get("value", 0) > 50:
                evacuation_priority = "prepare"
                threatened_areas.append({
                    "name": f"Settlement within {int(distance)} km",
                    "distance_km": int(distance),
                    "eta_hours": int(distance / max(spread_forecast["speed_kmh"], 1)),
                    "priority": "high"
                })

        air_quality_impact = {
            "affected_radius_km": fire_count * 10 if fire_count > 0 else 0,
            "severity": "moderate" if fire_count > 5 else "low"
        }

        return {
            "spread_forecast": spread_forecast,
            "threatened_areas": threatened_areas if threatened_areas else [],
            "evacuation_priority": evacuation_priority,
            "air_quality_impact": air_quality_impact
        }


# Глобальный экземпляр с вашим API ключом
ai_advisor = AIAdvisor(api_key="sk-proj-nVt8SxPLUeuKmVDDIx6TT3BlbkFJLwUst1mfQjpMkYm5rBnQ")
