export interface Zikr {
  ar: string;
  es: string;
  type: 'sabah' | 'masa' | 'baada_salah' | 'general';
  repeat?: number;
}

export const azkar: Zikr[] = [
  {
    ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    es: "Gloria a Alá y con Su alabanza",
    type: 'baada_salah',
    repeat: 33,
  },
  {
    ar: "الْحَمْدُ لِلَّهِ",
    es: "Alabado sea Alá",
    type: 'baada_salah',
    repeat: 33,
  },
  {
    ar: "اللَّهُ أَكْبَرُ",
    es: "Alá es el más grande",
    type: 'baada_salah',
    repeat: 34,
  },
  {
    ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    es: "No hay más dios que Alá, Único, sin asociados; Suyo es el dominio y para Él es la alabanza; Él es Omnipotente",
    type: 'baada_salah',
  },
  {
    ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    es: "Hemos amanecido y el dominio es de Alá, y toda alabanza es para Alá",
    type: 'sabah',
  },
  {
    ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ",
    es: "Hemos llegado a la tarde y el dominio es de Alá, y toda alabanza es para Alá",
    type: 'masa',
  },
  {
    ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    es: "Oh Alá, con Tu ayuda amanecemos y anochecemos, vivimos y morimos, y a Ti es el retorno",
    type: 'sabah',
  },
  {
    ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    es: "Oh Alá, Tú eres mi Señor, no hay más dios que Tú, me creaste y soy Tu siervo",
    type: 'sabah',
  },
  {
    ar: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    es: "Alá me basta, no hay más dios que Él, en Él confío, Él es el Señor del Trono Supremo",
    type: 'general',
  },
  {
    ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    es: "¡Gloria a Alá y con Su alabanza! ¡Gloria al Gran Alá!",
    type: 'general',
  },
  {
    ar: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    es: "No hay fuerza ni poder sino por Alá",
    type: 'general',
  },
  {
    ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    es: "Oh Alá, bendice a Mujámmad y a la familia de Mujámmad",
    type: 'baada_salah',
  },
  {
    ar: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا",
    es: "Me complace Alá como Señor, el Islam como religión y Mujámmad como Profeta",
    type: 'sabah',
  },
  {
    ar: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    es: "Oh Alá, dame salud en mi cuerpo; Oh Alá, dame salud en mi oído; Oh Alá, dame salud en mi vista",
    type: 'sabah',
  },
  {
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ",
    es: "Oh Alá, te pido el perdón y la salvaguarda en esta vida y en la otra",
    type: 'masa',
  },
  {
    ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
    es: "En el nombre de Alá, con cuyo nombre nada puede hacer daño en la tierra ni en el cielo",
    type: 'sabah',
  },
  {
    ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    es: "Oh Alá, me refugio en Ti de la angustia y la tristeza",
    type: 'general',
  },
  {
    ar: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
    es: "¡Gloria a Ti, oh Alá, y con Tu alabanza! Atestiguo que no hay más dios que Tú; te pido perdón y me arrepiento ante Ti",
    type: 'baada_salah',
  },
  {
    ar: "اللَّهُمَّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الْغَفُورُ",
    es: "Oh Alá, perdóname y acepta mi arrepentimiento; ciertamente Tú eres el Perdonador, el Indulgente",
    type: 'general',
  },
  {
    ar: "اللَّهُمَّ أَجِرْنَا مِنَ النَّارِ",
    es: "Oh Alá, protégenos del Fuego",
    type: 'masa',
  },
];
