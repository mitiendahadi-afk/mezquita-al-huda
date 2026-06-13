'use client';

import { ayat, type Aya } from '@/data/ayat';
import { ahadeeth, type Hadith } from '@/data/ahadeeth';
import { azkar as azkarData, type Zikr } from '@/data/azkar';
import { duas, type Dua } from '@/data/duas';

export type ZikrItem =
  | { type: 'aya'; data: Aya }
  | { type: 'hadith'; data: Hadith }
  | { type: 'zikr'; data: Zikr }
  | { type: 'dua'; data: Dua };

export function buildZikrPlaylist(): ZikrItem[] {
  const list: ZikrItem[] = [
    ...ayat.map(a => ({ type: 'aya' as const, data: a })),
    ...ahadeeth.map(h => ({ type: 'hadith' as const, data: h })),
    ...azkarData.map(z => ({ type: 'zikr' as const, data: z })),
    ...duas.map(d => ({ type: 'dua' as const, data: d })),
  ];
  return shuffleArray(list);
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getZikrText(item: ZikrItem): { ar: string; es: string; ref?: string } {
  switch (item.type) {
    case 'aya':
      return { ar: item.data.ar, es: item.data.es, ref: `${item.data.ref_ar} · ${item.data.ref_es}` };
    case 'hadith':
      return { ar: item.data.ar, es: item.data.es, ref: item.data.source_ar };
    case 'zikr':
      return { ar: item.data.ar, es: item.data.es };
    case 'dua':
      return { ar: item.data.ar, es: item.data.es, ref: item.data.name_ar };
  }
}
