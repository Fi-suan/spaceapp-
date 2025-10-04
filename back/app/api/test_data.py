from fastapi import APIRouter, HTTPException
from fastapi.responses import HTMLResponse
import httpx
from datetime import datetime
from typing import Dict, Any

router = APIRouter()

# API Configuration
NASA_FIRMS_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"
OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5"
NASA_POWER_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

# TODO: Получить ключи от NASA FIRMS и OpenWeatherMap
# NASA_FIRMS_MAP_KEY = "your_firms_key_here"
# OPENWEATHER_API_KEY = "your_openweather_key_here"


async def fetch_nasa_firms(lat: float = 55.75, lon: float = 37.61, days: int = 1) -> Dict[str, Any]:
    """
    NASA FIRMS - Fire Information for Resource Management System
    Real-time fire detection from MODIS and VIIRS satellites

    Docs: https://firms.modaps.eosdis.nasa.gov/api/
    """
    try:
        # Требуется регистрация для получения MAP_KEY
        # url = f"{NASA_FIRMS_URL}/[MAP_KEY]/VIIRS_SNPP_NRT/{lat},{lon}/{days}"

        return {
            "status": "demo_mode",
            "info": "NASA FIRMS API - требуется MAP_KEY",
            "docs": "https://firms.modaps.eosdis.nasa.gov/api/",
            "description": "Real-time fire detection from MODIS/VIIRS satellites",
            "data_includes": [
                "Fire hotspots coordinates",
                "Brightness temperature",
                "Fire radiative power (FRP)",
                "Confidence levels",
                "Acquisition time"
            ],
            "demo_data": {
                "latitude": lat,
                "longitude": lon,
                "brightness": 325.4,
                "confidence": 85,
                "frp": 12.3,
                "scan": 1.2,
                "track": 1.1,
                "acq_date": datetime.now().strftime("%Y-%m-%d"),
                "acq_time": "1345",
                "satellite": "N",
                "instrument": "VIIRS",
                "version": "2.0NRT"
            }
        }
    except Exception as e:
        return {"error": str(e), "service": "NASA FIRMS"}


async def fetch_openweather(lat: float = 55.75, lon: float = 37.61) -> Dict[str, Any]:
    """
    OpenWeatherMap API - текущая погода и AQI

    Docs: https://openweathermap.org/api
    """
    try:
        # Требуется API KEY
        # url = f"{OPENWEATHER_URL}/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"

        return {
            "status": "demo_mode",
            "info": "OpenWeatherMap API - требуется API_KEY",
            "docs": "https://openweathermap.org/api",
            "description": "Current weather and Air Quality Index",
            "endpoints": [
                "Current Weather Data",
                "Air Pollution API",
                "Historical Weather",
                "Weather Forecast"
            ],
            "demo_data": {
                "weather": {
                    "temp": 22.5,
                    "feels_like": 21.8,
                    "humidity": 65,
                    "pressure": 1013,
                    "wind_speed": 4.5,
                    "wind_deg": 180,
                    "clouds": 40,
                    "visibility": 10000,
                    "weather_main": "Clouds",
                    "weather_description": "scattered clouds"
                },
                "air_quality": {
                    "aqi": 2,
                    "pm2_5": 15.3,
                    "pm10": 22.1,
                    "co": 230.5,
                    "no2": 18.2,
                    "o3": 45.6,
                    "so2": 5.2
                }
            }
        }
    except Exception as e:
        return {"error": str(e), "service": "OpenWeatherMap"}


