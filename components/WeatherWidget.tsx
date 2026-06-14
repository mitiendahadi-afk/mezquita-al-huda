'use client';
import { useEffect, useState } from 'react';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

const ICONS: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

// Costa Calma, Fuerteventura
const LAT = 28.1597;
const LON = -14.2289;

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const key = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!key) return;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${key}&units=metric&lang=es`
        );
        if (!res.ok) return;
        const d = await res.json();
        setWeather({
          temp: Math.round(d.main.temp),
          description: d.weather[0].description,
          icon: d.weather[0].icon,
        });
      } catch {
        // silently fail — weather is non-critical
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!weather) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
        background: 'rgba(10,46,38,0.55)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        border: '1px solid rgba(212,175,55,0.30)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        minWidth: '90px',
      }}
    >
      <div style={{ fontSize: 'clamp(28px, 3vw, 52px)', lineHeight: 1, marginBottom: '0.2rem' }}>
        {ICONS[weather.icon] ?? '🌤️'}
      </div>
      <div
        dir="ltr"
        style={{
          fontSize: 'clamp(22px, 2.2vw, 42px)',
          color: '#FFFFFF',
          fontWeight: 900,
          fontFamily: 'Cairo, sans-serif',
          lineHeight: 1,
          unicodeBidi: 'isolate',
        }}
      >
        {weather.temp}°C
      </div>
      <div
        style={{
          fontSize: 'clamp(10px, 0.9vw, 16px)',
          color: '#F4D03F',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          textTransform: 'capitalize',
          marginTop: '0.2rem',
          textAlign: 'center',
          maxWidth: '100px',
          lineHeight: 1.1,
        }}
      >
        {weather.description}
      </div>
    </div>
  );
}
