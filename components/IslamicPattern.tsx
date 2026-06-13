'use client';

export default function IslamicPattern() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.04 }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="arabesque"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* 8-pointed star */}
            <polygon
              points="40,10 44,30 60,30 47,42 52,62 40,50 28,62 33,42 20,30 36,30"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            {/* Interlacing squares */}
            <rect
              x="25"
              y="25"
              width="30"
              height="30"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
              transform="rotate(45 40 40)"
            />
            <rect
              x="28"
              y="28"
              width="24"
              height="24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.4"
            />
            {/* Corner flowers */}
            <circle cx="0" cy="0" r="5" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="80" cy="0" r="5" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="0" cy="80" r="5" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
            <circle cx="80" cy="80" r="5" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#arabesque)" />
      </svg>
    </div>
  );
}
