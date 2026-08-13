import { IslamicDateInfo, IslamicSpecialEvent } from '../types';

export interface HijriMonthMeta {
  number: number;
  name: string;
  arabic: string;
  transliteration: string;
  holy: boolean;
  significance: string;
  virtues: string;
}

export const HIJRI_MONTHS: HijriMonthMeta[] = [
  { 
    number: 1, 
    name: 'Muharram', 
    arabic: 'المحرم', 
    transliteration: 'al-Muḥarram', 
    holy: true, 
    significance: 'The Sacred Month & First month of the Islamic Year',
    virtues: 'One of the four sacred months. Fasting on the Day of Ashura (10th) expiates minor sins of the preceding year.'
  },
  { 
    number: 2, 
    name: 'Safar', 
    arabic: 'صفر', 
    transliteration: 'Ṣafar', 
    holy: false, 
    significance: 'Second Month of the Lunar Calendar',
    virtues: 'Month of remembrance, historical journeying, and Arba’een commemoration.'
  },
  { 
    number: 3, 
    name: 'Rabi al-Awwal', 
    arabic: 'ربيع الأول', 
    transliteration: 'Rabīʿ al-Awwal', 
    holy: false, 
    significance: 'The Spring of Islam & Month of the Prophet’s Birth',
    virtues: 'Month marking the birth (Mawlid an-Nabi) and Hijrah arrival of Prophet Muhammad (PBUH) in Medina.'
  },
  { 
    number: 4, 
    name: 'Rabi al-Thani', 
    arabic: 'ربيع الثاني', 
    transliteration: 'Rabīʿ al-Thānī (al-Ākhir)', 
    holy: false, 
    significance: 'Fourth Month of the Islamic Calendar',
    virtues: 'Month of Ghyarwee Sharif honoring exemplary spiritual scholars and Sufi saints.'
  },
  { 
    number: 5, 
    name: 'Jumada al-Awwal', 
    arabic: 'جمادى الأولى', 
    transliteration: 'Jumādā al-Ūlā', 
    holy: false, 
    significance: 'Fifth Month of the Islamic Year',
    virtues: 'Historical month of the Battle of Mu’tah and devotion.'
  },
  { 
    number: 6, 
    name: 'Jumada al-Thani', 
    arabic: 'جمادى الثانية', 
    transliteration: 'Jumādā al-Ākhirah', 
    holy: false, 
    significance: 'Sixth Month of the Islamic Calendar',
    virtues: 'Marks the birth anniversary of Sayyida Fatima az-Zahra (SA) on the 20th.'
  },
  { 
    number: 7, 
    name: 'Rajab', 
    arabic: 'رجب', 
    transliteration: 'Rajab', 
    holy: true, 
    significance: 'Sacred Month of Allah & Isra wal Mi’raj',
    virtues: 'One of the four sacred months. Gateway to Ramadan. 27th Rajab marks the miraculous Heavenly Ascension.'
  },
  { 
    number: 8, 
    name: "Sha'ban", 
    arabic: 'شعبان', 
    transliteration: 'Shaʿbān', 
    holy: false, 
    significance: 'Month of the Prophet & Spiritual Preparation',
    virtues: 'Extensive voluntary fasting is recommended. 15th Sha’ban (Shab-e-Barat) is the Night of Salvation & Forgiveness.'
  },
  { 
    number: 9, 
    name: 'Ramadan', 
    arabic: 'رمضان', 
    transliteration: 'Ramaḍān', 
    holy: true, 
    significance: 'The Holiest Month of Fasting, Revelation & Laylat al-Qadr',
    virtues: 'The month in which the Holy Quran was revealed. Obligatory fasting (Sawm), Taraweeh prayers, and the Night of Power (Laylat al-Qadr).'
  },
  { 
    number: 10, 
    name: 'Shawwal', 
    arabic: 'شوال', 
    transliteration: 'Shawwāl', 
    holy: false, 
    significance: 'Month of Eid al-Fitr & Gratitude',
    virtues: '1st Shawwal celebrates Eid al-Fitr. Fasting 6 voluntary days (Sitta min Shawwal) yields reward of fasting the whole year.'
  },
  { 
    number: 11, 
    name: "Dhu al-Qi'dah", 
    arabic: 'ذو القعدة', 
    transliteration: 'Dhū al-Qaʿdah', 
    holy: true, 
    significance: 'Sacred Month of Peace & Pilgrimage Preparation',
    virtues: 'One of the four sacred months. Ancient month of peace and preparation for the major Hajj journey.'
  },
  { 
    number: 12, 
    name: 'Dhu al-Hijjah', 
    arabic: 'ذو الحجة', 
    transliteration: 'Dhū al-Ḥijjah', 
    holy: true, 
    significance: 'Month of Hajj, Day of Arafah & Eid al-Adha',
    virtues: 'The first 10 days are the most beloved to Allah. 9th is the Day of Arafah, 10th is Eid al-Adha (Qurbani), followed by Ayyam al-Tashriq.'
  }
];

