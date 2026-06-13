'use client';

import { useState, useEffect, useRef } from 'react';
import { buildZikrPlaylist, getZikrText, type ZikrItem } from '@/lib/azkar';

export default function ZikrMarquee() {
  const [playlist, setPlaylist] = useState<ZikrItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPlaylist(buildZikrPlaylist());
  }, []);

  useEffect(() => {
    if (playlist.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex(i => (i + 1) % playlist.length);
    }, 20000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playlist.length]);

  if (playlist.length === 0) return null;

  const current = playlist[currentIndex];
  const { ar, ref } = getZikrText(current);
  // Only the Arabic part (before " · ") to avoid bidi issues with mixed script
  const refAr = ref?.split(' · ')[0];

  const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    aya:    { icon: '📖', label: 'قرآن كريم', color: '#D4AF37' },
    hadith: { icon: '📜', label: 'حديث شريف', color: '#C8C2B0' },
    zikr:   { icon: '✨', label: 'ذكر',       color: '#4ADE80' },
    dua:    { icon: '🤲', label: 'دعاء',       color: '#60A5FA' },
  };

  const tc = TYPE_CONFIG[current.type] || TYPE_CONFIG.zikr;

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, rgba(10,46,38,0.60) 0%, rgba(10,46,38,0.88) 100%)',
        borderTop: '1px solid rgba(212,175,55,0.30)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '1.2rem 3rem',
        minHeight: '110px',
        height: '100%',
      }}
    >
      {/* Type label */}
      <p
        style={{
          fontSize: 'clamp(16px, 1.4vw, 26px)',
          color: tc.color,
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          marginBottom: '0.35rem',
          letterSpacing: '0.03em',
        }}
      >
        {tc.icon} {tc.label}
      </p>

      {/* Main Arabic text */}
      <p
        style={{
          fontFamily: current.type === 'aya' ? 'Amiri, serif' : 'Cairo, sans-serif',
          fontSize: 'clamp(24px, 2.4vw, 48px)',
          color: '#FAF7F0',
          lineHeight: 1.5,
          margin: 0,
          maxWidth: '90%',
        }}
      >
        {ar}
      </p>

      {/* Reference — Arabic only, explicit RTL to fix bracket direction */}
      {refAr && (
        <p
          dir="rtl"
          style={{
            fontSize: 'clamp(15px, 1.3vw, 24px)',
            color: '#D4AF37',
            fontFamily: 'Reem Kufi, sans-serif',
            opacity: 0.85,
            marginTop: '0.4rem',
            textAlign: 'center',
            unicodeBidi: 'isolate',
          }}
        >
          ﴿ {refAr} ﴾
        </p>
      )}
    </div>
  );
}
