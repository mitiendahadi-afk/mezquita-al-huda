'use client';
import { useEffect } from 'react';

/**
 * Forces a page reload every 30 minutes as last-resort protection
 * against Android WebView timer drift in 24/7 kiosk mode.
 * Implemented with setTimeout so each reload resets the counter cleanly.
 */
export default function SafetyReload() {
  useEffect(() => {
    const id = setTimeout(() => {
      console.log('[SafetyReload] 30-min reload triggered');
      window.location.reload();
    }, 30 * 60 * 1000);
    return () => clearTimeout(id);
  }, []);

  return null;
}
