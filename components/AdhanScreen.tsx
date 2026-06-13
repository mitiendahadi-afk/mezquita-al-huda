'use client';

import { useEffect, useState } from 'react';
import { type PrayerEntry } from '@/lib/prayerCalc';

interface AdhanScreenProps {
  entry: PrayerEntry;
  isFajr: boolean;
}

const ADHAN_LINES = [
  'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ',
  'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ',
  'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ',
  'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ',
  'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
  'أَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ',
  'حَيَّ عَلَى الصَّلَاةِ',
  'حَيَّ عَلَى الصَّلَاةِ',
  'حَيَّ عَلَى الْفَلَاحِ',
  'حَيَّ عَلَى الْفَلَاحِ',
  'اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ',
  'لَا إِلَهَ إِلَّا اللَّهُ',
];

const FAJR_EXTRA = 'الصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ';

export default function AdhanScreen({ entry, isFajr }: AdhanScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const lines = isFajr
    ? [...ADHAN_LINES.slice(0, 10), FAJR_EXTRA, FAJR_EXTRA, ...ADHAN_LINES.slice(10)]
    : ADHAN_LINES;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center adhan-screen"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
          animation: 'adhanPulse 3s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <p
          className="font-inter text-text-secondary mb-1"
          style={{ fontSize: 'clamp(16px, 1.8vw, 26px)' }}
        >
          Es hora del {entry.nameEs}
        </p>
        <p
          className="font-reem font-bold"
          style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', color: '#F4D03F' }}
        >
          ☪ حان وقت صلاة {entry.nameAr} ☪
        </p>
        <p
          className="font-cairo text-text-secondary mt-1"
          style={{ fontSize: 'clamp(20px, 2.5vw, 36px)' }}
        >
          {entry.adhanDisplay}
        </p>
      </div>

      {/* Logo */}
      <div className="my-4 relative z-10" style={{ animation: 'adhanPulse 4s ease-in-out infinite' }}>
        <img
          src="/icons/logo.png"
          alt=""
          style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(212,175,55,0.4))' }}
        />
      </div>

      {/* Adhan text */}
      <div className="text-center relative z-10 max-w-3xl">
        {lines.map((line, i) => (
          <p
            key={i}
            className="adhan-text font-amiri"
            style={{
              fontSize: 'clamp(22px, 2.8vw, 42px)',
              marginBottom: '4px',
              color: i === 0 || i === 1 || i === lines.length - 2 || i === lines.length - 1
                ? '#F4D03F'
                : '#FAF7F0',
            }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Bottom decoration */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center"
        style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '12px' }}
      >
        <p className="font-inter text-text-muted" style={{ fontSize: 'clamp(12px, 1.2vw, 18px)' }}>
          Comunidad Islámica Al Huda · Costa Calma, Fuerteventura
        </p>
      </div>
    </div>
  );
}
