'use client';

import PrayerCard from './PrayerCard';
import { type PrayerSchedule, type PrayerKey } from '@/lib/prayerCalc';

interface PrayerGridProps {
  schedule: PrayerSchedule;
  nextPrayerKey: PrayerKey | null;
}

export default function PrayerGrid({ schedule, nextPrayerKey }: PrayerGridProps) {
  return (
    // dir="rtl": first child renders at right edge → fajr appears rightmost
    <div
      dir="rtl"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '0.5rem',
        padding: '0 clamp(2rem, 4vw, 5rem) 0.5rem',
        width: '100%',
        maxWidth: '1700px',
        margin: '0 auto',
        height: '100%',
      }}
    >
      <PrayerCard nameAr={schedule.fajr.nameAr}    nameEs={schedule.fajr.nameEs}    adhanTime={schedule.fajr.adhanDisplay}    iqamaTime={schedule.fajr.iqamaDisplay}    isNext={nextPrayerKey === 'fajr'} />
      <PrayerCard nameAr={schedule.sunrise.nameAr}  nameEs={schedule.sunrise.nameEs}  adhanTime={schedule.sunrise.adhanDisplay}  iqamaTime={null}                            isNext={false} />
      <PrayerCard nameAr={schedule.dhuhr.nameAr}   nameEs={schedule.dhuhr.nameEs}   adhanTime={schedule.dhuhr.adhanDisplay}   iqamaTime={schedule.dhuhr.iqamaDisplay}   isNext={nextPrayerKey === 'dhuhr'} />
      <PrayerCard nameAr={schedule.asr.nameAr}     nameEs={schedule.asr.nameEs}     adhanTime={schedule.asr.adhanDisplay}     iqamaTime={schedule.asr.iqamaDisplay}     isNext={nextPrayerKey === 'asr'} />
      <PrayerCard nameAr={schedule.maghrib.nameAr}  nameEs={schedule.maghrib.nameEs}  adhanTime={schedule.maghrib.adhanDisplay}  iqamaTime={schedule.maghrib.iqamaDisplay}  isNext={nextPrayerKey === 'maghrib'} />
      <PrayerCard nameAr={schedule.isha.nameAr}    nameEs={schedule.isha.nameEs}    adhanTime={schedule.isha.adhanDisplay}    iqamaTime={schedule.isha.iqamaDisplay}    isNext={nextPrayerKey === 'isha'} />
    </div>
  );
}
