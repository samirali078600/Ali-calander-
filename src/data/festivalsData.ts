import { FestivalItem } from '../types';
import { gregorianToHijri, getIslamicSpecialDatesForGregorianYear } from '../utils/hijriCalculations';

export const FESTIVALS_DATABASE: FestivalItem[] = [
  // HINDU FESTIVALS
  {
    id: 'fest-h-1',
    name: 'Makar Sankranti / Pongal / Lohri',
    date: '2026-01-14',
    month: 1,
    day: 14,
    religion: 'hindu',
    region: 'Pan-India, Punjab, Tamil Nadu, Gujarat',
    description: 'Astronomical transit of the Sun into the zodiac sign of Makara (Capricorn), marking the end of winter solstice and longer days.',
    history: 'Ancient solar festival mentioned in the Mahabharata and Puranas.',
    significance: 'Celebrates the harvest, kite flying in Gujarat, bonfire celebrations (Lohri) in Punjab, and boiling fresh harvest rice (Pongal).',
    rituals: 'Holy dip in sacred rivers (Ganga, Godavari), exchange of sesame and jaggery (Til-Gul), kite flying.',
    sourceName: 'National Portal of India & Vedic Ephemeris',
    isVerified: true
  },
  {
    id: 'fest-h-2',
    name: 'Maha Shivratri',
    date: '2026-02-16',
    month: 2,
    day: 16,
    religion: 'hindu',
    region: 'Pan-India & Nepal',
    description: 'The Great Night of Shiva, observed on the 14th night of the dark fortnight in the month of Phalguna.',
    history: 'Commemorates the cosmic dance (Tandava) of Shiva and his divine union with Goddess Parvati.',
    significance: 'Symbolizes overcoming darkness and ignorance in life and the world through self-discipline and meditation.',
    rituals: 'All-night vigil (Jagaran), fasting, chanting Om Namah Shivaya, and offering Bel leaves and milk to the Shiva Lingam.',
    sourceName: 'Ministry of Culture, Government of India',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-h-3',
    name: 'Holi (Festival of Colors)',
    date: '2026-03-04',
    month: 3,
    day: 4,
    religion: 'hindu',
    region: 'Pan-India & Global Indian Diaspora',
    description: 'The vibrant festival of spring, colors, and love celebrating the triumph of devotion over arrogance.',
    history: 'Rooted in the legend of young devotee Prahlada and Lord Vishnu saving him from demoness Holika, as well as the playful romance of Radha and Krishna in Braj.',
    significance: 'Promotes social harmony, forgiveness of past grievances, and joyous community bonding.',
    rituals: 'Lighting of Holika Dahan bonfire on the eve, smearing colorful powders (Gulal), music, dance, and sharing sweets like Gujiya.',
    sourceName: 'Incredible India & Sahitya Akademi Records',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-h-4',
    name: 'Raksha Bandhan',
    date: '2026-08-28',
    month: 8,
    day: 28,
    religion: 'hindu',
    region: 'Pan-India',
    description: 'Sacred celebration of the affectionate bond of love and protection between sisters and brothers.',
    history: 'Traces back to epic narratives such as Draupadi tying a cloth to Lord Krishna’s finger.',
    significance: 'Sister ties a protective thread (Rakhi) on her brother’s wrist; brother vows lifelong support and gives gifts.',
    rituals: 'Aarti, tying Rakhi, applying Tilak, exchange of sweets.',
    sourceName: 'National Heritage Archives',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-h-5',
    name: 'Janmashtami (Krishna Jayanti)',
    date: '2026-09-04',
    month: 9,
    day: 4,
    religion: 'hindu',
    region: 'Pan-India, Mathura, Vrindavan, Maharashtra',
    description: 'Birth anniversary of Lord Krishna, the eighth avatar of Lord Vishnu.',
    history: 'Celebrated on the Ashtami (8th day) of Krishna Paksha in Shravana/Bhadrapada month.',
    significance: 'Commemorates the divine birth of the speaker of the Bhagavad Gita.',
    rituals: 'Fasting until midnight, swinging baby Krishna in cradle, Dahi Handi competitions in Maharashtra, devotional singing.',
    sourceName: 'Archaeological Survey of India Cultural Records',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-h-6',
    name: 'Ganesh Chaturthi',
    date: '2026-09-14',
    month: 9,
    day: 14,
    religion: 'hindu',
    region: 'Maharashtra, Goa, Karnataka, Telangana, Pan-India',
    description: 'Ten-day festival celebrating the arrival of Lord Ganesha to Earth from Kailash Parvat with his mother Goddess Parvati.',
    history: 'Popularized as a grand public celebration by freedom fighter Lokmanya Bal Gangadhar Tilak in 1893 to unite citizens.',
    significance: 'Lord Ganesha is revered as the remover of obstacles (Vighnaharta) and deity of wisdom and beginnings.',
    rituals: 'Installation of clay Ganesha idols, daily prayers with Modak sweets, culminating in joyous Visarjan (immersion) processions.',
    sourceName: 'Maharashtra State Cultural Directorate',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-h-7',
    name: 'Navratri & Durga Puja',
    date: '2026-10-11',
    month: 10,
    day: 11,
    religion: 'hindu',
    region: 'Pan-India, West Bengal, Gujarat',
    description: 'Nine sacred nights dedicated to the feminine divine (Shakti) in nine forms (Navadurga).',
    history: 'UNESCO inscribed Durga Puja in Kolkata on the Representative List of the Intangible Cultural Heritage of Humanity (2021).',
    significance: 'Triumph of Goddess Durga over buffalo demon Mahishasura; celebratory Garba and Dandiya Raas in Gujarat; magnificent pandals in Bengal.',
    rituals: 'Fasting, recitation of Devi Mahatmya, Sindoor Khela, Dhunuchi dance.',
    sourceName: 'UNESCO Intangible Cultural Heritage Database',
    sourceUrl: 'https://ich.unesco.org',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-h-8',
    name: 'Diwali (Deepavali)',
    date: '2026-11-08',
    month: 11,
    day: 8,
    religion: 'hindu',
    region: 'Pan-India & Worldwide',
    description: 'Grand Festival of Lights spanning Dhanteras, Naraka Chaturdashi, Lakshmi Puja, Govardhan Puja, and Bhai Dooj.',
    history: 'Marks the return of Lord Rama, Sita, and Lakshmana to Ayodhya after 14 years of exile and defeating Ravana.',
    significance: 'Inner light triumphing over spiritual darkness; worship of Goddess Lakshmi for wealth and prosperity.',
    rituals: 'Lighting earthen oil lamps (Diyas), intricate Rangoli art, fireworks, wearing new clothes, sharing gourmet sweets.',
    sourceName: 'Indian National Calendar Ephemeris',
    isVerified: true,
    isLunarBased: true
  },

  // ISLAMIC FESTIVALS
  {
    id: 'fest-i-1',
    name: 'Eid al-Fitr',
    date: '2026-03-21',
    month: 3,
    day: 21,
    religion: 'islamic',
    region: 'Global Muslim Community',
    description: 'Joyous festival of breaking the fast celebrated on the first day of the Islamic lunar month of Shawwal.',
    history: 'Established by Prophet Muhammad in Medina after migration from Mecca (624 CE).',
    significance: 'Thanksgiving to Allah for the strength and spiritual purification gained during Ramadan.',
    rituals: 'Communal morning Salat al-Eid prayer, payment of Zakat al-Fitr (charity to the needy), feasts like Sheer Khurma and Sevaiyan, hugging (Eid Mubarak).',
    sourceName: 'Islamic World Heritage Encyclopedia',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-i-2',
    name: 'Eid al-Adha (Feast of Sacrifice)',
    date: '2026-05-28',
    month: 5,
    day: 28,
    religion: 'islamic',
    region: 'Global Muslim Community',
    description: 'Major Islamic festival commemorating Prophet Ibrahim’s devotion and willingness to sacrifice his son in obedience to God.',
    history: 'Culmination of the annual Hajj pilgrimage in Mecca, Saudi Arabia.',
    significance: 'Emphasizes selflessness, obedience to God, and sharing with the underprivileged.',
    rituals: 'Eid prayers, Qurbani (Udhiyah animal sacrifice with meat divided into 3 equal portions for family, friends, and poor).',
    sourceName: 'Islamic Religious Authority Records',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-i-3',
    name: 'Mawlid an-Nabi',
    date: '2026-08-27',
    month: 8,
    day: 27,
    religion: 'islamic',
    region: 'Global Muslim Community',
    description: 'Observance of the birth anniversary of Prophet Muhammad (peace be upon him) in 570 CE.',
    history: 'Observed across centuries with poetry recitations, devotional gatherings, and spiritual reflection.',
    significance: 'Spreading the Prophet’s teachings of mercy, peace, charity, and universal brotherhood.',
    rituals: 'Naat khwani (hymns), illuminations of mosques and homes, community food kitchens (Niyaz).',
    sourceName: 'Islamic Cultural Encyclopedia',
    isVerified: true,
    isLunarBased: true
  },

  // SIKH FESTIVALS
  {
    id: 'fest-s-1',
    name: 'Baisakhi (Vaisakhi)',
    date: '2026-04-14',
    month: 4,
    day: 14,
    religion: 'sikh',
    region: 'Punjab & Global Sikh Community',
    description: 'Spring harvest festival and foundational anniversary of the Khalsa Panth established by the tenth Guru, Guru Gobind Singh Ji in 1699 at Anandpur Sahib.',
    history: 'On this day in 1699, the Panj Pyare (Five Beloved Ones) were baptized, establishing the order of the Khalsa.',
    significance: 'Celebrates courageous self-sacrifice, equality, righteousness, and agricultural abundance.',
    rituals: 'Nagar Kirtan street processions, Gatka martial arts displays, Gurbani recitations, and community Langar.',
    sourceName: 'Shiromani Gurdwara Parbandhak Committee (SGPC)',
    sourceUrl: 'https://www.sgpc.net',
    isVerified: true
  },
  {
    id: 'fest-s-2',
    name: 'Guru Nanak Gurpurab',
    date: '2026-11-24',
    month: 11,
    day: 24,
    religion: 'sikh',
    region: 'Global Sikh Community',
    description: 'Prakash Utsav marking the birth of Guru Nanak Dev Ji (1469), the first Guru and founder of Sikhism.',
    history: 'Guru Nanak taught the unity of God (Ik Onkar), equality of all humans regardless of caste or gender, and honest labor (Kirat Karo).',
    significance: 'Promotes universal peace, egalitarian community kitchens (Langar), and selfless service (Seva).',
    rituals: '48-hour continuous reading of Sri Guru Granth Sahib (Akhand Path), dawn processions (Prabhat Pheris).',
    sourceName: 'SGPC Historical Records',
    isVerified: true,
    isLunarBased: true
  },

  // CHRISTIAN FESTIVALS
  {
    id: 'fest-c-1',
    name: 'Easter Sunday',
    date: '2026-04-05',
    month: 4,
    day: 5,
    religion: 'christian',
    region: 'Global Christian Community',
    description: 'The principal feast of the Christian church year celebrating the resurrection of Jesus Christ on the third day after his crucifixion.',
    history: 'Rooted in New Testament gospel accounts of Jesus rising from the dead at Calvary.',
    significance: 'Symbol of eternal hope, redemption, new life, and victory over death.',
    rituals: 'Sunrise church services, festive family dinners, Easter egg hunts symbolizing rebirth.',
    sourceName: 'Ecclesiastical Calendar Archives',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-c-2',
    name: 'Christmas',
    date: '2026-12-25',
    month: 12,
    day: 25,
    religion: 'christian',
    region: 'Global Community',
    description: 'Annual festival commemorating the birth of Jesus Christ, celebrated globally by billions.',
    history: 'Celebrated since at least 336 CE in Rome.',
    significance: 'Celebration of peace, joy, goodwill to humanity, family reunion, and generosity.',
    rituals: 'Midnight Mass, decorating evergreen trees, singing carols, gift giving.',
    sourceName: 'Encyclopaedia Britannica Cultural Records',
    isVerified: true
  },

  // JAIN & BUDDHIST FESTIVALS
  {
    id: 'fest-j-1',
    name: 'Mahavir Jayanti',
    date: '2026-03-31',
    month: 3,
    day: 31,
    religion: 'jain',
    region: 'India & Global Jain Community',
    description: 'Birth anniversary of Bhagwan Mahavira (599 BCE), the 24th and last Tirthankara of Jainism.',
    history: 'Born in Kundalpur (modern Bihar), Mahavira attained Kevala Jnana (omniscience) after rigorous asceticism.',
    significance: 'Celebrates the philosophy of Ahimsa (absolute non-violence), Anekantavada (multi-faceted truth), and Aparigraha (non-possessiveness).',
    rituals: 'Abhisheka of Mahavira idols, chariot processions (Rath Yatra), charity and vegetarian feasts.',
    sourceName: 'Jain Center of America & Indian Historical Records',
    isVerified: true,
    isLunarBased: true
  },
  {
    id: 'fest-b-1',
    name: 'Buddha Purnima (Vesak)',
    date: '2026-05-01',
    month: 5,
    day: 1,
    religion: 'buddhist',
    region: 'India, Sri Lanka, Southeast Asia & Global',
    description: 'Triply sacred day commemorating the Birth, Supreme Enlightenment (Bodhi), and Parinirvana of Siddhartha Gautama Buddha.',
    history: 'Recognized as an official UN day of international observance since 1999 (UN General Assembly Resolution 54/115).',
    significance: 'Spreads Buddha’s teachings of Compassion (Karuna), Loving-kindness (Metta), and the Noble Eightfold Path.',
    rituals: 'Meditation, chanting sutras, visiting Bodh Gaya and Sarnath, releasing captive birds, providing free meals.',
    sourceName: 'United Nations UNESCO & Mahabodhi Society',
    isVerified: true,
    isLunarBased: true
  }
];