export const HIJRI_MONTH_NAMES = HIJRI_MONTHS.map(m => m.name);
export const SACRED_HIJRI_MONTHS = HIJRI_MONTHS.filter(m => m.holy).map(m => m.name);

// Complete Islamic Master Festivals & Sacred Events Template
export interface IslamicFestivalTemplate {
  id: string;
  name: string;
  arabicName: string;
  hijriMonth: number;
  hijriDay: number;
  category: 'eid' | 'holy_night' | 'fasting' | 'hajj' | 'commemoration' | 'sacred_month';
  description: string;
  significance: string;
  ritualsOrSunnah: string;
}

export const ALL_ISLAMIC_FESTIVALS_TEMPLATE: IslamicFestivalTemplate[] = [
  {
    id: 'isl-new-year',
    name: 'Islamic New Year (1st Muharram)',
    arabicName: 'رأس السنة الهجرية',
    hijriMonth: 1,
    hijriDay: 1,
    category: 'sacred_month',
    description: 'First day of the Islamic lunar calendar year, commemorating the historic Hijrah (migration) of Prophet Muhammad (PBUH) from Mecca to Medina.',
    significance: 'Reflection on historical fortitude, renewal of faith, and start of the sacred month of Muharram.',
    ritualsOrSunnah: 'Duas for the new year, voluntary fasts, recitation of Surah al-Ikhlas and Istighfar.'
  },
  {
    id: 'isl-tasua',
    name: 'Tasu’a (9th Muharram)',
    arabicName: 'تاسوعاء',
    hijriMonth: 1,
    hijriDay: 9,
    category: 'fasting',
    description: 'The day preceding Ashura. The Prophet recommended fasting on the 9th along with the 10th of Muharram.',
    significance: 'Sunnah fasting day to accompany the Day of Ashura.',
    ritualsOrSunnah: 'Recommended Sunnah fast, nocturnal vigil, remembering historical sacrifices.'
  },
  {
    id: 'isl-ashura',
    name: 'Day of Ashura (10th Muharram)',
    arabicName: 'يوم عاشوراء',
    hijriMonth: 1,
    hijriDay: 10,
    category: 'commemoration',
    description: 'Sacred tenth day of Muharram commemorating Prophet Musa (AS) and the Israelites being saved from Pharaoh, as well as the supreme martyrdom of Imam Hussain (AS) and companions at Karbala (680 CE).',
    significance: 'Fasting expiates sins of the previous year; solemn remembrance of truth standing against tyranny.',
    ritualsOrSunnah: 'Fasting on 9th & 10th or 10th & 11th, charity to orphans and the poor, preparing special dishes like Haleem/Khichra, Majalis gatherings.'
  },
  {
    id: 'isl-arbaeen',
    name: 'Arba’een (Chehlum - 20th Safar)',
    arabicName: 'الأربعين',
    hijriMonth: 2,
    hijriDay: 20,
    category: 'commemoration',
    description: 'The 40th day after Ashura, marking the end of the 40-day mourning period for the martyrs of Karbala.',
    significance: 'One of the largest peaceful annual pilgrimages in the world to Karbala, Iraq.',
    ritualsOrSunnah: 'Recitation of Ziyarat Arba’een, supplications for universal justice and charity.'
  },
  {
    id: 'isl-mawlid',
    name: 'Mawlid an-Nabi (Prophet’s Birthday - 12th Rabi al-Awwal)',
    arabicName: 'المولد النبوي الشريف',
    hijriMonth: 3,
    hijriDay: 12,
    category: 'commemoration',
    description: 'Commemoration of the birth anniversary of Prophet Muhammad (peace and blessings be upon him) in 570 CE in Mecca.',
    significance: 'Spreading the Prophet’s divine message of mercy, peace, social justice, and kindness to all creation.',
    ritualsOrSunnah: 'Recitation of Durood and Salam, Milad processions, Naat recitations, distributing Niyaz and gourmet sweets.'
  },
  {
    id: 'isl-ghyarwee',
    name: 'Ghyarwee Sharif (11th Rabi al-Thani)',
    arabicName: 'الغياثية الشريفة',
    hijriMonth: 4,
    hijriDay: 11,
    category: 'commemoration',
    description: 'Monthly and annual commemoration honoring the great spiritual luminary Sheikh Abdul Qadir Gilani (Ghaus-ul-Azam).',
    significance: 'Celebrating Sufi traditions of charity, mystical devotion, and compassion.',
    ritualsOrSunnah: 'Feeding the needy, reciting Surah Yasin, sending blessings to holy souls.'
  },
  {
    id: 'isl-wiladat-fatima',
    name: 'Wiladat Sayyida Fatima az-Zahra (20th Jumada al-Thani)',
    arabicName: 'ولادة السيدة فاطمة الزهراء',
    hijriMonth: 6,
    hijriDay: 20,
    category: 'commemoration',
    description: 'Birth anniversary of the beloved daughter of Prophet Muhammad (PBUH), Mother of the Imams.',
    significance: 'Celebrated as World Muslim Women’s Day; embodiment of chastity, courage, and virtue.',
    ritualsOrSunnah: 'Gatherings celebrating women’s contributions, family bonding, and charity.'
  },
  {
    id: 'isl-laylat-raghaib',
    name: 'Laylat al-Raghaib (First Friday Night of Rajab)',
    arabicName: 'ليلة الرغائب',
    hijriMonth: 7,
    hijriDay: 4,
    category: 'holy_night',
    description: 'The Night of Desired Hopes and Divine Gifts, celebrated on the eve of the first Friday of Rajab.',
    significance: 'Abundant divine forgiveness, special prayers for answered supplications.',
    ritualsOrSunnah: 'Fasting on the first Thursday of Rajab, 12 rakats special night prayer with Surah al-Qadr.'
  },
  {
    id: 'isl-wiladat-ali',
    name: 'Wiladat of Hazrat Ali (13th Rajab)',
    arabicName: 'ولادة الإمام علي بن أبي طالب',
    hijriMonth: 7,
    hijriDay: 13,
    category: 'commemoration',
    description: 'Birth anniversary of Hazrat Ali ibn Abi Talib (AS), the fourth Caliph and first Imam, born uniquely inside the Holy Kaaba in Mecca.',
    significance: 'Revered for unparalleled courage, wisdom, justice, and leadership.',
    ritualsOrSunnah: 'Distributing food, reciting poetry of courage and justice, charity.'
  },
  {
    id: 'isl-isra-miraj',
    name: 'Isra and Mi’raj (Shab-e-Miraj - 27th Rajab)',
    arabicName: 'الإسراء والمعراج',
    hijriMonth: 7,
    hijriDay: 27,
    category: 'holy_night',
    description: 'The miraculous Night Journey of Prophet Muhammad (PBUH) from Mecca to Al-Aqsa Mosque in Jerusalem, and his ascension through the Seven Heavens into the Divine Presence.',
    significance: 'The five daily prayers (Salat) were ordained during this divine journey.',
    ritualsOrSunnah: 'All-night prayer (Tahajjud), fasting on 27th Rajab, recounting the lessons of the Ascension.'
  },
  {
    id: 'isl-shab-e-barat',
    name: 'Shab-e-Barat / Mid-Sha’ban (15th Sha’ban)',
    arabicName: 'ليلة البراءة / نصف شعبان',
    hijriMonth: 8,
    hijriDay: 15,
    category: 'holy_night',
    description: 'The Night of Deliverance and Divine Mercy, occurring on the eve of 15th Sha’ban. Sins are forgiven and annual destinies are recorded.',
    significance: 'Seeking absolute forgiveness, visiting graveyards (Qabristan), and preparing the heart for Ramadan.',
    ritualsOrSunnah: 'Night vigil (Nafal prayers), reciprocal forgiveness among loved ones, voluntary fasting on 15th Sha’ban, distributing Halwa and sweets.'
  },
  {
    id: 'isl-ramadan-start',
    name: 'First Day of Ramadan (1st Ramadan)',
    arabicName: 'أول أيام شهر رمضان المبارك',
    hijriMonth: 9,
    hijriDay: 1,
    category: 'fasting',
    description: 'Commencement of the holiest month of the Islamic calendar; daily obligatory dawn-to-sunset fasting begins.',
    significance: 'Spiritual purification, self-discipline, recitation of the Quran, empathy for the poor, and intense devotion.',
    ritualsOrSunnah: 'Suhoor (pre-dawn meal), Iftar (breaking fast with dates/water), Taraweeh nightly congregational prayers.'
  },
  {
    id: 'isl-badr',
    name: 'Youm-e-Badr / Battle of Badr (17th Ramadan)',
    arabicName: 'غزوة بدر الكبرى',
    hijriMonth: 9,
    hijriDay: 17,
    category: 'commemoration',
    description: 'Historic anniversary of the decisive Battle of Badr (624 CE), where the outnumbered Muslims were granted divine victory.',
    significance: 'Triumph of conviction and truth over overwhelming odds.',
    ritualsOrSunnah: 'Special supplications for steadfastness, Quranic recitations.'
  },
  {
    id: 'isl-shahadat-ali',
    name: 'Martyrdom of Hazrat Ali (21st Ramadan)',
    arabicName: 'استشهاد الإمام علي بن أبي طالب',
    hijriMonth: 9,
    hijriDay: 21,
    category: 'commemoration',
    description: 'Commemoration of the martyrdom of Hazrat Ali (AS) in Kufa while leading dawn prayers.',
    significance: 'Solemn reflection on justice, martyrdom, and the start of the final 10 nights of Ramadan.',
    ritualsOrSunnah: 'Itikaf in mosques, intense prayers and charitable contributions.'
  },
  {
    id: 'isl-laylat-qadr',
    name: 'Laylat al-Qadr (Shab-e-Qadr - 27th Ramadan)',
    arabicName: 'ليلة القدر',
    hijriMonth: 9,
    hijriDay: 27,
    category: 'holy_night',
    description: 'The Night of Power and Divine Revelation, sought throughout the odd nights (21st, 23rd, 25th, 27th, 29th) of Ramadan, famously celebrated on 27th Ramadan. Better than a thousand months (83 years).',
    significance: 'The Holy Quran was sent down from the Preserved Tablet; angels descend with divine peace until dawn.',
    ritualsOrSunnah: 'All-night prayers, reciting Surah al-Qadr, Salat al-Tasbeeh, Dua: "Allahumma innaka ’afuwwun tuhibbul-’afwa fa’fu ’anni".'
  },
  {
    id: 'isl-juma-wida',
    name: 'Jumu’atul-Wida (Last Friday of Ramadan)',
    arabicName: 'جمعة الوداع',
    hijriMonth: 9,
    hijriDay: 29,
    category: 'holy_night',
    description: 'The farewell Friday of the blessed month of Ramadan; also observed as International Al-Quds Day.',
    significance: 'Gratitude for completing Ramadan and intense prayers for world peace and oppressed souls.',
    ritualsOrSunnah: 'Attending grand Friday Jumu’ah prayers, special supplications of farewell to Ramadan.'
  },
  {
    id: 'isl-eid-fitr',
    name: 'Eid al-Fitr (1st Shawwal - Meethi Eid)',
    arabicName: 'عيد الفطر المبارك',
    hijriMonth: 10,
    hijriDay: 1,
    category: 'eid',
    description: 'Major Islamic festival celebrating the completion of Ramadan’s month of fasting with joyous feasting and gratitude.',
    significance: 'Thanksgiving to Allah for the discipline and spiritual transformation achieved during Ramadan.',
    ritualsOrSunnah: 'Payment of Zakat al-Fitr prior to prayer, communal outdoor Eid prayer (Salat al-Eid), wearing new attire, eating Sheer Khurma and Sevaiyan, hugging (Eid Mubarak), giving Eidi gifts to children.'
  },
  {
    id: 'isl-eid-fitr-day2',
    name: 'Eid al-Fitr (Day 2 Celebrations - 2nd Shawwal)',
    arabicName: 'ثاني أيام عيد الفطر',
    hijriMonth: 10,
    hijriDay: 2,
    category: 'eid',
    description: 'Second day of official Eid al-Fitr festivities across the global Muslim world.',
    significance: 'Visiting extended family, hosting feasts, community bonding.',
    ritualsOrSunnah: 'Family visits, hospitality, recreational gatherings.'
  },
  {
    id: 'isl-shawwal-fasts',
    name: 'Six Sunnah Fasting Days of Shawwal (2nd–7th Shawwal)',
    arabicName: 'صيام الست من شوال',
    hijriMonth: 10,
    hijriDay: 3,
    category: 'fasting',
    description: 'The 6 voluntary fasting days of Shawwal recommended by Prophet Muhammad (PBUH).',
    significance: 'Fasting Ramadan followed by 6 days of Shawwal is rewarded as if one fasted the entire year continuously.',
    ritualsOrSunnah: 'Fasting consecutively or intermittently throughout the month of Shawwal.'
  },
  {
    id: 'isl-10-dhul-hijjah',
    name: 'Beginning of the 10 Blessed Days of Dhu al-Hijjah (1st)',
    arabicName: 'عشر ذي الحجة',
    hijriMonth: 12,
    hijriDay: 1,
    category: 'sacred_month',
    description: 'The commencement of the first ten days of Dhu al-Hijjah, recognized as the best and most beloved ten days of the entire year for good deeds.',
    significance: 'Good deeds performed in these 10 days are more beloved to Allah than any other time.',
    ritualsOrSunnah: 'Voluntary fasting, increasing Takbeer (Allahu Akbar), Tahmeed, Tahleel, and charity.'
  },
  {
    id: 'isl-tarwiyah',
    name: 'Day of Tarwiyah (8th Dhu al-Hijjah - Hajj Begins)',
    arabicName: 'يوم التروية',
    hijriMonth: 12,
    hijriDay: 8,
    category: 'hajj',
    description: 'The 8th day of Dhu al-Hijjah when millions of pilgrims put on the Ihram and journey from Mecca to the tent city of Mina.',
    significance: 'Official start of the core rituals of the annual Hajj pilgrimage.',
    ritualsOrSunnah: 'Entering state of Ihram, Talbiyah recitation ("Labbayk Allahumma Labbayk"), staying in Mina.'
  },
  {
    id: 'isl-arafah',
    name: 'Day of Arafah (9th Dhu al-Hijjah - Waqfat Arafat)',
    arabicName: 'يوم عرفة',
    hijriMonth: 12,
    hijriDay: 9,
    category: 'hajj',
    description: 'The pinnacle day of the Hajj pilgrimage upon the plains of Mount Arafat. For non-pilgrims, fasting on this day expiates the sins of the past year and the coming year.',
    significance: 'The greatest day of forgiveness and freedom from Hellfire; culmination of Hajj.',
    ritualsOrSunnah: 'Fasting for non-pilgrims, non-stop Dhikr, supplications on Jabal al-Rahmah, Wuqoof at Arafat, proceeding to Muzdalifah at sunset.'
  },
  {
    id: 'isl-eid-adha',
    name: 'Eid al-Adha (10th Dhu al-Hijjah - Bakra Eid / Feast of Sacrifice)',
    arabicName: 'عيد الأضحى المبارك',
    hijriMonth: 12,
    hijriDay: 10,
    category: 'eid',
    description: 'The Great Festival of Sacrifice commemorating the profound devotion and willingness of Prophet Ibrahim (AS) to sacrifice his son Ismail in obedience to God.',
    significance: 'Celebration of absolute faith, selflessness, equality, and generosity.',
    ritualsOrSunnah: 'Takbeer al-Tashreeq, morning Eid prayer, Qurbani (Udhiyah livestock sacrifice) with meat distributed equally into 3 shares (family, relatives/friends, and poor), wearing best clothes.'
  },
  {
    id: 'isl-tashriq-1',
    name: 'Ayyam al-Tashriq - Day 1 (11th Dhu al-Hijjah)',
    arabicName: 'أيام التشريق - اليوم الأول',
    hijriMonth: 12,
    hijriDay: 11,
    category: 'hajj',
    description: 'First of the three Tashreeq days following Eid al-Adha. Pilgrims stone the Jamarat in Mina and continue celebrations.',
    significance: 'Days of eating, drinking, and remembering Allah (Fasting is strictly prohibited during Tashreeq).',
    ritualsOrSunnah: 'Reciting Takbeer after every fardh prayer, Stoning the three Jamarat pillars in Mina.'
  },
  {
    id: 'isl-tashriq-2',
    name: 'Ayyam al-Tashriq - Day 2 (12th Dhu al-Hijjah)',
    arabicName: 'أيام التشريق - اليوم الثاني',
    hijriMonth: 12,
    hijriDay: 12,
    category: 'hajj',
    description: 'Second Tashreeq day. Pilgrims who complete rites may prepare for departure from Mina before sunset.',
    significance: 'Days of celebration, gratitude, and brotherhood.',
    ritualsOrSunnah: 'Takbeer al-Tashreeq, continued Qurbani sacrifices, Jamarat stoning.'
  },
  {
    id: 'isl-tashriq-3',
    name: 'Ayyam al-Tashriq - Day 3 (13th Dhu al-Hijjah)',
    arabicName: 'أيام التشريق - اليوم الثالث',
    hijriMonth: 12,
    hijriDay: 13,
    category: 'hajj',
    description: 'Final day of the Tashreeq period and conclusion of the Hajj pilgrimage rites.',
    significance: 'Completion of the major pilgrimage rituals; performing Tawaf al-Wada (Farewell Circumambulation).',
    ritualsOrSunnah: 'Final Jamarat stoning, Farewell Tawaf around the Holy Kaaba.'
  },
  {
    id: 'isl-ghadir',
    name: 'Eid al-Ghadir (18th Dhu al-Hijjah)',
    arabicName: 'عيد الغدير الأغر',
    hijriMonth: 12,
    hijriDay: 18,
    category: 'commemoration',
    description: 'Commemoration of the historic sermon delivered by Prophet Muhammad (PBUH) at Ghadir Khumm on his return from the Farewell Pilgrimage.',
    significance: 'Celebration of leadership, loyalty, brotherhood, and moral guardianship.',
    ritualsOrSunnah: 'Voluntary fasting, family feasts, gifting, recitation of peace prayers.'
  },
  {
    id: 'isl-mubahala',
    name: 'Eid al-Mubahalah (24th Dhu al-Hijjah)',
    arabicName: 'يوم المباهلة',
    hijriMonth: 12,
    hijriDay: 24,
    category: 'commemoration',
    description: 'Commemoration of the historic event of Mubahala between Prophet Muhammad (PBUH) with the Ahl al-Bayt and the Christian delegation of Najran (631 CE).',
    significance: 'Affirmation of truth, spiritual purity, and peaceful dialogue.',
    ritualsOrSunnah: 'Supplications, fasting, giving alms to the needy.'
  }
];

