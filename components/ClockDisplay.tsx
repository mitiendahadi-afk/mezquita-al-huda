'use client';

interface ClockDisplayProps {
  time: string;
}

export default function ClockDisplay({ time }: ClockDisplayProps) {
  const [hours, minutes, seconds] = time.split(':');
  const blinkOn = parseInt(seconds) % 2 === 0;

  return (
    // dir="ltr" is critical: prevents RTL from reversing HH:MM order
    <div
      className="flex items-center justify-center"
      dir="ltr"
      style={{ unicodeBidi: 'isolate', lineHeight: 1 }}
    >
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(140px, 20vw, 280px)',
          color: '#F4D03F',
          textShadow: '0 0 60px rgba(244, 208, 63, 0.5)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {hours}
      </span>
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(120px, 17vw, 240px)',
          color: '#F4D03F',
          opacity: blinkOn ? 1 : 0.2,
          transition: 'opacity 0.15s ease',
          lineHeight: 1,
          margin: '0 4px',
        }}
      >
        :
      </span>
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(140px, 20vw, 280px)',
          color: '#F4D03F',
          textShadow: '0 0 60px rgba(244, 208, 63, 0.5)',
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        {minutes}
      </span>
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(36px, 4vw, 64px)',
          color: '#9C7F25',
          alignSelf: 'flex-end',
          marginBottom: '12px',
          marginRight: '8px',
          lineHeight: 1,
        }}
      >
        {seconds}
      </span>
    </div>
  );
}
