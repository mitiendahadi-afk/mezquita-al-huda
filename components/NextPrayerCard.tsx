'use client';

import { type PrayerEntry } from '@/lib/prayerCalc';

interface NextPrayerCardProps {
  entry: PrayerEntry;
  secondsUntil: number;
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function NextPrayerCard({ entry, secondsUntil }: NextPrayerCardProps) {
  const countdown = formatCountdown(secondsUntil);
  const isUrgent = secondsUntil < 300;

  return (
    <div
      className="mx-4 rounded-2xl px-6 py-3 relative overflow-hidden gold-pulse prayer-card-active"
      style={{
        background: 'linear-gradient(135deg, rgba(26,85,70,0.95) 0%, rgba(16,61,50,0.98) 100%)',
        width: 'calc(100% - 32px)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 flex items-center justify-between w-full gap-4">
        {/* Left: label + prayer name */}
        <div className="flex flex-col items-start" style={{ direction: 'rtl' }}>
          <span
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontSize: 'clamp(14px, 1.5vw, 22px)',
              color: '#8B8676',
            }}
          >
            الصلاة القادمة · Próxima oración
          </span>
          <span
            style={{
              fontFamily: 'Reem Kufi, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(52px, 5.5vw, 90px)',
              color: isUrgent ? '#FB923C' : '#F4D03F',
              lineHeight: 1,
              textShadow: isUrgent ? '0 0 20px rgba(251,146,60,0.4)' : '0 0 20px rgba(244,208,63,0.3)',
            }}
          >
            {entry.nameAr}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(22px, 2.4vw, 38px)',
              color: '#C8C2B0',
            }}
          >
            {entry.nameEs}
          </span>
        </div>

        {/* Center: countdown */}
        <div
          className="flex flex-col items-center flex-shrink-0"
          dir="ltr"
          style={{ unicodeBidi: 'isolate' }}
        >
          <span
            style={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(64px, 7.5vw, 128px)',
              color: isUrgent ? '#FB923C' : '#FAF7F0',
              letterSpacing: '0.05em',
              lineHeight: 1,
              textShadow: isUrgent ? '0 0 30px rgba(251,146,60,0.5)' : 'none',
            }}
          >
            {countdown}
          </span>
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(12px, 1.2vw, 18px)',
              color: '#8B8676',
              marginTop: '2px',
            }}
          >
            متبقي · Tiempo restante
          </span>
        </div>

        {/* Right: adhan + iqama times */}
        <div
          className="flex flex-col items-end gap-1"
          dir="ltr"
          style={{ unicodeBidi: 'isolate' }}
        >
          <div className="flex flex-col items-end">
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(34px, 3.5vw, 58px)',
                color: '#D4AF37',
                lineHeight: 1,
              }}
            >
              {entry.adhanDisplay}
            </span>
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: 'clamp(13px, 1.3vw, 20px)',
                color: '#8B8676',
              }}
            >
              الأذان · Adhan
            </span>
          </div>
          {entry.iqamaDisplay && (
            <div className="flex flex-col items-end" style={{ marginTop: '4px' }}>
              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(30px, 3vw, 50px)',
                  color: '#4ADE80',
                  lineHeight: 1,
                }}
              >
                {entry.iqamaDisplay}
              </span>
              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: 'clamp(13px, 1.3vw, 20px)',
                  color: '#8B8676',
                }}
              >
                الإقامة · Iqama
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