// Algorithmic calculation: Gregorian Date -> Hijri Date
export function gregorianToHijri(date: Date, adjustmentDays: number = 0): IslamicDateInfo {
  const d = new Date(date);
  d.setDate(d.getDate() + adjustmentDays);

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  const epoch = 1948439.5;
  const daysSinceEpoch = jd - epoch;
  
  // 30-year cycle has 10,631 days
  const cycles = Math.floor(daysSinceEpoch / 10631);
  const remainder = daysSinceEpoch - cycles * 10631;

  let hijriYear = Math.floor((30 * remainder + 10646) / 10631);
  hijriYear += cycles * 30;

  // Leap years in 30-year cycle: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
  const cycleYear = hijriYear % 30;
  const isLeap = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(cycleYear);

  let dayOfYear = Math.floor(remainder - Math.floor((10631 * (hijriYear - cycles * 30) - 10646) / 30));
  if (dayOfYear < 0) dayOfYear = 0;

  // Month lengths
  let hijriMonth = 1;
  let hijriDay = dayOfYear + 1;

  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, isLeap ? 30 : 29];
  for (let i = 0; i < 12; i++) {
    if (hijriDay <= monthLengths[i]) {
      hijriMonth = i + 1;
      break;
    }
    hijriDay -= monthLengths[i];
  }

  // Safety clamps
  if (hijriDay < 1) hijriDay = 1;
  if (hijriMonth > 12) hijriMonth = 12;

  const monthMeta = HIJRI_MONTHS[hijriMonth - 1] || HIJRI_MONTHS[0];

  // Match all matching template festivals for this Hijri day & month
  const matchingTemplates = ALL_ISLAMIC_FESTIVALS_TEMPLATE.filter(
    t => t.hijriMonth === hijriMonth && t.hijriDay === hijriDay
  );

  const specialEvent = matchingTemplates.length > 0 ? matchingTemplates[0].name : undefined;

  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const formatted = `${hijriDay} ${monthMeta.name} ${hijriYear} AH`;
  const formattedArabic = `${hijriDay} ${monthMeta.arabic} ${hijriYear} هـ`;

  const specialEventsList: IslamicSpecialEvent[] = matchingTemplates.map(t => ({
    id: `${t.id}-${hijriYear}`,
    event: t.name,
    name: t.name,
    arabicName: t.arabicName,
    category: t.category,
    hijriDay,
    hijriMonth,
    hijriDate: `${hijriDay} ${monthMeta.name} ${hijriYear}`,
    gregorianDate: iso,
    gregorianYear: date.getFullYear(),
    description: t.description,
    significance: t.significance,
    ritualsOrSunnah: t.ritualsOrSunnah
  }));

  return {
    gregorianDate: iso,
    hijriDay,
    hijriMonth,
    hijriMonthName: monthMeta.name,
    hijriMonthNameArabic: monthMeta.arabic,
    hijriYear,
    isHolyMonth: monthMeta.holy,
    isSacredMonth: monthMeta.holy,
    monthName: monthMeta.name,
    monthNumber: hijriMonth,
    formatted,
    formattedArabic,
    specialEvent,
    specialEventsList,
    isEstimated: true,
    disclaimer: 'Calculated using Umm al-Qura astronomical algorithmic projection. Actual dates may vary by ±1 to 2 days subject to local lunar crescent (Hilal) sighting.'
  };
}

