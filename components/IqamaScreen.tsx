'use client';

import { useEffect, useState } from 'react';
import { type PrayerEntry } from '@/lib/prayerCalc';

interface IqamaScreenProps {
  entry: PrayerEntry;
}

export default function IqamaScreen({ entry }: IqamaScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #050F0C 0%, #0A2E26 40%, #0D3B2E 100%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(74,222,128,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Large "no phones" symbol — right empty space, mid-screen ── */}
      {/* Absolutely positioned sibling; does NOT affect the centred column */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ right: '10px', top: '50%', transform: 'translateY(-50%)' }}
      >
        <svg
          viewBox="0 0 200 280"
          aria-label="No phones"
          style={{
            width: '350px',
            height: '490px',
            display: 'block',
            // Red glow makes the prohibition symbol pop off the dark green background
            filter: 'drop-shadow(0 0 22px rgba(239,68,68,0.45)) drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
          }}
        >
          {/* ── Phone body: white, high contrast on dark green ── */}
          <rect x="45" y="15" width="110" height="210" rx="14" ry="14"
                fill="white" fillOpacity="0.93" />
          {/* Speaker grille */}
          <rect x="73" y="27" width="54" height="7" rx="3" ry="3" fill="#A8A8A8" />
          {/* Front camera dot */}
          <circle cx="100" cy="36" r="4" fill="#A8A8A8" />
          {/* Screen — dark teal to suggest a display, matching iqama bg palette */}
          <rect x="54" y="46" width="92" height="157" rx="5" ry="5" fill="#112E22" />
          {/* Home button */}
          <circle cx="100" cy="214" r="9" fill="#C0C0C0" />

          {/* ── Prohibition overlay: red circle + slash ── */}
          {/* Very faint red wash inside the ring for emphasis */}
          <circle cx="100" cy="120" r="89" fill="#EF4444" fillOpacity="0.08" />
          {/* Bold red ring — strokeWidth 14 = ~7% of icon width, visible from back row */}
          <circle cx="100" cy="120" r="89"
                  fill="none" stroke="#EF4444" strokeWidth="14" />
          {/* Slash: top-right → bottom-left, endpoints on the circle boundary */}
          {/* (158,57) and (42,183) each sit ~89px from center (100,120) */}
          <line x1="158" y1="57" x2="42" y2="183"
                stroke="#EF4444" strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>

      <div className="text-center relative z-10 max-w-4xl px-8">
        {/* Iqama declaration */}
        <p
          className="font-amiri"
          style={{
            fontSize: 'clamp(40px, 5vw, 80px)',
            color: '#F4D03F',
            direction: 'rtl',
            lineHeight: 1.4,
            textShadow: '0 0 40px rgba(244,208,63,0.3)',
          }}
        >
          قَدْ قَامَتِ الصَّلَاةُ · قَدْ قَامَتِ الصَّلَاةُ
        </p>

        <div
          className="my-6 ornament-line"
          style={{ maxWidth: '600px', margin: '24px auto' }}
        />

        <p
          className="font-inter text-text-secondary mb-4"
          style={{ fontSize: 'clamp(20px, 2.2vw, 32px)' }}
        >
          Se ha establecido la oración · {entry.nameEs}
        </p>

        {/* Straighten rows */}
        <p
          className="font-amiri"
          style={{
            fontSize: 'clamp(28px, 3vw, 48px)',
            color: '#4ADE80',
            direction: 'rtl',
            marginTop: '20px',
          }}
        >
          سَوُّوا صُفُوفَكُمْ
        </p>
        <p
          className="font-amiri text-text-secondary"
          style={{
            fontSize: 'clamp(16px, 1.8vw, 26px)',
            direction: 'rtl',
            marginTop: '8px',
          }}
        >
          "سَوُّوا صُفُوفَكُمْ فَإِنَّ تَسْوِيَةَ الصَّفِّ مِنْ تَمَامِ الصَّلَاةِ"
        </p>

        <div
          className="my-6 ornament-line"
          style={{ maxWidth: '400px', margin: '24px auto' }}
        />

        {/* Phone notice */}
        <div className="flex items-center justify-center gap-6">
          <p
            className="font-cairo text-text-secondary"
            style={{ fontSize: 'clamp(18px, 2vw, 28px)', direction: 'rtl' }}
          >
            📵 يُرجى إغلاق الهواتف
          </p>
          <span className="text-gold-dim">·</span>
          <p
            className="font-inter text-text-secondary"
            style={{ fontSize: 'clamp(16px, 1.8vw, 24px)' }}
          >
            Por favor, silencien los teléfonos
          </p>
        </div>
      </div>
    </div>
  );
}
