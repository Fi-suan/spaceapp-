import asyncio
from app.services.ai_advisor import ai_advisor

async def test():
    weather_data = {
        "current_temperature": 15.5,
        "frost_risk": {"percentage": 65, "status": "High"},
        "aqi_impact": {"pm2_5": 35.2, "status": "Moderate"},
        "humidity": 72.0,
        "precipitation": 2.5,
        "wind_speed": 4.8,
        "forecast_7day": [
            {"date": "Mon, Oct 05", "tempMin": 12.0, "tempMax": 18.0, "precipitation": 1.5},
            {"date": "Tue, Oct 06", "tempMin": 10.0, "tempMax": 16.0, "precipitation": 0.0}
        ]
    }

    print("Testing AI Advisor with real weather data...")
    result = await ai_advisor.generate_agriculture_insights(weather_data)

    print("\n=== AI RECOMMENDATIONS ===")
    for i, rec in enumerate(result.get("recommendations", []), 1):
        print(f"{i}. {rec}")

    print("\n=== RISK ALERTS ===")
    for alert in result.get("risk_alerts", []):
        print(f"[{alert['level'].upper()}] {alert['message']}")

asyncio.run(test())