export const getHijriDate = gregorianToHijri;

// Convert Hijri back to Gregorian Date
export function hijriToGregorian(hijriYear: number, hijriMonth: number, hijriDay: number): Date {
  const epoch = 1948439.5;
  const cycle = Math.floor((hijriYear - 1) / 30);
  const yearInCycle = (hijriYear - 1) % 30;

  const leapYears = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  let daysInCycleYears = yearInCycle * 354;
  for (let y = 1; y <= yearInCycle; y++) {
    if (leapYears.includes(y)) daysInCycleYears++;
  }

  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  let daysInMonths = 0;
  for (let m = 1; m < hijriMonth; m++) {
    daysInMonths += monthLengths[m - 1];
  }

  const jd = epoch + cycle * 10631 + daysInCycleYears + daysInMonths + hijriDay - 1;

  // Convert Julian Day to Gregorian Date
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let alpha = Math.floor((z - 1867216.25) / 36524.25);
  let a = z + 1 + alpha - Math.floor(alpha / 4);
  let b = a + 1524;
  let c = Math.floor((b - 122.1) / 365.25);
  let d = Math.floor(365.25 * c);
  let e = Math.floor((b - d) / 30.6001);

  const day = Math.floor(b - d - Math.floor(30.6001 * e) + f);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  return new Date(year, month - 1, day, 12, 0, 0);
}