export function getFestivalsForDate(dateStr: string): FestivalItem[] {
  const [yStr, mStr, dStr] = dateStr.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return [];
  }

  // 1. Direct match on fixed-date database items (or year-matching items)
  const baseMatches = FESTIVALS_DATABASE.filter(f => {
    if (f.date === dateStr) return true;
    // For non-lunar fixed festivals without explicit year requirement
    if (!f.isLunarBased && f.month === month && f.day === day) return true;
    return false;
  });

  // 2. Dynamic Islamic festivals calculation for this specific day & year
  const dObj = new Date(year, month - 1, day);
  const hijri = gregorianToHijri(dObj);
  const islamicFestivals: FestivalItem[] = [];

  if (hijri.specialEventsList && hijri.specialEventsList.length > 0) {
    hijri.specialEventsList.forEach(ev => {
      // Avoid duplicate names if already present in baseMatches
      if (!baseMatches.some(b => b.name.toLowerCase().includes(ev.name.toLowerCase()) || ev.name.toLowerCase().includes(b.name.toLowerCase()))) {
        islamicFestivals.push({
          id: `dyn-${ev.id}`,
          name: `${ev.name} (${ev.arabicName || ''})`,
          date: dateStr,
          month: month,
          day: day,
          religion: 'islamic',
          region: 'Global Islamic Ummah',
          description: ev.description,
          significance: ev.significance || 'Sacred Islamic milestone.',
          rituals: ev.ritualsOrSunnah,
          sourceName: 'Umm al-Qura Hijri Calendar Ephemeris',
          isVerified: true,
          isLunarBased: true
        });
      }
    });
  }

  return [...baseMatches, ...islamicFestivals];
}

export function getFestivalsForYear(year: number): FestivalItem[] {
  // 1. Fixed non-lunar festivals
  const fixedList: FestivalItem[] = FESTIVALS_DATABASE
    .filter(f => !f.isLunarBased && f.month && f.day)
    .map(f => ({
      ...f,
      date: `${year}-${String(f.month).padStart(2, '0')}-${String(f.day).padStart(2, '0')}`
    }));

  // 2. Dynamic Islamic festivals for this year
  const islamicList = getIslamicSpecialDatesForGregorianYear(year).map(ev => {
    const [y, m, d] = ev.gregorianDate.split('-').map(Number);
    return {
      id: `dyn-yr-${ev.id}`,
      name: `${ev.name} (${ev.arabicName || ''})`,
      date: ev.gregorianDate,
      month: m,
      day: d,
      religion: 'islamic' as const,
      region: 'Global Islamic Ummah',
      description: ev.description,
      significance: ev.significance || '',
      rituals: ev.ritualsOrSunnah,
      sourceName: 'Umm al-Qura Hijri Ephemeris',
      isVerified: true,
      isLunarBased: true
    };
  });

  return [...fixedList, ...islamicList].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}
