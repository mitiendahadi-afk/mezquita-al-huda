'use client';

import { memo } from 'react';
import { type DateInfo } from '@/lib/hijri';

interface DateDisplayProps {
  dateInfo: DateInfo;
}

function DateDisplay({ dateInfo }: DateDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-6 flex-wrap px-4" style={{ direction: 'rtl' }}>
      {/* Arabic date */}
      <span
        style={{
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: 'clamp(22px, 2.6vw, 42px)',
          color: '#FAF7F0',
        }}
      >
        {dateInfo.dateAr}
      </span>

      {/* Separator */}
      <span style={{ color: '#9C7F25', fontSize: 'clamp(20px, 2.4vw, 38px)' }}>·</span>

      {/* Hijri date */}
      <span
        style={{
          fontFamily: 'Reem Kufi, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(20px, 2.4vw, 38px)',
          color: '#D4AF37',
        }}
      >
        ☪ {dateInfo.hijriAr}
      </span>

      {/* Separator */}
      <span style={{ color: '#9C7F25', fontSize: 'clamp(20px, 2.4vw, 38px)' }}>·</span>

      {/* Spanish date */}
      <span
        style={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 'clamp(20px, 2.3vw, 38px)',
          color: '#C8C2B0',
          direction: 'ltr',
        }}
      >
        {dateInfo.dateEs}
      </span>
    </div>
  );
}

export default memo(DateDisplay);
