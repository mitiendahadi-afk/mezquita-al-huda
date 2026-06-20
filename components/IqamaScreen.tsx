'use client';

import { useEffect, useState } from 'react';
import { type PrayerEntry } from '@/lib/prayerCalc';

interface IqamaScreenProps {
  entry: PrayerEntry;
}

/* ── "No phones" symbol ──────────────────────────────────────────────
   Clean white smartphone + red prohibition ring & diagonal slash.
   Pure inline SVG (no image file, no network). Sized MODERATELY
   (~230px tall on the 1366×768 TV) so it sits in the side margin and
   never overlaps the centred text column. Mirrored on the right side
   for a symmetrical composition. */
function NoPhoneSymbol({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 280"
      aria-label="No phones"
      style={{
        width: 'auto',
        height: 'clamp(200px, 30vh, 235px)',
        display: 'block',
        transform: mirrored ? 'scaleX(-1)' : 'none',
        // Red glow lifts the prohibition symbol off the dark green background
        filter: 'drop-shadow(0 0 18px rgba(239,68,68,0.40)) drop-shadow(0 4px 10px rgba(0,0,0,0.55))',
      }}
    >
      {/* ── Phone body: white, high contrast on dark green ── */}
      <rect x="45" y="15" width="110" height="210" rx="14" ry="14" fill="white" fillOpacity="0.93" />
      {/* Speaker grille */}
      <rect x="73" y="27" width="54" height="7" rx="3" ry="3" fill="#A8A8A8" />
      {/* Front camera dot */}
      <circle cx="100" cy="36" r="4" fill="#A8A8A8" />
      {/* Screen — dark teal, matching the iqama background palette */}
      <rect x="54" y="46" width="92" height="157" rx="5" ry="5" fill="#112E22" />
      {/* Home button */}
      <circle cx="100" cy="214" r="9" fill="#C0C0C0" />

      {/* ── Prohibition overlay: red circle + slash ── */}
      {/* Faint red wash inside the ring for emphasis */}
      <circle cx="100" cy="120" r="89" fill="#EF4444" fillOpacity="0.08" />
      {/* Bold red ring */}
      <circle cx="100" cy="120" r="89" fill="none" stroke="#EF4444" strokeWidth="14" />
      {/* Slash: endpoints sit ~89px from centre (100,120), on the ring */}
      <line x1="158" y1="57" x2="42" y2="183" stroke="#EF4444" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

/* ── Small gold ornamental flower / divider for the very bottom ── */
function GoldFlourish() {
  return (
    <svg
      viewBox="0 0 200 40"
      aria-hidden="true"
      style={{ width: 'clamp(160px, 18vw, 230px)', height: 'auto', display: 'block', margin: '0 auto' }}
    >
      {/* Side lines tapering to the centre flower */}
      <g stroke="#D4AF37" strokeWidth="1.4" fill="none" opacity="0.85">
        <line x1="12" y1="20" x2="78" y2="20" />
        <line x1="122" y1="20" x2="188" y2="20" />
      </g>
      {/* Four-petal flower */}
      <g fill="#D4AF37">
        <path d="M100 6 C105 13 105 13 100 20 C95 13 95 13 100 6 Z" />
        <path d="M100 34 C105 27 105 27 100 20 C95 27 95 27 100 34 Z" />
        <path d="M86 20 C93 15 93 15 100 20 C93 25 93 25 86 20 Z" />
        <path d="M114 20 C107 15 107 15 100 20 C107 25 107 25 114 20 Z" />
        <circle cx="100" cy="20" r="2.6" fill="#F4D03F" />
        <circle cx="82" cy="20" r="2.3" />
        <circle cx="118" cy="20" r="2.3" />
      </g>
    </svg>
  );
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

      {/* ── Two symmetric "no phones" symbols in the side margins ──
          Absolutely positioned, vertically centred, pointer-events off.
          They live in the empty left/right space and never reach under
          the centred text column. */}
      <div
        className="absolute z-10 pointer-events-none"
        style={{ left: 'clamp(20px, 4vw, 56px)', top: '50%', transform: 'translateY(-50%)' }}
      >
        <NoPhoneSymbol />
      </div>
      <div
        className="absolute z-10 pointer-events-none"
        style={{ right: 'clamp(20px, 4vw, 56px)', top: '50%', transform: 'translateY(-50%)' }}
      >
        <NoPhoneSymbol mirrored />
      </div>

      {/* ── Centred text column ──
          Constrained width keeps every line clear of the side symbols on
          the 1366×768 TV (column ≤ 800px ⇒ ~283px free on each side, the
          symbols are only ~165px wide ⇒ comfortable margin). */}
      <div
        className="text-center relative z-20"
        style={{ width: 'min(800px, 62vw)', padding: '0 8px' }}
      >
        {/* Main title — gold, prominent */}
        <p
          className="font-amiri"
          style={{
            fontSize: 'clamp(34px, 4.2vw, 58px)',
            color: '#D4AF37',
            direction: 'rtl',
            lineHeight: 1.3,
            textShadow: '0 0 40px rgba(212,175,55,0.35)',
          }}
        >
          قَدْ قَامَتِ الصَّلَاةُ · قَدْ قَامَتِ الصَّلَاةُ
        </p>

        {/* Thin gold ornamental divider */}
        <div className="ornament-line" style={{ maxWidth: '520px', margin: '20px auto' }} />

        {/* Spanish line + prayer name — light */}
        <p
          className="font-inter text-text-secondary"
          style={{ fontSize: 'clamp(18px, 2vw, 30px)', color: '#E8E3D5' }}
        >
          Se ha establecido la oración · {entry.nameEs}
        </p>

        {/* "Straighten your rows" — green */}
        <p
          className="font-amiri"
          style={{
            fontSize: 'clamp(28px, 3vw, 46px)',
            color: '#4ADE80',
            direction: 'rtl',
            marginTop: '22px',
            textShadow: '0 0 30px rgba(74,222,128,0.25)',
          }}
        >
          سَوُّوا صُفُوفَكُمْ
        </p>

        {/* Hadith — smaller, muted (text kept exactly as before) */}
        <p
          className="font-amiri text-text-secondary"
          style={{ fontSize: 'clamp(16px, 1.8vw, 25px)', direction: 'rtl', marginTop: '8px' }}
        >
          "سَوُّوا صُفُوفَكُمْ فَإِنَّ تَسْوِيَةَ الصَّفِّ مِنْ تَمَامِ الصَّلَاةِ"
        </p>

        {/* Phone notice — Arabic · Spanish */}
        <div
          className="flex items-center justify-center gap-5"
          style={{ marginTop: '24px' }}
        >
          <p
            className="font-cairo text-text-secondary"
            style={{ fontSize: 'clamp(17px, 1.9vw, 26px)', direction: 'rtl' }}
          >
            يُرجى إغلاق الهواتف
          </p>
          <span className="text-gold-dim">·</span>
          <p
            className="font-inter text-text-secondary"
            style={{ fontSize: 'clamp(15px, 1.7vw, 23px)' }}
          >
            Por favor, silencien los teléfonos
          </p>
        </div>

        {/* Bottom gold ornamental flower */}
        <div style={{ marginTop: '22px' }}>
          <GoldFlourish />
        </div>
      </div>
    </div>
  );
}
