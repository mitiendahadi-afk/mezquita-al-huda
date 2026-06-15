'use client';

import { memo } from 'react';
import WeatherWidget from './WeatherWidget';

function HeaderBar() {
  return (
    <header
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderBottom: '1px solid rgba(212,175,55,0.2)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.40) 0%, transparent 100%)',
      }}
    >
      {/* Weather — absolute left */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '3rem',
          zIndex: 20,
        }}
      >
        <WeatherWidget />
      </div>

      {/* Official logo — absolute top-right, large */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '2rem',
          transform: 'translateY(-50%)',
          zIndex: 1,
        }}
      >
        <img
          src="/icons/logo.png"
          alt="Comunidad Islámica Al Huda"
          style={{
            width: 'clamp(110px, 11vw, 175px)',
            height: 'clamp(110px, 11vw, 175px)',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))',
          }}
        />
      </div>

      {/* Mosque name — centered with side padding to clear logo + weather */}
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft:  'clamp(160px, 14vw, 230px)',
          paddingRight: 'clamp(160px, 14vw, 230px)',
          gap: '0.2rem',
        }}
      >
        <h1
          style={{
            fontFamily: 'Reem Kufi, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(40px, 4.8vw, 94px)',
            color: '#FFFFFF',
            textShadow: '0 4px 20px rgba(0,0,0,0.7)',
            lineHeight: 1,
            margin: 0,
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}
        >
          الرابطة الإسلامية الهدى
        </h1>

        <h2
          style={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: 'clamp(18px, 2vw, 38px)',
            color: '#F4D03F',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
            letterSpacing: '0.02em',
            lineHeight: 1,
            direction: 'ltr',
            margin: 0,
            marginTop: '1.2rem',
            textAlign: 'center',
          }}
        >
          Comunidad Islámica Al Huda · Costa Calma · Fuerteventura
        </h2>
      </div>
    </header>
  );
}

export default memo(HeaderBar);
