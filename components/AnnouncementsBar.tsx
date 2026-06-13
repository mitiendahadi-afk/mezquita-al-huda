'use client';

import { useState, useEffect } from 'react';
import { type Announcement } from '@/lib/iqamaSettings';

interface AnnouncementsBarProps {
  announcements: Announcement[];
}

export default function AnnouncementsBar({ announcements }: AnnouncementsBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const active = announcements.filter(a => a.active);

  useEffect(() => {
    if (active.length === 0) return;
    const duration = (active[currentIndex]?.duration || 10) * 1000;
    const timer = setTimeout(() => {
      setCurrentIndex(i => (i + 1) % active.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentIndex, active]);

  if (active.length === 0) return null;

  const current = active[currentIndex];

  return (
    <div
      className="flex items-center justify-center gap-4 px-6 py-1.5"
      style={{
        background: 'rgba(212,175,55,0.1)',
        borderTop: '1px solid rgba(212,175,55,0.3)',
        height: '100%',
      }}
    >
      <span
        style={{
          fontSize: 'clamp(16px, 1.6vw, 26px)',
          color: '#D4AF37',
          fontFamily: 'Cairo',
          background: 'rgba(212,175,55,0.15)',
          padding: '4px 12px',
          borderRadius: '8px',
          border: '1px solid rgba(212,175,55,0.4)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        📢 إعلان
      </span>
      <span
        style={{
          fontSize: 'clamp(24px, 2.6vw, 42px)',
          color: '#FAF7F0',
          fontFamily: 'Cairo',
          fontWeight: 600,
          direction: 'rtl',
        }}
      >
        {current.ar}
      </span>
      {current.es && (
        <>
          <span style={{ color: '#9C7F25', flexShrink: 0 }}>·</span>
          <span
            style={{
              fontSize: 'clamp(20px, 2.2vw, 36px)',
              color: '#C8C2B0',
              fontFamily: 'Inter',
              flexShrink: 0,
            }}
          >
            {current.es}
          </span>
        </>
      )}
    </div>
  );
}
