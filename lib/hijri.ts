'use client';

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
  'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
];

const MONTHS_AR_GREGORIAN = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const DAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

function toHijri(date: Date): { year: number; month: number; day: number } {
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

export interface DateInfo {
  dayAr: string;
  dateAr: string;
  hijriAr: string;
  dateEs: string;
  dayEs: string;
}

export function getDateInfo(date: Date): DateInfo {
  const { year, month, day } = toHijri(date);

  const dayIndex = date.getDay();
  const monthIndex = date.getMonth();
  const dayOfMonth = date.getDate();
  const fullYear = date.getFullYear();

  const dayAr = DAYS_AR[dayIndex];
  const monthArHijri = HIJRI_MONTHS_AR[month - 1];
  const monthArGreg = MONTHS_AR_GREGORIAN[monthIndex];
  const monthEs = MONTHS_ES[monthIndex];
  const dayEs = DAYS_ES[dayIndex];

  // All numbers stay Latin (no Arabic-Indic conversion)
  return {
    dayAr,
    dateAr: `${dayAr} ${dayOfMonth} ${monthArGreg} ${fullYear}`,
    hijriAr: `${day} ${monthArHijri} ${year} هـ`,
    dateEs: `${dayEs.charAt(0).toUpperCase() + dayEs.slice(1)} ${dayOfMonth} de ${monthEs.charAt(0).toUpperCase() + monthEs.slice(1)} ${fullYear}`,
    dayEs,
  };
}