async def fetch_nasa_power(lat: float = 55.75, lon: float = 37.61) -> Dict[str, Any]:
    """
    NASA POWER API - исторические агрометеорологические данные

    Docs: https://power.larc.nasa.gov/docs/
    """
    try:
        # Не требует ключ, открытый API
        params = {
            "parameters": "T2M,PRECTOTCORR,RH2M,WS2M",  # Temp, Precipitation, Humidity, Wind
            "community": "AG",  # Agriculture
            "longitude": lon,
            "latitude": lat,
            "start": "20240101",
            "end": "20240131",
            "format": "JSON"
        }

        return {
            "status": "ready",
            "info": "NASA POWER API - открытый доступ, ключ не требуется",
            "docs": "https://power.larc.nasa.gov/docs/",
            "description": "Historical agro-meteorological data from NASA satellites",
            "api_url": f"{NASA_POWER_URL}?{params}",
            "parameters_available": {
                "T2M": "Temperature at 2m",
                "PRECTOTCORR": "Precipitation Corrected",
                "RH2M": "Relative Humidity at 2m",
                "WS2M": "Wind Speed at 2m",
                "ALLSKY_SFC_SW_DWN": "Solar Irradiance",
                "T2M_MAX": "Max Temperature",
                "T2M_MIN": "Min Temperature",
                "FROST_DAYS": "Frost Days"
            },
            "demo_data": {
                "location": {"latitude": lat, "longitude": lon},
                "T2M_avg": 18.5,
                "PRECTOTCORR_sum": 42.3,
                "RH2M_avg": 68.2,
                "WS2M_avg": 3.8,
                "frost_risk": "low"
            }
        }
    except Exception as e:
        return {"error": str(e), "service": "NASA POWER"}


async def fetch_copernicus_cams() -> Dict[str, Any]:
    """
    Copernicus Atmosphere Monitoring Service (CAMS)
    Air Quality and atmospheric composition

    Docs: https://atmosphere.copernicus.eu/
    """
    return {
        "status": "info",
        "info": "Copernicus CAMS - требуется регистрация",
        "docs": "https://ads.atmosphere.copernicus.eu/api-how-to",
        "description": "Atmospheric composition and air quality forecasts",
        "data_includes": [
            "PM2.5 and PM10 concentrations",
            "NO2, SO2, O3, CO levels",
            "Aerosol Optical Depth (AOD)",
            "Smoke and dust forecasts",
            "UV index",
            "Pollen forecasts"
        ],
        "api_access": "Requires CDS API key from Copernicus Climate Data Store",
        "demo_data": {
            "pm2_5": 25.3,
            "pm10": 38.7,
            "no2": 22.1,
            "o3": 65.4,
            "aqi_category": "Moderate",
            "smoke_level": "Low",
            "forecast_hours": 96
        }
    }


async def fetch_sentinel_hub() -> Dict[str, Any]:
    """
    Sentinel Hub - Satellite imagery (опционально)

    Docs: https://www.sentinel-hub.com/
    """
    return {
        "status": "info",
        "info": "Sentinel Hub - спутниковые снимки",
        "docs": "https://docs.sentinel-hub.com/api/latest/",
        "description": "Access to Sentinel-2, Landsat, MODIS satellite imagery",
        "use_cases": [
            "Vegetation indices (NDVI, EVI)",
            "Burn area detection",
            "Crop monitoring",
            "Land cover changes",
            "True color imagery"
        ],
        "requires": "OAuth2 authentication",
        "pricing": "Free tier: 5000 processing units/month"
    }


