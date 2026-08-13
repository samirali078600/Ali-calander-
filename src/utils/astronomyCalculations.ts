import { AstronomyData } from '../types';

// Approximate Sun Times Calculation
export function calculateSunTimes(date: Date, lat: number = 28.6139, lng: number = 77.2090) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Solar declination (radians)
  const declination = 23.45 * Math.sin((2 * Math.PI / 365) * (dayOfYear - 81)) * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);
  
  // Hour angle
  const cosH0 = -Math.tan(latRad) * Math.tan(declination);
  let H0 = Math.acos(Math.max(-1, Math.min(1, cosH0))) * (180 / Math.PI); // degrees
  
  // Equation of Time in minutes
  const B = (2 * Math.PI / 365) * (dayOfYear - 81);
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  
  // Solar noon in hours UTC
  const solarNoonUTC = (720 - 4 * lng - EoT) / 60;
  
  // Standard timezone offset in hours
  const tzOffset = -date.getTimezoneOffset() / 60;
  const solarNoonLocal = (solarNoonUTC + tzOffset + 24) % 24;
  
  const halfDayHours = H0 / 15;
  let sunriseLocal = (solarNoonLocal - halfDayHours + 24) % 24;
  let sunsetLocal = (solarNoonLocal + halfDayHours + 24) % 24;

  const formatHoursToTime = (hrs: number) => {
    const h = Math.floor(hrs);
    const m = Math.floor((hrs - h) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
  };

  const dayLengthHours = halfDayHours * 2;
  const dayH = Math.floor(dayLengthHours);
  const dayM = Math.floor((dayLengthHours - dayH) * 60);

  return {
    sunrise: formatHoursToTime(sunriseLocal),
    sunset: formatHoursToTime(sunsetLocal),
    solarNoon: formatHoursToTime(solarNoonLocal),
    dayLength: `${dayH}h ${dayM}m`
  };
}

export const getSunTimes = calculateSunTimes;

