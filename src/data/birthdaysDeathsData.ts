import { FamousPersonality } from '../types';

export const FAMOUS_PERSONALITIES: FamousPersonality[] = [
  // AUGUST BIRTHDAYS & DEATHS
  {
    id: 'bio-aug-13-1',
    name: 'Annie Oakley',
    birthDate: '1860-08-13',
    birthMonth: 8,
    birthDay: 13,
    deathDate: '1926-11-03',
    profession: 'Sharpshooter & Exhibition Shooter',
    category: 'athlete',
    country: 'United States',
    shortBio: 'American sharpshooter who starred in Buffalo Bill’s Wild West show, renowned for her extraordinary marksmanship and advocacy for women’s self-defense.',
    majorContribution: 'Pioneered women’s participation in sports and shooting exhibitions worldwide.',
    sourceName: 'National Cowgirl Museum and Hall of Fame',
    isVerified: true
  },
  {
    id: 'bio-aug-13-2',
    name: 'Alfred Hitchcock',
    birthDate: '1899-08-13',
    birthMonth: 8,
    birthDay: 13,
    deathDate: '1980-04-29',
    profession: 'Film Director & Producer',
    category: 'artist',
    country: 'United Kingdom',
    shortBio: 'Universally acclaimed as the “Master of Suspense”, directing cinematic masterpieces like Psycho, Rear Window, and Vertigo.',
    majorContribution: 'Revolutionized camera movements, POV editing, psychological thriller genre, and film theory.',
    sourceName: 'British Film Institute (BFI)',
    isVerified: true
  },
  {
    id: 'bio-aug-13-3',
    name: 'Florence Nightingale',
    birthDate: '1820-05-12',
    birthMonth: 5,
    birthDay: 12,
    deathDate: '1910-08-13',
    deathMonth: 8,
    deathDay: 13,
    profession: 'Statistician & Founder of Modern Nursing',
    category: 'scientist',
    country: 'United Kingdom',
    shortBio: 'Known as “The Lady with the Lamp”, she established sanitation standards during the Crimean War and pioneered polar area diagrams in statistical epidemiology.',
    majorContribution: 'Founded the first secular nursing school at St Thomas’ Hospital and revolutionized public health statistics.',
    sourceName: 'Royal Statistical Society',
    isVerified: true
  },
  {
    id: 'bio-aug-15-1',
    name: 'Sri Aurobindo Ghosh',
    birthDate: '1872-08-15',
    birthMonth: 8,
    birthDay: 15,
    deathDate: '1950-12-05',
    profession: 'Philosopher, Yogi & Freedom Fighter',
    category: 'leader',
    country: 'India',
    shortBio: 'Indian nationalist, poet, and yogi who developed Integral Yoga and authored monumental philosophical works including The Life Divine and Savitri.',
    majorContribution: 'Founded the Sri Aurobindo Ashram and proposed the concept of spiritual human evolution towards supramental consciousness.',
    sourceName: 'Sri Aurobindo Ashram Archives, Puducherry',
    isVerified: true
  },
  {
    id: 'bio-aug-15-2',
    name: 'Vikram Sarabhai',
    birthDate: '1919-08-12',
    birthMonth: 8,
    birthDay: 12,
    deathDate: '1971-12-30',
    profession: 'Physicist & Space Pioneer',
    category: 'scientist',
    country: 'India',
    shortBio: 'Considered the Father of the Indian Space Programme, he initiated the establishment of ISRO and Physical Research Laboratory (PRL).',
    majorContribution: 'Conceived and launched India’s satellite program (Aryabhata) and pioneered educational television broadcasting (SITE).',
    sourceName: 'ISRO Official Biography',
    sourceUrl: 'https://www.isro.gov.in',
    isVerified: true
  },

  // FAMOUS SCIENTISTS & INVENTORS
  {
    id: 'bio-mar-14-1',
    name: 'Albert Einstein',
    birthDate: '1879-03-14',
    birthMonth: 3,
    birthDay: 14,
    deathDate: '1955-04-18',
    deathMonth: 4,
    deathDay: 18,
    profession: 'Theoretical Physicist',
    category: 'scientist',
    country: 'Germany / Switzerland / USA',
    shortBio: 'Developed the Special and General Theories of Relativity and received the 1921 Nobel Prize in Physics for his discovery of the law of the photoelectric effect.',
    majorContribution: 'Mass-energy equivalence formula E = mc², photon theory of light, quantum theory foundations.',
    sourceName: 'Nobel Prize Foundation',
    sourceUrl: 'https://www.nobelprize.org/prizes/physics/1921/einstein/biographical/',
    isVerified: true
  },
  {
    id: 'bio-nov-07-1',
    name: 'Marie Curie',
    birthDate: '1867-11-07',
    birthMonth: 11,
    birthDay: 7,
    deathDate: '1934-07-04',
    profession: 'Physicist & Chemist',
    category: 'scientist',
    country: 'Poland / France',
    shortBio: 'First woman to win a Nobel Prize, the first person to win two Nobel Prizes, and the only person to win Nobel Prizes in two different scientific fields (Physics 1903, Chemistry 1911).',
    majorContribution: 'Discovered the radioactive elements Polonium and Radium, developed techniques for isolating radioactive isotopes.',
    sourceName: 'Nobel Prize Foundation',
    isVerified: true
  },
  {
    id: 'bio-dec-22-1',
    name: 'Srinivasa Ramanujan',
    birthDate: '1887-12-22',
    birthMonth: 12,
    birthDay: 22,
    deathDate: '1920-04-26',
    profession: 'Mathematician',
    category: 'scientist',
    country: 'India',
    shortBio: 'Prodigious mathematical genius who made groundbreaking contributions to mathematical analysis, number theory, infinite series, and continued fractions without formal training.',
    majorContribution: 'Discovered Ramanujan prime, Ramanujan theta function, partition formulae, and mock theta functions.',
    sourceName: 'Royal Society of London',
    isVerified: true
  },
  {
    id: 'bio-oct-15-1',
    name: 'Dr. A. P. J. Abdul Kalam',
    birthDate: '1931-10-15',
    birthMonth: 10,
    birthDay: 15,
    deathDate: '2015-07-27',
    profession: 'Aerospace Scientist & 11th President of India',
    category: 'leader',
    country: 'India',
    shortBio: 'Widely known as the “Missile Man of India” and “People’s President”, he led the development of SLV-III and indigenous guided missile systems (Agni and Prithvi).',
    majorContribution: 'Directed India’s civilian space program and military missile development; inspired millions of students with his vision India 2020.',
    sourceName: 'President of India Official Archives',
    isVerified: true
  },
  {
    id: 'bio-jan-15-1',
    name: 'Martin Luther King Jr.',
    birthDate: '1929-01-15',
    birthMonth: 1,
    birthDay: 15,
    deathDate: '1968-04-04',
    profession: 'Civil Rights Leader & Minister',
    category: 'leader',
    country: 'United States',
    shortBio: 'Most prominent leader of the American civil rights movement, advocating for non-violent civil disobedience inspired by Mahatma Gandhi and delivering the “I Have a Dream” address.',
    majorContribution: 'Awarded the 1964 Nobel Peace Prize for combating racial inequality through non-violent resistance.',
    sourceName: 'The King Center Archives',
    isVerified: true
  }
];

export function getBirthdaysForDate(month: number, day: number): FamousPersonality[] {
  return FAMOUS_PERSONALITIES.filter(p => p.birthMonth === month && p.birthDay === day);
}

export function getDeathsForDate(month: number, day: number): FamousPersonality[] {
  return FAMOUS_PERSONALITIES.filter(p => p.deathMonth === month && p.deathDay === day);
}
