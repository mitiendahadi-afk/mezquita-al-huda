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
