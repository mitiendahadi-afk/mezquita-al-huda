'use client';
import { useEffect, useState, useRef, memo } from 'react';

const BACKGROUNDS = [
  '/backgrounds/geometric.jpg',
  '/backgrounds/mosque-interior.jpg',
  '/backgrounds/night-stars.jpg',
  '/backgrounds/sunrise.jpg',
];

function DynamicBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex]       = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    BACKGROUNDS.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    // 10-minute rotation (was 5 min — halves GPU transition work)
    const id = setInterval(() => {
      setTransitioning(true);
      // Clear any previous orphaned transition timeout before starting new one
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % BACKGROUNDS.length);
        setNextIndex(prev => (prev + 1) % BACKGROUNDS.length);
        setTransitioning(false);
        transitionTimeoutRef.current = null;
      }, 2000);
    }, 10 * 60 * 1000);

    return () => {
      clearInterval(id);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  // No nextIndex in deps — indices managed internally to avoid effect restart loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      <img
        src={BACKGROUNDS[currentIndex]}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 2s ease-in-out',
        }}
      />
      <img
        src={BACKGROUNDS[nextIndex]}
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          opacity: transitioning ? 1 : 0,
          transition: 'opacity 2s ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,46,38,0.72) 0%, rgba(15,110,86,0.58) 100%)',
        }}
      />
    </div>
  );
}

export default memo(DynamicBackground);
