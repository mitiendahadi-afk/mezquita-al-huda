'use client';
import { useEffect, useState } from 'react';

const BACKGROUNDS = [
  '/backgrounds/geometric.jpg',
  '/backgrounds/mosque-interior.jpg',
  '/backgrounds/night-stars.jpg',
  '/backgrounds/sunrise.jpg',
];

export default function DynamicBackground() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex]       = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  // Preload all images on mount
  useEffect(() => {
    BACKGROUNDS.forEach(src => {
      const img = new window.Image();
      img.src = src;
    });
    console.log('✅ All backgrounds preloaded:', BACKGROUNDS);
  }, []);

  // Rotate every 5 minutes with a 2-second cross-fade
  useEffect(() => {
    const id = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setNextIndex(ni => (ni + 1) % BACKGROUNDS.length);
        setTransitioning(false);
        console.log('🔄 Background changed to:', BACKGROUNDS[nextIndex]);
      }, 2000);
    }, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [nextIndex]);

  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {/* Current image — fades out during transition */}
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

      {/* Next image — fades in during transition */}
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

      {/* Dark green overlay for text readability */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,46,38,0.72) 0%, rgba(15,110,86,0.58) 100%)',
        }}
      />
    </div>
  );
}
