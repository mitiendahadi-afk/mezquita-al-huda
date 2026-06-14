'use client';

import { useState, useEffect, useRef } from 'react';
import DynamicBackground from '@/components/DynamicBackground';
import IslamicPattern from '@/components/IslamicPattern';
import HeaderBar from '@/components/HeaderBar';
import ClockCard from '@/components/ClockCard';
import DateDisplay from '@/components/DateDisplay';
import PrayerGrid from '@/components/PrayerGrid';
import OrnamentalDivider from '@/components/OrnamentalDivider';
import ZikrMarquee from '@/components/ZikrMarquee';
import AnnouncementsBar from '@/components/AnnouncementsBar';
import AdhanScreen from '@/components/AdhanScreen';
import IqamaScreen from '@/components/IqamaScreen';

import { calculatePrayerSchedule, getNextPrayer, isAdhanTime, isIqamaTime, type PrayerSchedule } from '@/lib/prayerCalc';
import { getDateInfo, type DateInfo } from '@/lib/hijri';
import { loadSettings, type AdminSettings } from '@/lib/iqamaSettings';
import { useRobustClock } from '@/hooks/useRobustClock';

type ScreenMode = 'main' | 'adhan' | 'iqama';

export default function MainDisplay() {
  const [time, setTime]           = useState('');
  const [dateInfo, setDateInfo]   = useState<DateInfo | null>(null);
  const [schedule, setSchedule]   = useState<PrayerSchedule | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ key: string; entry: any; secondsUntil: number } | null>(null);
  const [screenMode, setScreenMode] = useState<ScreenMode>('main');
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [activePrayerKey, setActivePrayerKey] = useState<string>('');
  const [settings, setSettings]   = useState<AdminSettings | null>(null);
  const [showFsBtn, setShowFsBtn] = useState(true);
  const [burnOffset, setBurnOffset] = useState({ x: 0, y: 0 });

  const adhanTimeoutRef  = useRef<NodeJS.Timeout | null>(null);
  const iqamaTimeoutRef  = useRef<NodeJS.Timeout | null>(null);
  const lastAdhanRef     = useRef<string>('');
  const lastIqamaRef     = useRef<string>('');
  const audioRef         = useRef<HTMLAudioElement | null>(null);

  // Robust clock — survives Android WebView timer throttling
  const robustNow = useRobustClock();

  // Settings
  useEffect(() => {
    setSettings(loadSettings());
    const onStorage = () => setSettings(loadSettings());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Cursor hide after 3s
  useEffect(() => {
    const t = setTimeout(() => document.body.classList.add('no-cursor'), 3000);
    return () => clearTimeout(t);
  }, []);

  // Anti burn-in: 15-min pixel drift
  useEffect(() => {
    const id = setInterval(() => {
      setBurnOffset({ x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 });
    }, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  // Visibility recovery: dispatch clock-recovery so useRobustClock restarts its interval
  useEffect(() => {
    const recover = () => {
      window.dispatchEvent(new Event('clock-recovery'));
    };
    const onVisibility = () => { if (!document.hidden) recover(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', recover);
    window.addEventListener('online', recover);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', recover);
      window.removeEventListener('online', recover);
    };
  }, []);

  // Prayer calculations — re-run every second driven by useRobustClock
  useEffect(() => {
    const now = robustNow;

    setTime(now.toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'Atlantic/Canary',
    }));
    setDateInfo(getDateInfo(now));

    const sch = calculatePrayerSchedule(now, settings?.iqamaOffsets);
    setSchedule(sch);

    const next = getNextPrayer(sch, now);
    setNextPrayer(next ? { key: next.key, entry: next.entry, secondsUntil: next.secondsUntil } : null);

    // Adhan trigger
    const adhanPrayer = isAdhanTime(sch, now);
    if (adhanPrayer && lastAdhanRef.current !== adhanPrayer.key + now.toDateString()) {
      lastAdhanRef.current = adhanPrayer.key + now.toDateString();
      setActiveEntry(adhanPrayer.entry);
      setActivePrayerKey(adhanPrayer.key);
      setScreenMode('adhan');
      if (settings?.audio?.enabled) {
        playAdhan(adhanPrayer.key === 'fajr', settings.audio.reader, settings.audio.volume);
      }
      if (adhanTimeoutRef.current) clearTimeout(adhanTimeoutRef.current);
      adhanTimeoutRef.current = setTimeout(() => setScreenMode('main'), 3 * 60 * 1000);
    }

    // Iqama trigger
    const iqamaPrayer = isIqamaTime(sch, now);
    if (iqamaPrayer && lastIqamaRef.current !== iqamaPrayer.key + now.toDateString()) {
      lastIqamaRef.current = iqamaPrayer.key + now.toDateString();
      setActiveEntry(iqamaPrayer.entry);
      setScreenMode('iqama');
      if (iqamaTimeoutRef.current) clearTimeout(iqamaTimeoutRef.current);
      iqamaTimeoutRef.current = setTimeout(() => setScreenMode('main'), 60 * 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [robustNow, settings]);

  const playAdhan = (isFajr: boolean, reader: string, volume: number) => {
    try {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
      const audio = new Audio(`/adhan/${isFajr ? `${reader}-fajr` : `${reader}-regular`}.mp3`);
      audio.volume = volume;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {}
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (!time || !dateInfo || !schedule) {
    return (
      <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', isolation: 'isolate' }}>
        <DynamicBackground />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <div className="text-center">
            <p style={{ fontFamily: 'Reem Kufi', fontSize: 'clamp(36px,4vw,64px)', color: '#D4AF37' }}>
              الرابطة الإسلامية الهدى
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '20px', color: '#8B8676', marginTop: '10px' }}>
              Cargando · جاري التحميل
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Overlay screens ───────────────────────────────────────────────
  if (screenMode === 'adhan' && activeEntry) return <AdhanScreen entry={activeEntry} isFajr={activePrayerKey === 'fajr'} />;
  if (screenMode === 'iqama' && activeEntry) return <IqamaScreen entry={activeEntry} />;

  // ── Maintenance ───────────────────────────────────────────────────
  if (settings?.maintenanceMode) {
    return (
      <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', isolation: 'isolate' }}>
        <DynamicBackground />
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <p style={{ fontFamily: 'Reem Kufi', fontSize: '56px', color: '#D4AF37' }}>
            🔧 المسجد مغلق مؤقتاً
          </p>
          {settings.maintenanceMessage && (
            <p style={{ fontFamily: 'Inter', fontSize: '28px', color: '#C8C2B0', marginTop: '16px' }}>
              {settings.maintenanceMessage}
            </p>
          )}
        </div>
      </main>
    );
  }

  const announcements = settings?.announcements.filter(a => a.active) ?? [];

  return (
    // isolation: isolate creates a stacking context — background at zIndex 0, content at zIndex 10
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {/* Background sits at zIndex 0 inside isolation context */}
      <DynamicBackground />

      {/* Fullscreen button — outside transform container so it stays fixed to viewport */}
      {showFsBtn && (
        <button
          onClick={() => { document.documentElement.requestFullscreen?.().catch(() => {}); setShowFsBtn(false); }}
          style={{
            position: 'absolute', bottom: 14, left: 14, zIndex: 50,
            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.5)',
            color: '#D4AF37', fontFamily: 'Inter', fontSize: '13px',
          }}
        >
          ⛶ Pantalla completa
        </button>
      )}

      {/* All content at zIndex 10 — above background */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%',
          display: 'grid',
          gridTemplateRows: '22vh 36vh 8px 22vh 8px 1fr',
          transform: `translate(${burnOffset.x}px, ${burnOffset.y}px)`,
          transition: 'transform 30s ease-in-out',
        }}
      >
        {/* ── ROW 1: Header 12vh ── */}
        <HeaderBar />

        {/* ── ROW 2: Clock Card + Date 50vh ── */}
        <div
          className="flex flex-col items-center justify-center px-8"
          style={{ gap: 'clamp(8px, 1.2vh, 20px)' }}
        >
          <ClockCard
            time={time}
            nextPrayer={nextPrayer ? { entry: nextPrayer.entry, secondsUntil: nextPrayer.secondsUntil } : null}
          />
          {dateInfo && <DateDisplay dateInfo={dateInfo} />}
        </div>

        {/* ── ROW 3: Divider ── */}
        <OrnamentalDivider className="self-center" />

        {/* ── ROW 4: Prayer Grid 22vh ── */}
        <PrayerGrid
          schedule={schedule}
          nextPrayerKey={nextPrayer?.key as any ?? null}
        />

        {/* ── ROW 5: Divider ── */}
        <OrnamentalDivider className="self-center" />

        {/* ── ROW 6: Zikr / Announcements ── */}
        <div>
          {announcements.length > 0 ? (
            <AnnouncementsBar announcements={announcements} />
          ) : settings?.zikrEnabled !== false ? (
            <ZikrMarquee />
          ) : null}
        </div>
      </div>
    </main>
  );
}
