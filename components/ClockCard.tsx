'use client';

import { formatCountdown } from '@/lib/formatters';
import { type PrayerEntry } from '@/lib/prayerCalc';

interface ClockCardProps {
  time: string; // HH:MM:SS from page.tsx (Atlantic/Canary TZ)
  nextPrayer: { entry: PrayerEntry; secondsUntil: number } | null;
}

export default function ClockCard({ time, nextPrayer }: ClockCardProps) {
  const parts = time.split(':');
  const hours   = parts[0] ?? '00';
  const minutes = parts[1] ?? '00';
  const seconds = parts[2] ?? '00';
  const blinkOn = parseInt(seconds) % 2 === 0;

  const isUrgent = nextPrayer ? nextPrayer.secondsUntil < 300 : false;
  const countdown = nextPrayer ? formatCountdown(nextPrayer.secondsUntil) : null;

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(45,20,80,0.60) 0%, rgba(30,10,60,0.70) 100%)',
        border: '1.5px solid rgba(212,175,55,0.35)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: 'clamp(16px, 2vh, 32px) clamp(32px, 4vw, 64px)',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      {/* Subtle inner glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* ── Clock ── */}
        <div
          dir="ltr"
          className="flex items-center justify-center"
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(80px, 11vw, 180px)',
            color: '#FFFFFF',
            textShadow: '0 0 40px rgba(255,255,255,0.25), 0 2px 12px rgba(0,0,0,0.6)',
            letterSpacing: '-0.03em',
            lineHeight: 0.9,
            unicodeBidi: 'isolate',
          }}
        >
          <span>{hours}</span>
          <span
            style={{
              opacity: blinkOn ? 0.9 : 0.15,
              transition: 'opacity 0.12s ease',
              margin: '0 4px',
            }}
          >
            :
          </span>
          <span>{minutes}</span>
          {/* Seconds — small, muted */}
          <span
            style={{
              fontSize: 'clamp(20px, 2.2vw, 36px)',
              color: 'rgba(255,255,255,0.45)',
              alignSelf: 'flex-end',
              marginBottom: '10px',
              marginLeft: '6px',
              fontWeight: 700,
            }}
          >
            {seconds}
          </span>
        </div>

        {/* ── Next prayer strip ── */}
        {nextPrayer && (
          <div
            className="flex items-center justify-center flex-wrap gap-3 mt-2"
            style={{ direction: 'rtl' }}
          >
            {/* Prayer name */}
            <span
              style={{
                fontFamily: 'Reem Kufi, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(36px, 4vw, 68px)',
                color: isUrgent ? '#FB923C' : '#F4D03F',
                lineHeight: 1,
                textShadow: isUrgent ? '0 0 20px rgba(251,146,60,0.5)' : 'none',
              }}
            >
              {nextPrayer.entry.nameAr}
            </span>

            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: 'clamp(28px, 3vw, 50px)',
                color: '#C8C2B0',
                lineHeight: 1,
              }}
            >
              بعد
            </span>

            {/* Countdown */}
            <span
              dir="ltr"
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(42px, 4.5vw, 78px)',
                color: isUrgent ? '#FB923C' : '#4ADE80',
                lineHeight: 1,
                letterSpacing: '0.04em',
                unicodeBidi: 'isolate',
                textShadow: isUrgent ? '0 0 20px rgba(251,146,60,0.4)' : '0 0 15px rgba(74,222,128,0.3)',
              }}
            >
              {countdown}
            </span>

            {/* Adhan + Iqama times */}
            <div
              className="flex items-center gap-3"
              dir="ltr"
              style={{ unicodeBidi: 'isolate' }}
            >
              <span
                style={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 3vw, 50px)',
                  color: '#D4AF37',
                  lineHeight: 1,
                }}
              >
                {nextPrayer.entry.adhanDisplay}
              </span>
              {nextPrayer.entry.iqamaDisplay && (
                <>
                  <span style={{ color: '#9C7F25', opacity: 0.6 }}>|</span>
                  <span
                    style={{
                      fontFamily: 'Cairo, sans-serif',
                      fontWeight: 700,
                      fontSize: 'clamp(26px, 2.8vw, 46px)',
                      color: '#4ADE80',
                      lineHeight: 1,
                    }}
                  >
                    {nextPrayer.entry.iqamaDisplay}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
