import { DailyFact } from '../types';

export const DAILY_FACTS: DailyFact[] = [
  {
    id: 'fact-aug-13',
    month: 8,
    day: 13,
    category: 'human_body',
    fact: 'Left-handed people make up roughly 10% of the global population, and August 13 is celebrated worldwide as International Left-Handers Day.',
    explanation: 'Scientists have found that handedness is a polygenic trait influenced by multiple genes that establish biological brain asymmetry during early embryonic development.',
    sourceName: 'National Institutes of Health (NIH) Genetics Home Reference',
    isVerified: true
  },
  {
    id: 'fact-aug-14',
    month: 8,
    day: 14,
    category: 'space',
    fact: 'A day on Venus is longer than a year on Venus.',
    explanation: 'Venus rotates so slowly on its axis that it takes 243 Earth days to complete a single retrograde rotation, while it orbits the Sun in only 225 Earth days.',
    sourceName: 'NASA Solar System Exploration',
    sourceUrl: 'https://solarsystem.nasa.gov/planets/venus/in-depth/',
    isVerified: true
  },
  {
    id: 'fact-aug-15',
    month: 8,
    day: 15,
    category: 'india',
    fact: 'India has the world’s highest post office located in Hikkim, Himachal Pradesh at an elevation of 14,567 feet (4,440 meters).',
    explanation: 'Established in 1983, the post office connects remote Himalayan villages and allows travelers to send postcards with a special mountain elevation postal cancellation seal.',
    sourceName: 'India Post Official Documentation',
    isVerified: true
  },
  {
    id: 'fact-1',
    month: 1,
    day: 1,
    category: 'mathematics',
    fact: 'Zero is both an integer and an even number, first formally codified with arithmetic rules by Indian astronomer Brahmagupta in 628 CE.',
    explanation: 'In his magnum opus Brahmasphutasiddhanta, Brahmagupta defined zero as a distinct number with rules for addition, subtraction, and multiplication.',
    sourceName: 'MacTutor History of Mathematics Archive, University of St Andrews',
    isVerified: true
  },
  {
    id: 'fact-2',
    month: 2,
    day: 28,
    category: 'science',
    fact: 'When light passes through a transparent material, a tiny fraction of photons (1 in a million) changes wavelength — known as the Raman Effect.',
    explanation: 'This inelastic scattering of photons provides a structural fingerprint by which molecules can be identified, powering modern non-destructive Raman spectroscopy.',
    sourceName: 'American Chemical Society National Historic Chemical Landmarks',
    isVerified: true
  },
  {
    id: 'fact-3',
    month: 3,
    day: 14,
    category: 'mathematics',
    fact: 'Pi (π) has been calculated to over 100 trillion digits, yet only 39 digits are needed to calculate the circumference of the observable universe to within the precision of a hydrogen atom.',
    explanation: 'NASA’s Jet Propulsion Laboratory uses only 15 digits of Pi for its interplanetary navigation calculations.',
    sourceName: 'NASA Jet Propulsion Laboratory Edu',
    sourceUrl: 'https://www.jpl.nasa.gov/edu/news/2016/3/16/how-many-decimals-of-pi-do-we-really-need/',
    isVerified: true
  },
  {
    id: 'fact-4',
    month: 4,
    day: 22,
    category: 'geography',
    fact: 'The Amazon River discharges roughly 209,000 cubic meters of freshwater into the Atlantic Ocean every second — greater than the next seven largest rivers combined.',
    explanation: 'It accounts for approximately 20% of the total global river flow entering the oceans.',
    sourceName: 'United States Geological Survey (USGS)',
    isVerified: true
  },
  {
    id: 'fact-5',
    month: 5,
    day: 11,
    category: 'technology',
    fact: 'The computing power inside a modern smartphone is millions of times greater than the entire guidance computer that landed Apollo 11 astronauts on the Moon in 1969.',
    explanation: 'The Apollo Guidance Computer operated at 0.043 MHz with only 2,048 words of RAM, whereas typical contemporary smartphones have 8GB+ RAM running billions of cycles per second.',
    sourceName: 'MIT Museum Space Artifact Collection',
    isVerified: true
  },
  {
    id: 'fact-6',
    month: 6,
    day: 21,
    category: 'animals',
    fact: 'An octopus has three hearts, nine brains, and blue copper-based blood called hemocyanin.',
    explanation: 'Two branchial hearts pump blood to the gills, while a systemic heart pumps it through the body. A central brain coordinates with eight peripheral mini-brains in each arm.',
    sourceName: 'Natural History Museum London',
    isVerified: true
  },
  {
    id: 'fact-7',
    month: 7,
    day: 20,
    category: 'psychology',
    fact: 'The “Overview Effect” is a cognitive shift in awareness reported by astronauts when viewing the Earth from space.',
    explanation: 'Seeing Earth as a fragile, borders-free blue marble against the void of space evokes intense feelings of interconnectedness and protective environmental responsibility.',
    sourceName: 'American Psychological Association (APA)',
    isVerified: true
  }
];

export function getDailyFactForDate(month: number, day: number): DailyFact {
  const match = DAILY_FACTS.find(f => f.month === month && f.day === day);
  if (match) return match;
  // Fallback to rotating fact
  const index = (month * 31 + day) % DAILY_FACTS.length;
  return DAILY_FACTS[index];
}