// Moon Phase Calculation
export function getMoonPhase(date: Date) {
  // Known reference new moon: January 6, 2000, 18:14 UTC
  const refDate = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
  const synodicMonth = 29.53058867; // average days per synodic cycle

  const diffDays = (date.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24);
  const phaseCycle = (diffDays % synodicMonth + synodicMonth) % synodicMonth;
  const phaseFraction = phaseCycle / synodicMonth; // 0 to 1

  // Moon age in days
  const moonAgeDays = Math.round(phaseCycle * 10) / 10;

  // Illumination percentage (0 to 100%)
  const illumination = Math.round((0.5 * (1 - Math.cos(2 * Math.PI * phaseFraction))) * 100);

  let phaseName: AstronomyData['moonPhaseName'] = 'New Moon';
  let emoji = '🌑';

  if (phaseFraction < 0.03 || phaseFraction >= 0.97) {
    phaseName = 'New Moon';
    emoji = '🌑';
  } else if (phaseFraction < 0.22) {
    phaseName = 'Waxing Crescent';
    emoji = '🌒';
  } else if (phaseFraction < 0.28) {
    phaseName = 'First Quarter';
    emoji = '🌓';
  } else if (phaseFraction < 0.47) {
    phaseName = 'Waxing Gibbous';
    emoji = '🌔';
  } else if (phaseFraction < 0.53) {
    phaseName = 'Full Moon';
    emoji = '🌕';
  } else if (phaseFraction < 0.72) {
    phaseName = 'Waning Gibbous';
    emoji = '🌖';
  } else if (phaseFraction < 0.78) {
    phaseName = 'Last Quarter';
    emoji = '🌗';
  } else {
    phaseName = 'Waning Crescent';
    emoji = '🌘';
  }

  // Next full moon & new moon calculations
  const daysUntilNextFull = phaseFraction <= 0.5 
    ? (0.5 - phaseFraction) * synodicMonth 
    : (1.5 - phaseFraction) * synodicMonth;
  const daysUntilNextNew = (1.0 - phaseFraction) * synodicMonth;

  const nextFullDate = new Date(date.getTime() + daysUntilNextFull * 86400000);
  const nextNewDate = new Date(date.getTime() + daysUntilNextNew * 86400000);

  return {
    name: phaseName,
    moonPhaseName: phaseName,
    emoji,
    phasePercentage: illumination,
    moonIlluminationPercent: illumination,
    moonAgeDays,
    nextFullMoonDate: nextFullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    nextNewMoonDate: nextNewDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
}

export const METEOR_SHOWERS = [
  { name: 'Quadrantids', peakDate: 'Jan 3-4, 2026', rate: 'Up to 110 meteors/hr', parentBody: 'Asteroid 2003 EH1', activePeriod: 'Dec 28 - Jan 12' },
  { name: 'Lyrids', peakDate: 'Apr 21-22, 2026', rate: '15-20 meteors/hr', parentBody: 'Comet C/1861 G1 Thatcher', activePeriod: 'Apr 14 - Apr 30' },
  { name: 'Eta Aquariids', peakDate: 'May 5-6, 2026', rate: 'Up to 50 meteors/hr', parentBody: 'Halley’s Comet (1P/Halley)', activePeriod: 'Apr 19 - May 28' },
  { name: 'Perseids', peakDate: 'Aug 12-13, 2026', rate: 'Up to 100 meteors/hr', parentBody: 'Comet Swift-Tuttle', activePeriod: 'Jul 17 - Aug 24' },
  { name: 'Orionids', peakDate: 'Oct 21-22, 2026', rate: '20 meteors/hr', parentBody: 'Halley’s Comet (1P/Halley)', activePeriod: 'Oct 2 - Nov 7' },
  { name: 'Leonids', peakDate: 'Nov 17-18, 2026', rate: '15 meteors/hr (fastest)', parentBody: 'Comet Tempel-Tuttle', activePeriod: 'Nov 6 - Nov 30' },
  { name: 'Geminids', peakDate: 'Dec 13-14, 2026', rate: '120-150 meteors/hr (King of Showers)', parentBody: 'Asteroid 3200 Phaethon', activePeriod: 'Dec 4 - Dec 20' },
  { name: 'Ursids', peakDate: 'Dec 21-22, 2026', rate: '10 meteors/hr', parentBody: 'Comet 8P/Tuttle', activePeriod: 'Dec 17 - Dec 26' }
];

export const ASTRONOMICAL_EVENTS_2026 = [
  {
    title: 'Total Solar Eclipse',
    date: '2026-08-12',
    description: 'Path of totality passes across Greenland, western Iceland, and northern Spain. One of the most anticipated solar eclipses of the decade.',
    type: 'eclipse'
  },
  {
    title: 'Annular Solar Eclipse',
    date: '2026-02-17',
    description: 'Ring of fire eclipse visible across Antarctica and southern oceans.',
    type: 'eclipse'
  },
  {
    title: 'Vernal (Spring) Equinox',
    date: '2026-03-20',
    description: 'Equal day and night globally as Sun crosses the celestial equator northbound.',
    type: 'equinox'
  },
  {
    title: 'Summer Solstice',
    date: '2026-06-21',
    description: 'Longest day of the year in Northern Hemisphere; Sun reaches its highest declination.',
    type: 'solstice'
  },
  {
    title: 'Autumnal Equinox',
    date: '2026-09-23',
    description: 'Equal day and night worldwide marking the astronomical start of autumn.',
    type: 'equinox'
  },
  {
    title: 'Winter Solstice',
    date: '2026-12-21',
    description: 'Shortest day of the year in Northern Hemisphere; marks start of astronomical winter.',
    type: 'solstice'
  },
  {
    title: 'Jupiter at Opposition',
    date: '2026-01-10',
    description: 'Jupiter is closest to Earth, fully illuminated and visible all night in Gemini.',
    type: 'planetary'
  },
  {
    title: 'Saturn Ring Plane Crossing Approximation',
    date: '2026-03-23',
    description: 'Saturn’s rings appear edge-on from Earth, making them temporarily appear nearly invisible in telescope views.',
    type: 'planetary'
  }
];

export function calculateAstronomyData(date: Date, locationName: string = 'New Delhi, India', lat: number = 28.6139, lng: number = 77.2090): AstronomyData {
  const sunTimes = calculateSunTimes(date, lat, lng);
  const moonPhase = getMoonPhase(date);

  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Equinox & Solstice check
  let equinoxSolsticeInfo: string | undefined = undefined;
  if (month === 3 && (day === 20 || day === 21)) equinoxSolsticeInfo = 'Vernal (Spring) Equinox — Equal day and night across Earth';
  else if (month === 6 && (day === 20 || day === 21)) equinoxSolsticeInfo = 'Summer Solstice — Longest day of the year in Northern Hemisphere';
  else if (month === 9 && (day === 22 || day === 23)) equinoxSolsticeInfo = 'Autumnal Equinox — Equal day and night across Earth';
  else if (month === 12 && (day === 21 || day === 22)) equinoxSolsticeInfo = 'Winter Solstice — Shortest day of the year in Northern Hemisphere';

  // Major meteor shower active during the month
  let meteorShower: AstronomyData['meteorShower'] = undefined;
  if (month === 1) meteorShower = { name: 'Quadrantids', peakDate: 'Jan 3-4', rate: 'Up to 110 meteors/hr' };
  else if (month === 4) meteorShower = { name: 'Lyrids', peakDate: 'Apr 21-22', rate: '15-20 meteors/hr' };
  else if (month === 5) meteorShower = { name: 'Eta Aquariids', peakDate: 'May 5-6', rate: 'Up to 50 meteors/hr' };
  else if (month === 8) meteorShower = { name: 'Perseids', peakDate: 'Aug 12-13', rate: 'Up to 100 meteors/hr' };
  else if (month === 10) meteorShower = { name: 'Orionids', peakDate: 'Oct 21-22', rate: '20 meteors/hr' };
  else if (month === 11) meteorShower = { name: 'Leonids', peakDate: 'Nov 17-18', rate: '15 meteors/hr' };
  else if (month === 12) meteorShower = { name: 'Geminids', peakDate: 'Dec 13-14', rate: '120-150 meteors/hr (King of Showers)' };

  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  return {
    date: iso,
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    solarNoon: sunTimes.solarNoon,
    dayLength: sunTimes.dayLength,
    moonrise: '08:42 PM (Varies by latitude)',
    moonset: '07:15 AM (Varies by latitude)',
    ...moonPhase,
    equinoxSolsticeInfo,
    upcomingEclipse: {
      type: 'Solar',
      date: 'Aug 12, 2026 (Total Solar Eclipse)',
      visibility: 'Visible in Greenland, Iceland, Spain, and North Atlantic'
    },
    meteorShower,
    planetVisibilitySummary: 'Venus is brilliant in the evening dusk. Jupiter shines brightly in the eastern sky before dawn. Saturn is well placed for late night viewing.',
    location: {
      city: locationName,
      lat,
      lng
    }
  };
}