@router.get("/test", response_class=HTMLResponse)
async def test_apis():
    """
    Тестовая страница для проверки всех API интеграций
    """

    # Координаты для тестирования (Москва)
    test_lat = 55.75
    test_lon = 37.61

    # Получаем данные из всех источников
    firms_data = await fetch_nasa_firms(test_lat, test_lon)
    weather_data = await fetch_openweather(test_lat, test_lon)
    power_data = await fetch_nasa_power(test_lat, test_lon)
    cams_data = await fetch_copernicus_cams()
    sentinel_data = await fetch_sentinel_hub()

    html_content = f"""
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Integration Test - SpaceApp</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
                color: #e4e7eb;
                padding: 20px;
                min-height: 100vh;
            }}
            .container {{
                max-width: 1400px;
                margin: 0 auto;
            }}
            h1 {{
                text-align: center;
                margin-bottom: 10px;
                color: #60a5fa;
                font-size: 2.5em;
            }}
            .subtitle {{
                text-align: center;
                color: #94a3b8;
                margin-bottom: 40px;
                font-size: 1.1em;
            }}
            .grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }}
            .card {{
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(71, 85, 105, 0.5);
                border-radius: 12px;
                padding: 24px;
                backdrop-filter: blur(10px);
            }}
            .card h2 {{
                color: #60a5fa;
                margin-bottom: 12px;
                font-size: 1.4em;
                display: flex;
                align-items: center;
                gap: 10px;
            }}
            .status {{
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.75em;
                font-weight: 600;
                text-transform: uppercase;
            }}
            .status.ready {{ background: #10b981; color: white; }}
            .status.demo {{ background: #f59e0b; color: white; }}
            .status.info {{ background: #6366f1; color: white; }}
            .info-box {{
                background: rgba(71, 85, 105, 0.3);
                padding: 12px;
                border-radius: 8px;
                margin: 10px 0;
                border-left: 3px solid #60a5fa;
            }}
            .data-grid {{
                display: grid;
                gap: 8px;
                margin-top: 15px;
            }}
            .data-item {{
                display: flex;
                justify-content: space-between;
                padding: 8px 12px;
                background: rgba(15, 23, 42, 0.5);
                border-radius: 6px;
            }}
            .data-label {{
                color: #94a3b8;
                font-size: 0.9em;
            }}
            .data-value {{
                color: #e4e7eb;
                font-weight: 600;
            }}
            ul {{
                list-style: none;
                padding-left: 0;
            }}
            li {{
                padding: 6px 0;
                color: #cbd5e1;
            }}
            li:before {{
                content: "→ ";
                color: #60a5fa;
                font-weight: bold;
            }}
            .docs-link {{
                color: #60a5fa;
                text-decoration: none;
                font-size: 0.9em;
                display: inline-block;
                margin-top: 10px;
            }}
            .docs-link:hover {{
                text-decoration: underline;
            }}
            .timestamp {{
                text-align: center;
                color: #64748b;
                margin-top: 30px;
                font-size: 0.9em;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛰️ API Integration Test Dashboard</h1>
            <p class="subtitle">NASA Space Apps 2024 | Data Pathways Team</p>

            <div class="grid">
                <!-- NASA FIRMS -->
                <div class="card">
                    <h2>
                        🔥 NASA FIRMS
                        <span class="status {firms_data.get('status', 'demo')}">{firms_data.get('status', 'demo')}</span>
                    </h2>
                    <div class="info-box">
                        <strong>Description:</strong> {firms_data.get('description', 'N/A')}
                    </div>
                    <p><strong>Info:</strong> {firms_data.get('info', 'N/A')}</p>
                    <a href="{firms_data.get('docs', '#')}" class="docs-link" target="_blank">📖 API Documentation</a>

                    {f'''
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Brightness (K)</span>
                            <span class="data-value">{firms_data.get('demo_data', {}).get('brightness', 'N/A')}</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Confidence</span>
                            <span class="data-value">{firms_data.get('demo_data', {}).get('confidence', 'N/A')}%</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Fire Power (MW)</span>
                            <span class="data-value">{firms_data.get('demo_data', {}).get('frp', 'N/A')}</span>
                        </div>
                    </div>
                    ''' if 'demo_data' in firms_data else ''}
                </div>

                <!-- OpenWeatherMap -->
                <div class="card">
                    <h2>
                        🌤️ OpenWeatherMap
                        <span class="status {weather_data.get('status', 'demo')}">{weather_data.get('status', 'demo')}</span>
                    </h2>
                    <div class="info-box">
                        <strong>Description:</strong> {weather_data.get('description', 'N/A')}
                    </div>
                    <p><strong>Info:</strong> {weather_data.get('info', 'N/A')}</p>
                    <a href="{weather_data.get('docs', '#')}" class="docs-link" target="_blank">📖 API Documentation</a>

                    {f'''
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Temperature</span>
                            <span class="data-value">{weather_data.get('demo_data', {}).get('weather', {}).get('temp', 'N/A')}°C</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Humidity</span>
                            <span class="data-value">{weather_data.get('demo_data', {}).get('weather', {}).get('humidity', 'N/A')}%</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Wind Speed</span>
                            <span class="data-value">{weather_data.get('demo_data', {}).get('weather', {}).get('wind_speed', 'N/A')} m/s</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">AQI PM2.5</span>
                            <span class="data-value">{weather_data.get('demo_data', {}).get('air_quality', {}).get('pm2_5', 'N/A')}</span>
                        </div>
                    </div>
                    ''' if 'demo_data' in weather_data else ''}
                </div>

                <!-- NASA POWER -->
                <div class="card">
                    <h2>
                        ⚡ NASA POWER
                        <span class="status {power_data.get('status', 'info')}">{power_data.get('status', 'info')}</span>
                    </h2>
                    <div class="info-box">
                        <strong>Description:</strong> {power_data.get('description', 'N/A')}
                    </div>
                    <p><strong>Info:</strong> {power_data.get('info', 'N/A')}</p>
                    <a href="{power_data.get('docs', '#')}" class="docs-link" target="_blank">📖 API Documentation</a>

                    {f'''
                    <div class="data-grid">
                        <div class="data-item">
                            <span class="data-label">Avg Temperature</span>
                            <span class="data-value">{power_data.get('demo_data', {}).get('T2M_avg', 'N/A')}°C</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Precipitation</span>
                            <span class="data-value">{power_data.get('demo_data', {}).get('PRECTOTCORR_sum', 'N/A')} mm</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Humidity</span>
                            <span class="data-value">{power_data.get('demo_data', {}).get('RH2M_avg', 'N/A')}%</span>
                        </div>
                        <div class="data-item">
                            <span class="data-label">Frost Risk</span>
                            <span class="data-value">{power_data.get('demo_data', {}).get('frost_risk', 'N/A')}</span>
                        </div>
                    </div>
                    ''' if 'demo_data' in power_data else ''}
                </div>

                <!-- Copernicus CAMS -->
                <div class="card">
                    <h2>
                        🌍 Copernicus CAMS
                        <span class="status {cams_data.get('status', 'info')}">{cams_data.get('status', 'info')}</span>
                    </h2>
                    <div class="info-box">
                        <strong>Description:</strong> {cams_data.get('description', 'N/A')}
                    </div>
                    <p><strong>Info:</strong> {cams_data.get('info', 'N/A')}</p>
                    <a href="{cams_data.get('docs', '#')}" class="docs-link" target="_blank">📖 API Documentation</a>

                    <p style="margin-top: 15px;"><strong>Data includes:</strong></p>
                    <ul>
                        {' '.join([f'<li>{item}</li>' for item in cams_data.get('data_includes', [])])}
                    </ul>
                </div>

                <!-- Sentinel Hub -->
                <div class="card">
                    <h2>
                        🛰️ Sentinel Hub
                        <span class="status {sentinel_data.get('status', 'info')}">{sentinel_data.get('status', 'info')}</span>
                    </h2>
                    <div class="info-box">
                        <strong>Description:</strong> {sentinel_data.get('description', 'N/A')}
                    </div>
                    <p><strong>Info:</strong> {sentinel_data.get('info', 'N/A')}</p>
                    <a href="{sentinel_data.get('docs', '#')}" class="docs-link" target="_blank">📖 API Documentation</a>

                    <p style="margin-top: 15px;"><strong>Use Cases:</strong></p>
                    <ul>
                        {' '.join([f'<li>{item}</li>' for item in sentinel_data.get('use_cases', [])])}
                    </ul>
                </div>
            </div>

            <div class="timestamp">
                🕐 Generated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Test Location: Moscow (55.75°N, 37.61°E)
            </div>
        </div>
    </body>
    </html>
    """

    return html_content


@router.get("/test/json")
async def test_apis_json():
    """
    JSON версия тестовых данных для API интеграций
    """
    test_lat = 55.75
    test_lon = 37.61

    return {
        "timestamp": datetime.now().isoformat(),
        "test_location": {
            "latitude": test_lat,
            "longitude": test_lon,
            "name": "Moscow, Russia"
        },
        "apis": {
            "nasa_firms": await fetch_nasa_firms(test_lat, test_lon),
            "openweather": await fetch_openweather(test_lat, test_lon),
            "nasa_power": await fetch_nasa_power(test_lat, test_lon),
            "copernicus_cams": await fetch_copernicus_cams(),
            "sentinel_hub": await fetch_sentinel_hub()
        }
    }