export const hijriToGregorianApprox = hijriToGregorian;

// Dynamic Calculation of All Islamic Special Dates for ANY Gregorian Year
export function getIslamicSpecialDatesForGregorianYear(gregorianYear: number): IslamicSpecialEvent[] {
  const events: IslamicSpecialEvent[] = [];

  // Iterate across all days of the given Gregorian year to accurately catch every occurrence (including lunar shifts)
  const isLeap = (gregorianYear % 4 === 0 && gregorianYear % 100 !== 0) || (gregorianYear % 400 === 0);
  const totalDays = isLeap ? 366 : 365;

  const startDate = new Date(gregorianYear, 0, 1);
  for (let i = 0; i < totalDays; i++) {
    const cur = new Date(startDate);
    cur.setDate(startDate.getDate() + i);

    const hijriInfo = gregorianToHijri(cur);
    if (hijriInfo.specialEventsList && hijriInfo.specialEventsList.length > 0) {
      hijriInfo.specialEventsList.forEach(ev => {
        events.push(ev);
      });
    }
  }

  return events;
}

// Dynamic Calculation of All Islamic Special Dates for a specific Hijri Year
export function getIslamicSpecialDatesForHijriYear(hijriYear: number): IslamicSpecialEvent[] {
  return ALL_ISLAMIC_FESTIVALS_TEMPLATE.map(template => {
    const gDate = hijriToGregorian(hijriYear, template.hijriMonth, template.hijriDay);
    const iso = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2, '0')}-${String(gDate.getDate()).padStart(2, '0')}`;
    const monthMeta = HIJRI_MONTHS[template.hijriMonth - 1];

    return {
      id: `${template.id}-${hijriYear}`,
      event: template.name,
      name: template.name,
      arabicName: template.arabicName,
      category: template.category,
      hijriDay: template.hijriDay,
      hijriMonth: template.hijriMonth,
      hijriDate: `${template.hijriDay} ${monthMeta?.name || ''} ${hijriYear} AH`,
      gregorianDate: iso,
      gregorianYear: gDate.getFullYear(),
      description: template.description,
      significance: template.significance,
      ritualsOrSunnah: template.ritualsOrSunnah
    };
  });
}

// Full Month Grid Generator for any Hijri Month
export interface HijriDayCell {
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  gregorianDate: Date;
  gregorianDateString: string;
  dayOfWeek: string;
  isToday: boolean;
  isFriday: boolean;
  isWhiteDay: boolean; // Ayyam al-Beed: 13, 14, 15
  specialEvents: IslamicSpecialEvent[];
}

export function getHijriMonthDays(hijriYear: number, hijriMonth: number): HijriDayCell[] {
  const cycleYear = hijriYear % 30;
  const isLeap = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(cycleYear);
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, isLeap ? 30 : 29];
  const daysInThisMonth = monthLengths[hijriMonth - 1] || 30;

  const cells: HijriDayCell[] = [];
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  for (let d = 1; d <= daysInThisMonth; d++) {
    const gDate = hijriToGregorian(hijriYear, hijriMonth, d);
    const iso = `${gDate.getFullYear()}-${String(gDate.getMonth() + 1).padStart(2, '0')}-${String(gDate.getDate()).padStart(2, '0')}`;
    const dayOfWeek = gDate.toLocaleDateString('en-US', { weekday: 'short' });
    const isFriday = gDate.getDay() === 5;
    const isWhiteDay = d === 13 || d === 14 || d === 15;
    const isToday = iso === todayISO;

    const matchedTemplates = ALL_ISLAMIC_FESTIVALS_TEMPLATE.filter(
      t => t.hijriMonth === hijriMonth && t.hijriDay === d
    );

    const specialEvents: IslamicSpecialEvent[] = matchedTemplates.map(t => ({
      id: `${t.id}-${hijriYear}`,
      event: t.name,
      name: t.name,
      arabicName: t.arabicName,
      category: t.category,
      hijriDay: d,
      hijriMonth,
      hijriDate: `${d} ${HIJRI_MONTHS[hijriMonth - 1]?.name || ''} ${hijriYear} AH`,
      gregorianDate: iso,
      description: t.description,
      significance: t.significance,
      ritualsOrSunnah: t.ritualsOrSunnah
    }));

    cells.push({
      hijriDay: d,
      hijriMonth,
      hijriYear,
      gregorianDate: gDate,
      gregorianDateString: iso,
      dayOfWeek,
      isToday,
      isFriday,
      isWhiteDay,
      specialEvents
    });
  }

  return cells;
}

// Fallback constant for backwards compatibility
export const ISLAMIC_SPECIAL_DATES_2026 = getIslamicSpecialDatesForGregorianYear(2026);
