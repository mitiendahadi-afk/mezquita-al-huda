'use client';
import { useEffect, useState, useRef } from 'react';

/**
 * Robust clock hook for 24/7 Android WebView operation.
 *
 * Android throttles setInterval after inactivity to save battery.
 * Three recovery layers:
 *   1. setInterval (primary, 1s)
 *   2. requestAnimationFrame watchdog — detects frozen interval and restarts it
 *   3. Watchdog interval (3s) — forces page reload if frozen > 10s
 * Plus visibility/focus/pageshow event listeners to recover on app switch.
 */
export function useRobustClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  const lastUpdateRef = useRef<number>(Date.now());
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchdogRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef        = useRef<number | null>(null);

  useEffect(() => {
    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const t = Date.now();
        lastUpdateRef.current = t;
        setNow(new Date(t));
      }, 1000);
    };

    const rafLoop = () => {
      const t = Date.now();
      if (t - lastUpdateRef.current > 2000) {
        console.warn('[Clock] interval froze — recovering via RAF');
        lastUpdateRef.current = t;
        setNow(new Date(t));
        startInterval();
      }
      rafRef.current = requestAnimationFrame(rafLoop);
    };

    const startWatchdog = () => {
      if (watchdogRef.current) clearInterval(watchdogRef.current);
      watchdogRef.current = setInterval(() => {
        const elapsed = Date.now() - lastUpdateRef.current;
        if (elapsed > 10_000) {
          console.error('[Clock] frozen for', elapsed, 'ms — reloading');
          window.location.reload();
        } else if (elapsed > 5_000) {
          console.warn('[Clock] stale for', elapsed, 'ms — restarting interval');
          lastUpdateRef.current = Date.now();
          setNow(new Date());
          startInterval();
        }
      }, 3_000);
    };

    const recover = () => {
      lastUpdateRef.current = Date.now();
      setNow(new Date());
      startInterval();
    };

    const onVisibility = () => { if (!document.hidden) recover(); };

    startInterval();
    startWatchdog();
    rafRef.current = requestAnimationFrame(rafLoop);

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', recover);
    window.addEventListener('pageshow', recover);
    window.addEventListener('clock-recovery', recover);

    return () => {
      if (intervalRef.current)  clearInterval(intervalRef.current);
      if (watchdogRef.current)  clearInterval(watchdogRef.current);
      if (rafRef.current)       cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', recover);
      window.removeEventListener('pageshow', recover);
      window.removeEventListener('clock-recovery', recover);
    };
  }, []);

  return now;
}
