'use client';

import { loadIqamaOffsets, saveIqamaOffsets, type IqamaOffsets } from './prayerCalc';

export { loadIqamaOffsets, saveIqamaOffsets };
export type { IqamaOffsets };

export interface Announcement {
  id: string;
  ar: string;
  es: string;
  duration: number; // seconds
  active: boolean;
}

export interface AudioSettings {
  enabled: boolean;
  reader: 'makkah' | 'mishary' | 'basit';
  volume: number;
}

export interface AdminSettings {
  iqamaOffsets: IqamaOffsets;
  announcements: Announcement[];
  audio: AudioSettings;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  zikrEnabled: boolean;
  prayerAdjustments: Record<string, number>;
}

const DEFAULT_SETTINGS: AdminSettings = {
  iqamaOffsets: { fajr: 10, dhuhr: 10, asr: 10, maghrib: 10, isha: 10 },
  announcements: [],
  audio: { enabled: false, reader: 'makkah', volume: 0.7 },
  maintenanceMode: false,
  maintenanceMessage: '',
  zikrEnabled: true,
  prayerAdjustments: {},
};

const SETTINGS_KEY = 'admin_settings';

export function loadSettings(): AdminSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Partial<AdminSettings>): void {
  if (typeof window === 'undefined') return;
  const current = loadSettings();
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  // Trigger storage event for auto-reload
  window.dispatchEvent(new StorageEvent('storage', { key: SETTINGS_KEY }));
}

export function getActiveAnnouncements(settings: AdminSettings): Announcement[] {
  return settings.announcements.filter(a => a.active);
}
