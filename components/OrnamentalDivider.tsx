'use client';

import { memo } from 'react';

interface OrnamentalDividerProps {
  className?: string;
}

function OrnamentalDivider({ className = '' }: OrnamentalDividerProps) {
  return (
    <div className={`flex items-center gap-3 px-4 ${className}`}>
      <div className="flex-1 ornament-line" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon
          points="12,2 14,8 20,8 15,12 17,18 12,14 7,18 9,12 4,8 10,8"
          fill="#9C7F25"
        />
      </svg>
      <div className="flex-1 ornament-line" />
    </div>
  );
}

export default memo(OrnamentalDivider);
