'use client';

import { useEffect, useState } from 'react';
import { type PrayerEntry } from '@/lib/prayerCalc';

interface AdhanScreenProps {
  entry: PrayerEntry;
  isFajr: boolean;
}

// Single source of truth for adhan phrases — grouped 2-by-2 at render time.
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

/**
 * Groups a flat array two-by-two into consecutive pairs.
 * [a, b, c, d]  →  [[a, b], [c, d]]
 * Gives 6 pairs for a normal adhan (12 lines) and 7 pairs for Fajr (14 lines).
 */
function toPairs(lines: string[]): [string, string][] {
  const pairs: [string, string][] = [];
  for (let i = 0; i < lines.length; i += 2) {
    pairs.push([lines[i], lines[i + 1] ?? lines[i]]);
  }
  return pairs;
}

export default function AdhanScreen({ entry, isFajr }: AdhanScreenProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Build the full phrase list then collapse into pairs.
  // Fajr inserts FAJR_EXTRA×2 after the two hayya'ala pairs (index 10).
  const allLines = isFajr
    ? [...ADHAN_LINES.slice(0, 10), FAJR_EXTRA, FAJR_EXTRA, ...ADHAN_LINES.slice(10)]
    : ADHAN_LINES;

  // 12 lines → 6 pairs (normal) | 14 lines → 7 pairs (Fajr)
  const pairs = toPairs(allLines);

  return (
    <div
      className="fixed inset-0 z-50 adhan-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // paddingBottom leaves room for the absolute footer without overlap
        padding: '14px 32px 50px',
        boxSizing: 'border-box',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      {/* Background pulse glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)',
          animation: 'adhanPulse 3s ease-in-out infinite',
        }}
      />

      {/* ── Title ───────────────────────────────────────────────────── */}
      <p
        className="font-reem relative z-10"
        style={{
          fontSize: 'clamp(28px, 3.8vw, 56px)',
          color: '#F4D03F',
          fontWeight: 700,
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '0.08em',
          textShadow: '0 0 32px rgba(244,208,63,0.45)',
        }}
      >
        الأذان
      </p>

      {/* ── Prayer identity + time ──────────────────────────────────── */}
      <div className="relative z-10 text-center" style={{ marginTop: '4px' }}>
        <p
          className="font-inter text-text-secondary"
          style={{ fontSize: 'clamp(12px, 1.3vw, 20px)', margin: 0 }}
        >
          Es hora del {entry.nameEs}
        </p>
        <p
          className="font-reem font-bold"
          style={{ fontSize: 'clamp(18px, 2.2vw, 36px)', color: '#F4D03F', margin: '2px 0 0' }}
        >
          ☪ حان وقت صلاة {entry.nameAr} ☪
        </p>
        <p
          className="font-cairo text-text-secondary"
          style={{ fontSize: 'clamp(14px, 1.6vw, 26px)', margin: 0 }}
        >
          {entry.adhanDisplay}
        </p>
      </div>

      {/* ── Logo ────────────────────────────────────────────────────── */}
      <div
        className="relative z-10"
        style={{ margin: '6px 0', animation: 'adhanPulse 4s ease-in-out infinite' }}
      >
        <img
          src="/icons/logo.png"
          alt=""
          style={{
            width: '120px',
            height: '120px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 16px rgba(212,175,55,0.4))',
          }}
        />
      </div>

      {/* ── Adhan pairs ─────────────────────────────────────────────────
          flex:1 fills remaining height after header+logo.
          space-evenly distributes 6–7 rows with equal breathing room.
          overflow:hidden is the hard guarantee: nothing ever bleeds out.
          Font: clamp(22px, 3.2vw, 50px) → 43.7px on the 1366px TV.
            • 7 rows × (43.7px × 1.15 line-height) ≈ 352px
            • Available height ≈ 768 − 14 − 57 − 80 − 132 − 50 ≈ 435px
            • Leaves ~83px spread across 8 space-evenly gaps ✓
          whiteSpace:nowrap keeps each paired row on a single line.
          The longest pair (shahada×2) is ~640px wide at this size — fits
          comfortably within the 1302px content width. ────────────────── */}
      <div
        className="relative z-10"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {pairs.map(([a, b], i) => {
          const isEdge = i === 0 || i === pairs.length - 1;
          return (
            <div
              key={i}
              className="adhan-text font-amiri"
              style={{
                display: 'flex',
                direction: 'rtl',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'clamp(10px, 1.8vw, 32px)',
                // Responsive font: big enough for the muezzin, capped so 7 rows fit
                fontSize: 'clamp(22px, 3.2vw, 50px)',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                color: isEdge ? '#F4D03F' : '#FAF7F0',
              }}
            >
              <span>{a}</span>
              <span
                style={{
                  color: 'rgba(212,175,55,0.45)',
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.7em',
                }}
              >
                ·
              </span>
              <span>{b}</span>
            </div>
          );
        })}
      </div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div
        className="absolute bottom-4 left-0 right-0 text-center"
        style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '10px' }}
      >
        <p className="font-inter text-text-muted" style={{ fontSize: 'clamp(10px, 0.95vw, 15px)' }}>
          Comunidad Islámica Al Huda · Costa Calma, Fuerteventura
        </p>
      </div>
    </div>
  );
}
