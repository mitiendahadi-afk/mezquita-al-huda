'use client';
import { useEffect, useState } from 'react';
import { recordWeatherUpdate } from '@/lib/diagnostics';

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

const LAT = 28.1597;
const LON = -14.2289;
const CACHE_KEY = 'alhuda_weather_v1';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const FETCH_INTERVAL = 60 * 60 * 1000; // refetch every 60 min

function loadCached(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: WeatherData; ts: number };
    if (Date.now() - ts < CACHE_TTL) return data;
  } catch {}
  return null;
}

function saveCache(data: WeatherData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(() => loadCached());

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!key) return;

    let aborted = false;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${key}&units=metric&lang=es`,
          { cache: 'no-store' }
        );
        if (!res.ok || aborted) return;
        const d = await res.json();
        const data: WeatherData = {
          temp: Math.round(d.main.temp),
          description: d.weather[0].description,
          icon: d.weather[0].icon,
        };
        if (!aborted) {
          saveCache(data);
          setWeather(data);
          recordWeatherUpdate();
        }
      } catch {
        // non-critical — keep showing cached data
      }
    };

    fetchWeather();
    const id = setInterval(fetchWeather, FETCH_INTERVAL);

    return () => {
      aborted = true;
      clearInterval(id);
    };
  }, []);

  if (!weather) return null;

  return (
    // No backdropFilter — solid bg avoids GPU compositing on Android TV
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.4rem 0.9rem',
        background: 'rgba(8,35,28,0.92)',
        borderRadius: '0.75rem',
        border: '1px solid rgba(212,175,55,0.25)',
        minWidth: '80px',
      }}
    >
      <div style={{ fontSize: 'clamp(24px, 2.8vw, 46px)', lineHeight: 1, marginBottom: '0.15rem' }}>
        {ICONS[weather.icon] ?? '🌤️'}
      </div>
      <div
        dir="ltr"
        style={{
          fontSize: 'clamp(20px, 2vw, 38px)',
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
          fontSize: 'clamp(10px, 0.85vw, 14px)',
          color: '#F4D03F',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          textTransform: 'capitalize',
          marginTop: '0.15rem',
          textAlign: 'center',
          maxWidth: '90px',
          lineHeight: 1.1,
        }}
      >
        {weather.description}
      </div>
    </div>
  );
}
