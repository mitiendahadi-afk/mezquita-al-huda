'use client';

import { useState, useEffect, useRef } from 'react';
import { calculatePrayerSchedule, getNextPrayer, type PrayerSchedule } from '@/lib/prayerCalc';
import { getDateInfo, type DateInfo } from '@/lib/hijri';
import { formatCountdown } from '@/lib/formatters';

const TZ = 'Atlantic/Canary';

const PRAYER_ORDER = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
type PrayerRow = typeof PRAYER_ORDER[number];
type Locale = 'ar' | 'es' | 'en';

// ── Translations ─────────────────────────────────────────────────────────────
// Prayer names are ALWAYS Arabic (from entry.nameAr) — never included here.
interface T {
  mosqueName: string;
  subtitle: string;
  nextPrayer: string;
  countdownLabel: string;
  colPrayer: string;
  colAdhan: string;
  colIqama: string;
  allDone: string;
  loading: string;
}

const TRANSLATIONS: Record<Locale, T> = {
  ar: {
    mosqueName: 'مسجد الهدى',
    subtitle: 'كوستا كالما — فويرتيفينتورا',
    nextPrayer: 'الصلاة القادمة',
    countdownLabel: 'بعد',
    colPrayer: 'الصلاة',
    colAdhan: 'الأذان',
    colIqama: 'الإقامة',
    allDone: 'انتهت صلوات اليوم · جزاكم الله خيراً',
    loading: 'جاري التحميل…',
  },
  es: {
    mosqueName: 'Mezquita Al Huda',
    subtitle: 'Costa Calma — Fuerteventura',
    nextPrayer: 'Próxima oración',
    countdownLabel: 'en',
    colPrayer: 'Oración',
    colAdhan: 'Adhan',
    colIqama: 'Iqama',
    allDone: 'Oraciones del día completadas · Que Allah os recompense',
    loading: 'Cargando…',
  },
  en: {
    mosqueName: 'Al Huda Mosque',
    subtitle: 'Costa Calma — Fuerteventura',
    nextPrayer: 'Next prayer',
    countdownLabel: 'in',
    colPrayer: 'Prayer',
    colAdhan: 'Adhan',
    colIqama: 'Iqama',
    allDone: 'All prayers done today · May Allah reward you',
    loading: 'Loading…',
  },
};

const LOCALE_LANG: Record<Locale, string> = { ar: 'ar', es: 'es', en: 'en' };

