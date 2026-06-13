'use client';

interface PrayerCardProps {
  nameAr: string;
  nameEs: string;
  adhanTime: string;
  iqamaTime?: string | null;
  isNext: boolean;
}

export default function PrayerCard({ nameAr, nameEs, adhanTime, iqamaTime, isNext }: PrayerCardProps) {
  return (
    <div
      style={{
        background: isNext
          ? 'linear-gradient(135deg, rgba(244,208,63,0.30), rgba(212,175,55,0.20))'
          : 'rgba(10,46,38,0.55)',
        border: isNext ? '2px solid #F4D03F' : '1px solid rgba(212,175,55,0.30)',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: isNext ? '0 0 30px rgba(244,208,63,0.4)' : '0 4px 15px rgba(0,0,0,0.2)',
        animation: isNext ? 'goldPulse 3s ease-in-out infinite' : 'none',
        aspectRatio: '1 / 1.1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0.5rem 0.3rem',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Arabic prayer name */}
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

      {/* Adhan time */}
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
          textShadow: isNext ? '0 0 16px rgba(255,255,255,0.3)' : 'none',
        }}
      >
        {adhanTime}
      </p>

      {/* Iqama time */}
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

      {/* Spanish name */}
      <p
        style={{
          fontSize: 'clamp(12px, 1vw, 20px)',
          color: '#F4D03F',
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
