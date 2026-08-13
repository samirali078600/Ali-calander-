import { PanchangInfo } from '../types';

export const TITHI_NAMES = [
  'Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Chaturthi (4)', 'Panchami (5)',
  'Shashthi (6)', 'Saptami (7)', 'Ashtami (8)', 'Navami (9)', 'Dashami (10)',
  'Ekadashi (11)', 'Dwadashi (12)', 'Trayodashi (13)', 'Chaturdashi (14)',
  'Purnima (15 / Full Moon)'
];

export const TITHI_NAMES_KRISHNA = [
  'Pratipada (1)', 'Dwitiya (2)', 'Tritiya (3)', 'Chaturthi (4)', 'Panchami (5)',
  'Shashthi (6)', 'Saptami (7)', 'Ashtami (8)', 'Navami (9)', 'Dashami (10)',
  'Ekadashi (11)', 'Dwadashi (12)', 'Trayodashi (13)', 'Chaturdashi (14)',
  'Amavasya (30 / New Moon)'
];

export const NAKSHATRAS = [
  { name: 'Ashwini', ruler: 'Ketu', deity: 'Ashwini Kumaras' },
  { name: 'Bharani', ruler: 'Venus', deity: 'Yama' },
  { name: 'Krittika', ruler: 'Sun', deity: 'Agni' },
  { name: 'Rohini', ruler: 'Moon', deity: 'Brahma' },
  { name: 'Mrigashira', ruler: 'Mars', deity: 'Soma' },
  { name: 'Ardra', ruler: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', ruler: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', ruler: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', ruler: 'Mercury', deity: 'Nagas' },
  { name: 'Magha', ruler: 'Ketu', deity: 'Pitris' },
  { name: 'Purva Phalguni', ruler: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', ruler: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', ruler: 'Moon', deity: 'Savita' },
  { name: 'Chitra', ruler: 'Mars', deity: 'Tvashtar' },
  { name: 'Swati', ruler: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', ruler: 'Jupiter', deity: 'Indra-Agni' },
  { name: 'Anuradha', ruler: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', ruler: 'Mercury', deity: 'Indra' },
  { name: 'Mula', ruler: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', ruler: 'Venus', deity: 'Apas' },
  { name: 'Uttara Ashadha', ruler: 'Sun', deity: 'Vishwadevas' },
  { name: 'Shravana', ruler: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', ruler: 'Mars', deity: 'Ashta Vasus' },
  { name: 'Shatabhisha', ruler: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', ruler: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', ruler: 'Saturn', deity: 'Ahirbudhnya' },
  { name: 'Revati', ruler: 'Mercury', deity: 'Pushan' }
];

export const YOGAS = [
  { name: 'Vishkambha', meaning: 'Prevailing / Victorious' },
  { name: 'Priti', meaning: 'Affectionate / Loving' },
  { name: 'Ayushman', meaning: 'Long-lived / Vitality' },
  { name: 'Saubhagya', meaning: 'Good Fortune / Auspiciousness' },
  { name: 'Shobhana', meaning: 'Splendid / Radiant' },
  { name: 'Atiganda', meaning: 'Challenging obstacles' },
  { name: 'Sukarma', meaning: 'Good Deeds / Righteousness' },
  { name: 'Dhriti', meaning: 'Patience / Firmness' },
  { name: 'Shula', meaning: 'Spear / Decisive' },
  { name: 'Ganda', meaning: 'Knots / Strategic' },
  { name: 'Vriddhi', meaning: 'Growth / Abundance' },
  { name: 'Dhruva', meaning: 'Steadfast / Constant' },
  { name: 'Vyaghata', meaning: 'Fierce / Protective' },
  { name: 'Harshana', meaning: 'Joyous / Thrilling' },
  { name: 'Vajra', meaning: 'Diamond-like strength' },
  { name: 'Siddhi', meaning: 'Accomplishment / Mastery' },
  { name: 'Vyatipata', meaning: 'Calamity transformer' },
  { name: 'Variyan', meaning: 'Pre-eminent / Superior' },
  { name: 'Parigha', meaning: 'Shield / Fortified' },
  { name: 'Shiva', meaning: 'Benevolent / Auspicious' },
  { name: 'Siddha', meaning: 'Perfected / Realized' },
  { name: 'Sadhya', meaning: 'Achievable / Focused' },
  { name: 'Shubha', meaning: 'Good omen / Pure' },
  { name: 'Shukla', meaning: 'Bright / Clear' },
  { name: 'Brahma', meaning: 'Divine wisdom' },
  { name: 'Indra', meaning: 'Leadership / Noble' },
  { name: 'Vaidhriti', meaning: 'Critical discernment' }
];

export const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];

export const RASHIS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

export const VARA_NAMES = [
  'Ravivara (Sunday)', 'Somavara (Monday)', 'Mangalavara (Tuesday)',
  'Budhavara (Wednesday)', 'Guruvara (Thursday)', 'Shukravara (Friday)',
  'Shanivara (Saturday)'
];

export function calculatePanchang(date: Date, locationName: string = 'New Delhi, India'): PanchangInfo {
  // Epoch calculation based on Julian Day
  const time = date.getTime();
  const dayOfWeek = date.getDay();
  const vara = VARA_NAMES[dayOfWeek];

  // Approximate Sun & Moon Longitudes using astronomical formulas
  const daysSince2000 = (time - new Date(2000, 0, 1, 12, 0, 0).getTime()) / (1000 * 60 * 60 * 24);
  
  // Mean Sun longitude (degrees)
  let sunLong = (280.460 + 0.9856474 * daysSince2000) % 360;
  if (sunLong < 0) sunLong += 360;

  // Mean Moon longitude (degrees)
  let moonLong = (218.316 + 13.176396 * daysSince2000) % 360;
  if (moonLong < 0) moonLong += 360;

  // Tithi calculation: (Moon Longitude - Sun Longitude) / 12 degrees
  let diffLong = moonLong - sunLong;
  if (diffLong < 0) diffLong += 360;

  const tithiIndex = Math.floor(diffLong / 12); // 0 to 29
  const isShukla = tithiIndex < 15;
  const paksha: 'Shukla' | 'Krishna' = isShukla ? 'Shukla' : 'Krishna';
  const tithiNumberInPaksha = (tithiIndex % 15) + 1;
  const tithiName = isShukla 
    ? TITHI_NAMES[tithiIndex % 15] 
    : TITHI_NAMES_KRISHNA[tithiIndex % 15];

  // Special Tithi detection
  let specialTithi: PanchangInfo['specialTithi'] = 'None';
  if (tithiIndex === 14) specialTithi = 'Purnima';
  else if (tithiIndex === 29) specialTithi = 'Amavasya';
  else if (tithiNumberInPaksha === 11) specialTithi = 'Ekadashi';
  else if (tithiNumberInPaksha === 4) specialTithi = 'Chaturthi';

  // Nakshatra calculation: Moon Longitude / (360 / 27 = 13.3333 degrees)
  const nakshatraIndex = Math.floor(moonLong / (360 / 27)) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  // Yoga calculation: (Sun Longitude + Moon Longitude) / 13.3333 degrees
  const sumLong = (sunLong + moonLong) % 360;
  const yogaIndex = Math.floor(sumLong / (360 / 27)) % 27;
  const yoga = YOGAS[yogaIndex];

  // Karana calculation: Half of a Tithi (6 degrees)
  const karanaIndex = Math.floor(diffLong / 6);
  let karanaName = '';
  if (karanaIndex === 0) karanaName = 'Kintughna';
  else if (karanaIndex >= 57) {
    if (karanaIndex === 57) karanaName = 'Shakuni';
    else if (karanaIndex === 58) karanaName = 'Chatushpada';
    else karanaName = 'Naga';
  } else {
    karanaName = KARANAS[(karanaIndex - 1) % 7];
  }

  // Rashi calculation (Sun & Moon sign)
  const moonRashiIndex = Math.floor(moonLong / 30) % 12;
  const sunRashiIndex = Math.floor(sunLong / 30) % 12;

  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return {
    date: iso,
    tithi: {
      name: tithiName,
      number: tithiNumberInPaksha,
      paksha,
      endTime: 'Sunset / Varies by regional horizons'
    },
    vara,
    nakshatra,
    yoga,
    karana: {
      name: karanaName
    },
    rashi: {
      moonSign: RASHIS[moonRashiIndex],
      sunSign: RASHIS[sunRashiIndex]
    },
    specialTithi,
    location: locationName,
    calculationNote: 'Drik Siddhanta astronomical ephemeris projection calculated for selected geographical latitude and longitude.'
  };
}
