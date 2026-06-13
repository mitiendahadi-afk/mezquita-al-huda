'use client';

import { type WeatherData, getWeatherIcon } from '@/lib/weather';

interface WeatherWidgetProps {
  weather: WeatherData | null;
}

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather) return null;

  const icon = getWeatherIcon(weather.icon);

  return (
    // dir="ltr" ensures "22°C" doesn't reverse
    <div className="flex items-center gap-3" dir="ltr">
      <span style={{ fontSize: 'clamp(32px, 4vw, 64px)', lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(32px, 3.8vw, 62px)',
          color: '#F4D03F',
          lineHeight: 1,
        }}
      >
        {weather.temp}°C
      </span>
    </div>
  );
}
