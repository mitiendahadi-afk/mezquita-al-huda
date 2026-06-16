'use client';

import { Coordinates, CalculationMethod, PrayerTimes, Madhab, Prayer } from 'adhan';

export const MOSQUE_LOCATION = {
  name: 'Costa Calma',
  nameAr: 'كوستا كالما',
  lat: 28.1597,
  lng: -14.2289,
  timezone: 'Atlantic/Canary',
};

const DEFAULT_IQAMA_OFFSETS: IqamaOffsets = {
  fajr: 10,
  dhuhr: 10,
  asr: 10,
  maghrib: 8,
  isha: 10,
};

export interface IqamaOffsets {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerEntry {
  key: string;
  nameAr: string;
  nameEs: string;
  adhanTime: Date | null;
  adhanDisplay: string;
  iqamaTime: Date | null;
  iqamaDisplay: string | null;
}

export interface PrayerSchedule {
  fajr: PrayerEntry;
  sunrise: PrayerEntry;
  dhuhr: PrayerEntry;
  asr: PrayerEntry;
  maghrib: PrayerEntry;
  isha: PrayerEntry;
}

export function loadIqamaOffsets(): IqamaOffsets {
  if (typeof window === 'undefined') return DEFAULT_IQAMA_OFFSETS;
  try {
    const stored = localStorage.getItem('iqamaOffsets');
    if (stored) return { ...DEFAULT_IQAMA_OFFSETS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_IQAMA_OFFSETS;
}

export function saveIqamaOffsets(offsets: IqamaOffsets): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('iqamaOffsets', JSON.stringify(offsets));
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: MOSQUE_LOCATION.timezone,
  });
}

function addMinutes(d: Date, m: number): Date {
  const r = new Date(d);
  r.setMinutes(r.getMinutes() + m);
  return r;
}

export function calculatePrayerSchedule(date: Date, iqamaOffsets?: IqamaOffsets): PrayerSchedule {
  const coords = new Coordinates(MOSQUE_LOCATION.lat, MOSQUE_LOCATION.lng);
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Shafi;

  const times = new PrayerTimes(coords, date, params);
  const offsets = iqamaOffsets || loadIqamaOffsets();

  const makeEntry = (
    key: string,
    nameAr: string,
    nameEs: string,
    adhanDate: Date,
    iqamaOffset: number | null,
  ): PrayerEntry => ({
    key,
    nameAr,
    nameEs,
    adhanTime: adhanDate,
    adhanDisplay: formatTime(adhanDate),
    iqamaTime: iqamaOffset !== null ? addMinutes(adhanDate, iqamaOffset) : null,
    iqamaDisplay: iqamaOffset !== null ? formatTime(addMinutes(adhanDate, iqamaOffset)) : null,
  });

  return {
    fajr: makeEntry('fajr', 'الفجر', 'Fajr', times.fajr, offsets.fajr),
    sunrise: makeEntry('sunrise', 'الشروق', 'Sunrise', times.sunrise, null),
    dhuhr: makeEntry('dhuhr', 'الظهر', 'Dhuhr', times.dhuhr, offsets.dhuhr),
    asr: makeEntry('asr', 'العصر', 'Asr', times.asr, offsets.asr),
    maghrib: makeEntry('maghrib', 'المغرب', 'Maghrib', times.maghrib, offsets.maghrib),
    isha: makeEntry('isha', 'العشاء', 'Isha', times.isha, offsets.isha),
  };
}

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export function getNextPrayer(schedule: PrayerSchedule, now: Date): {
  key: PrayerKey;
  entry: PrayerEntry;
  minutesUntil: number;
  secondsUntil: number;
} | null {
  const prayerKeys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  for (const key of prayerKeys) {
    const entry = schedule[key];
    if (entry.adhanTime && entry.adhanTime > now) {
      const diff = entry.adhanTime.getTime() - now.getTime();
      return {
        key,
        entry,
        minutesUntil: Math.floor(diff / 60000),
        secondsUntil: Math.floor(diff / 1000),
      };
    }
  }
  return null;
}

export function isAdhanTime(schedule: PrayerSchedule, now: Date): { key: PrayerKey; entry: PrayerEntry } | null {
  const prayerKeys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const nowMs = now.getTime();

  for (const key of prayerKeys) {
    const entry = schedule[key];
    if (entry.adhanTime) {
      const diff = Math.abs(nowMs - entry.adhanTime.getTime());
      if (diff < 3 * 60 * 1000) {
        return { key, entry };
      }
    }
  }
  return null;
}

export function isIqamaTime(schedule: PrayerSchedule, now: Date): { key: PrayerKey; entry: PrayerEntry } | null {
  const prayerKeys: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  const nowMs = now.getTime();

  for (const key of prayerKeys) {
    const entry = schedule[key];
    if (entry.iqamaTime) {
      const diff = Math.abs(nowMs - entry.iqamaTime.getTime());
      if (diff < 60 * 1000) {
        return { key, entry };
      }
    }
  }
  return null;
}
