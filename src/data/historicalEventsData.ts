import { HistoricalEvent } from '../types';

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // AUGUST EVENTS (including today's date Aug 13 and Indian Independence Aug 15)
  {
    id: 'hist-aug-13-1',
    month: 8,
    day: 13,
    year: 1961,
    title: 'Construction of the Berlin Wall Begins',
    description: 'East German authorities begin sealing off the border with West Berlin using barbed wire and concrete blocks, dividing the city for 28 years.',
    category: 'world',
    sourceName: 'German Historical Museum',
    isVerified: true
  },
  {
    id: 'hist-aug-13-2',
    month: 8,
    day: 13,
    year: 1942,
    title: 'Disney’s Classic Film “Bambi” Premieres',
    description: 'Walt Disney’s iconic animated masterpiece Bambi has its world premiere at Radio City Music Hall in New York City.',
    category: 'culture',
    sourceName: 'Library of Congress Film Archives',
    isVerified: true
  },
  {
    id: 'hist-aug-13-3',
    month: 8,
    day: 13,
    year: 2004,
    title: 'Olympic Games Return to Athens',
    description: 'The XXVIII Summer Olympic Games officially open in Athens, Greece, returning to the birthplace of both ancient and modern Olympics.',
    category: 'sports',
    sourceName: 'International Olympic Committee (IOC)',
    isVerified: true
  },
  {
    id: 'hist-aug-15-1',
    month: 8,
    day: 15,
    year: 1947,
    title: 'India Wins Independence from British Rule',
    description: 'At the stroke of the midnight hour, India awakens to life and freedom as Jawaharlal Nehru delivers the historic “Tryst with Destiny” speech and unfurls the Tiranga at the Red Fort.',
    category: 'india',
    sourceName: 'National Archives of India',
    sourceUrl: 'https://nationalarchives.nic.in',
    isVerified: true
  },
  {
    id: 'hist-aug-15-2',
    month: 8,
    day: 15,
    year: 1972,
    title: 'Postal Index Number (PIN Code) Introduced in India',
    description: 'The Indian Postal Service launches the 6-digit PIN code system devised by Shriram Bhikaji Velankar to simplify postal sorting across the nation.',
    category: 'technology',
    sourceName: 'Department of Posts, Government of India',
    isVerified: true
  },
  {
    id: 'hist-aug-15-3',
    month: 8,
    day: 15,
    year: 1977,
    title: 'The “Wow! Signal” Detected from Deep Space',
    description: 'Astronomer Jerry R. Ehman detects a strong 72-second narrowband radio signal at the Ohio State University’s Big Ear radio telescope, circling the data with “Wow!”.',
    category: 'space',
    sourceName: 'SETI Institute Archives',
    isVerified: true
  },

  // JANUARY EVENTS
  {
    id: 'hist-jan-26-1',
    month: 1,
    day: 26,
    year: 1950,
    title: 'Constitution of India Enacted & First Republic Day',
    description: 'The Constitution of India drafted under Dr. B. R. Ambedkar comes into effect, replacing the Government of India Act 1935, and Dr. Rajendra Prasad takes oath as first President.',
    category: 'india',
    sourceName: 'Constituent Assembly Debates, Parliament of India',
    isVerified: true
  },
  {
    id: 'hist-jan-26-2',
    month: 1,
    day: 26,
    year: 1926,
    title: 'John Logie Baird Demonstrates First Working Television',
    description: 'Scottish inventor John Logie Baird gives the world’s first public demonstration of true television with moving images to members of the Royal Institution.',
    category: 'technology',
    sourceName: 'Royal Institution of Great Britain',
    isVerified: true
  },

  // FEBRUARY EVENTS
  {
    id: 'hist-feb-28-1',
    month: 2,
    day: 28,
    year: 1928,
    title: 'Sir C. V. Raman Discovers the Raman Effect',
    description: 'Indian physicist Chandrasekhara Venkata Raman discovers inelastic scattering of light (Raman Scattering) at the Indian Association for the Cultivation of Science, Kolkata, earning the 1930 Nobel Prize in Physics.',
    category: 'science',
    sourceName: 'Nobel Prize Foundation & Indian Science Congress',
    sourceUrl: 'https://www.nobelprize.org/prizes/physics/1930/raman/facts/',
    isVerified: true
  },

  // APRIL EVENTS
  {
    id: 'hist-apr-12-1',
    month: 4,
    day: 12,
    year: 1961,
    title: 'Yuri Gagarin Becomes First Human in Outer Space',
    description: 'Soviet cosmonaut Yuri Gagarin completes a single orbit around Earth aboard the Vostok 1 spacecraft, inaugurating the era of human spaceflight.',
    category: 'space',
    sourceName: 'Roscosmos & NASA History Program',
    isVerified: true
  },
  {
    id: 'hist-apr-19-1',
    month: 4,
    day: 19,
    year: 1975,
    title: 'Aryabhata — India’s First Satellite Launched',
    description: 'ISRO’s first indigenous satellite, named after the 5th-century astronomer Aryabhata, is launched from Kapustin Yar using a Soviet Kosmos-3M launch vehicle.',
    category: 'space',
    sourceName: 'Indian Space Research Organisation (ISRO)',
    sourceUrl: 'https://www.isro.gov.in',
    isVerified: true
  },

  // JULY EVENTS
  {
    id: 'hist-jul-20-1',
    month: 7,
    day: 20,
    year: 1969,
    title: 'Apollo 11 Lands on the Moon',
    description: 'Neil Armstrong and Buzz Aldrin land the Lunar Module Eagle on the Sea of Tranquility, and Armstrong steps onto the lunar surface declaring “That’s one small step for man, one giant leap for mankind.”',
    category: 'space',
    sourceName: 'NASA Mission Archives',
    sourceUrl: 'https://www.nasa.gov/mission_pages/apollo/apollo11.html',
    isVerified: true
  },

  // AUGUST EVENTS (Chandrayaan-3)
  {
    id: 'hist-aug-23-1',
    month: 8,
    day: 23,
    year: 2023,
    title: 'ISRO Chandrayaan-3 Lands on the Moon’s South Pole Region',
    description: 'India becomes the first country to land a spacecraft near the lunar south pole and the fourth country to achieve a soft landing on the Moon (observed annually as National Space Day in India).',
    category: 'space',
    sourceName: 'ISRO Official Mission Report',
    sourceUrl: 'https://www.isro.gov.in/Chandrayaan3.html',
    isVerified: true
  },

  // OCTOBER EVENTS
  {
    id: 'hist-oct-04-1',
    month: 10,
    day: 4,
    year: 1957,
    title: 'Sputnik 1 Launched into Earth Orbit',
    description: 'The Soviet Union launches the world’s first artificial satellite, Sputnik 1, triggering the Space Race and the dawn of the Space Age.',
    category: 'space',
    sourceName: 'NASA Space Science Data Coordinated Archive',
    isVerified: true
  },

  // NOVEMBER EVENTS
  {
    id: 'hist-nov-09-1',
    month: 11,
    day: 9,
    year: 1989,
    title: 'Fall of the Berlin Wall',
    description: 'Following weeks of civil unrest, East Germany announces open borders, and joyous citizens dismantle the Berlin Wall, symbolizing the end of the Cold War.',
    category: 'world',
    sourceName: 'Federal Foundation for the Reappraisal of the SED Dictatorship',
    isVerified: true
  },

  // DECEMBER EVENTS
  {
    id: 'hist-dec-17-1',
    month: 12,
    day: 17,
    year: 1903,
    title: 'Wright Brothers Make First Controlled Powered Flight',
    description: 'Orville and Wilbur Wright achieve the world’s first successful controlled, powered heavier-than-air flight with the Wright Flyer at Kitty Hawk, North Carolina.',
    category: 'technology',
    sourceName: 'Smithsonian National Air and Space Museum',
    isVerified: true
  }
];

export function getHistoricalEventsForDate(month: number, day: number): HistoricalEvent[] {
  return HISTORICAL_EVENTS.filter(evt => evt.month === month && evt.day === day);
}

export function searchHistoricalEvents(query: string): HistoricalEvent[] {
  const q = query.toLowerCase().trim();
  if (!q) return HISTORICAL_EVENTS;
  return HISTORICAL_EVENTS.filter(e => 
    e.title.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q) ||
    String(e.year).includes(q)
  );
}
