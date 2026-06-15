'use client';
import { memo } from 'react';

interface PrayerCardProps {
  nameAr: string;
  nameEs: string;
  adhanTime: string;
  iqamaTime?: string | null;
  isNext: boolean;
}

function PrayerCard({ nameAr, nameEs, adhanTime, iqamaTime, isNext }: PrayerCardProps) {
  return (
    // No backdropFilter, no infinite animation — both are GPU-intensive on Android TV
    <div
      style={{
        background: isNext
          ? 'rgba(90,70,10,0.88)'
          : 'rgba(8,35,28,0.88)',
        border: isNext ? '2px solid #F4D03F' : '1px solid rgba(212,175,55,0.28)',
        borderRadius: '1rem',
        boxShadow: isNext ? '0 0 20px rgba(244,208,63,0.35)' : '0 2px 8px rgba(0,0,0,0.30)',
        aspectRatio: '1 / 1.1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.5rem 0.3rem',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(14px, 1.3vw, 24px)',
          color: '#F4D03F',
          fontFamily: 'Reem Kufi, sans-serif',
          fontWeight: 700,
          lineHeight: 1.1,
          margin: 0,
        }}
      >
        {nameAr}
      </p>

      <p
        dir="ltr"
        style={{
          fontSize: 'clamp(22px, 2.2vw, 44px)',
          color: '#FFFFFF',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 900,
          lineHeight: 1,
          margin: '0.3rem 0',
          unicodeBidi: 'isolate',
        }}
      >
        {adhanTime}
      </p>

      {iqamaTime ? (
        <p
          dir="ltr"
          style={{
            fontSize: 'clamp(11px, 0.9vw, 18px)',
            color: '#4ADE80',
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            margin: '0.15rem 0',
            unicodeBidi: 'isolate',
          }}
        >
          {iqamaTime}
        </p>
      ) : (
        <p style={{ fontSize: 'clamp(11px, 0.9vw, 18px)', opacity: 0, margin: '0.15rem 0' }}>—</p>
      )}

      <p
        style={{
          fontSize: 'clamp(12px, 1vw, 20px)',
          color: isNext ? '#F4D03F' : '#C8C2B0',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {nameEs}
      </p>
    </div>
  );
}

export default memo(PrayerCard);
