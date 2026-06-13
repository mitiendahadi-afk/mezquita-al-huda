'use client';

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  lastUpdated: number;
}

const CACHE_KEY = 'weather_cache';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function fetchWeather(apiKey: string): Promise<WeatherData | null> {
  if (!apiKey) return null;

  // Check cache first
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const data: WeatherData = JSON.parse(cached);
        if (Date.now() - data.lastUpdated < CACHE_TTL) {
          return data;
        }
      }
    } catch {}
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=28.1597&lon=-14.2289&units=metric&appid=${apiKey}&lang=es`,
    );
    if (!res.ok) return null;
    const json = await res.json();

    const data: WeatherData = {
      temp: Math.round(json.main.temp),
      description: json.weather[0].description,
      icon: json.weather[0].icon,
      humidity: json.main.humidity,
      windSpeed: Math.round(json.wind.speed * 3.6),
      feelsLike: Math.round(json.main.feels_like),
      lastUpdated: Date.now(),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }

    return data;
  } catch {
    return null;
  }
}

export function getWeatherIcon(iconCode: string): string {
  const map: Record<string, string> = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '🌤️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️',
  };
  return map[iconCode] || '🌡️';
}