function gregorianDate(now: Date, locale: Locale, dateInfo: DateInfo): string {
  if (locale === 'ar') return dateInfo.dateAr;
  if (locale === 'es') return dateInfo.dateEs;
  return now.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: TZ,
  });
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MovilPage() {
  const [locale, setLocale] = useState<Locale>('ar');
  const [now, setNow] = useState(() => new Date());
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [dateInfo, setDateInfo] = useState<DateInfo | null>(null);
  const scheduleRef = useRef<PrayerSchedule | null>(null);
  const dayRef = useRef('');

  const t = TRANSLATIONS[locale];
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Simple 1-second clock — no aggressive reload watchdog needed on mobile browsers
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Recalculate prayer schedule once per calendar day (Canary time)
  useEffect(() => {
    const dayKey = now.toLocaleDateString('en-GB', { timeZone: TZ });
    if (dayKey === dayRef.current && scheduleRef.current) return;
    dayRef.current = dayKey;
    const sch = calculatePrayerSchedule(now);
    scheduleRef.current = sch;
    setSchedule(sch);
    setDateInfo(getDateInfo(now));
  }, [now]);

  const timeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: TZ,
  });

  const nextPrayer = schedule ? getNextPrayer(schedule, now) : null;

  // ── Language switcher (rendered in all states) ────────────────────────────
  const LangSwitcher = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 0 2px',
        flexShrink: 0,
      }}
    >
      {(['ar', 'es', 'en'] as Locale[]).map(loc => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          style={{
            padding: '4px 16px',
            borderRadius: '20px',
            border: locale === loc
              ? '1px solid #D4AF37'
              : '1px solid rgba(212,175,55,0.22)',
            background: locale === loc ? '#D4AF37' : 'transparent',
            color: locale === loc ? '#0A2E26' : '#8B8676',
            fontFamily: 'Cairo, Inter, sans-serif',
            fontSize: '13px',
            fontWeight: locale === loc ? 700 : 400,
            cursor: 'pointer',
            minWidth: '48px',
            letterSpacing: '0.05em',
          }}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );

  if (!schedule || !dateInfo) {
    return (
      <div
        dir={dir}
        lang={LOCALE_LANG[locale]}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}
      >
        {LangSwitcher}
        <p style={{ color: '#D4AF37', fontFamily: 'Cairo, sans-serif', fontSize: '22px', marginTop: '24px' }}>
          {t.loading}
        </p>
      </div>
    );
  }

  return (
    <main
      dir={dir}
      lang={LOCALE_LANG[locale]}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '430px',
        width: '100%',
        margin: '0 auto',
        padding: '0 14px',
      }}
    >
      {/* ── Language switcher ── */}
      {LangSwitcher}

      {/* ── Header ── */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '8px 0 6px',
          flexShrink: 0,
        }}
      >
        <img
          src="/icons/logo.png"
          alt="شعار المسجد"
          width={42}
          height={42}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Reem Kufi', sans-serif",
              fontSize: '20px',
              color: '#D4AF37',
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {t.mosqueName}
          </div>
          <div style={{ fontSize: '12px', color: '#C8C2B0', marginTop: '1px' }}>
            {t.subtitle}
          </div>
        </div>
      </header>

      {/* ── Live clock ── */}
      <div style={{ textAlign: 'center', padding: '2px 0', flexShrink: 0 }}>
        <div
          dir="ltr"
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontSize: 'clamp(48px, 14vw, 68px)',
            color: '#FAF7F0',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '0.04em',
          }}
        >
          {timeStr}
        </div>
      </div>

      {/* ── Dates ── */}
      <div style={{ textAlign: 'center', padding: '4px 0 6px', flexShrink: 0 }}>
        {/* Hijri date: always Arabic, always from lib/hijri.ts */}
        <div
          dir="rtl"
          style={{ fontFamily: 'Cairo, sans-serif', fontSize: '15px', color: '#D4AF37', fontWeight: 600 }}
        >
          {dateInfo.hijriAr}
        </div>
        {/* Gregorian date: locale-aware */}
        <div style={{ fontSize: '12px', color: '#8B8676', marginTop: '2px' }}>
          {gregorianDate(now, locale, dateInfo)}
        </div>
      </div>

      {/* ── Next prayer card ── */}
      {nextPrayer ? (
        <div
          style={{
            background: 'rgba(212,175,55,0.10)',
            border: '1px solid rgba(212,175,55,0.45)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#8B8676', marginBottom: '2px' }}>
              {t.nextPrayer}
            </div>
            {/* Prayer name: ALWAYS Arabic regardless of locale */}
            <div
              dir="rtl"
              style={{
                fontFamily: "'Reem Kufi', sans-serif",
                fontSize: '22px',
                color: '#F4D03F',
                fontWeight: 700,
              }}
            >
              {nextPrayer.entry.nameAr}
            </div>
          </div>
          <div dir="ltr" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#8B8676', marginBottom: '2px', textAlign: 'end' }}>
              {t.countdownLabel}
            </div>
            <div
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontSize: '26px',
                color: '#4ADE80',
                fontWeight: 900,
                letterSpacing: '0.03em',
              }}
            >
              {formatCountdown(nextPrayer.secondsUntil)}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(74,222,128,0.07)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '8px',
            textAlign: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: '14px', color: '#4ADE80' }}>
            {t.allDone}
          </div>
        </div>
      )}

      {/* ── Prayer list ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          paddingBottom: '10px',
          minHeight: 0,
        }}
      >
        {/* Column headers */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr 3fr',
            padding: '2px 12px',
            fontSize: '11px',
            color: '#8B8676',
          }}
        >
          {/* Prayer name col header: always shown in Arabic, explicit dir for safety */}
          <span dir="rtl">{t.colPrayer}</span>
          <span style={{ textAlign: 'center' }}>{t.colAdhan}</span>
          <span style={{ textAlign: 'center' }}>{t.colIqama}</span>
        </div>

        {PRAYER_ORDER.map((key: PrayerRow) => {
          const entry = schedule[key];
          const isNext = nextPrayer?.key === key;
          const isPassed = entry.adhanTime !== null && entry.adhanTime < now;

          return (
            <div
              key={key}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 3fr 3fr',
                alignItems: 'center',
                padding: '9px 12px',
                borderRadius: '10px',
                flex: 1,
                background: isNext
                  ? 'rgba(212,175,55,0.14)'
                  : isPassed
                  ? 'rgba(255,255,255,0.025)'
                  : 'rgba(16,61,50,0.55)',
                border: isNext
                  ? '1px solid rgba(212,175,55,0.45)'
                  : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {/* Prayer name: ALWAYS Arabic, explicit dir="rtl" in all locales */}
              <span
                dir="rtl"
                style={{
                  fontFamily: "'Reem Kufi', sans-serif",
                  fontSize: '16px',
                  fontWeight: isNext ? 700 : 400,
                  color: isNext ? '#F4D03F' : isPassed ? '#555E58' : '#FAF7F0',
                }}
              >
                {entry.nameAr}
              </span>
              <span
                dir="ltr"
                style={{
                  textAlign: 'center',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '17px',
                  fontWeight: 600,
                  color: isNext ? '#FAF7F0' : isPassed ? '#555E58' : '#C8C2B0',
                }}
              >
                {entry.adhanDisplay}
              </span>
              <span
                dir="ltr"
                style={{
                  textAlign: 'center',
                  fontFamily: 'Cairo, sans-serif',
                  fontSize: '15px',
                  color: isNext ? '#4ADE80' : isPassed ? '#3D4A43' : '#8B8676',
                }}
              >
                {entry.iqamaDisplay ?? '—'}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
