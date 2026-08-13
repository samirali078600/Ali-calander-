export type CalendarViewType = 'month' | 'week' | 'day' | 'year' | 'agenda';
export type CalendarViewMode = CalendarViewType;
export type CalendarDensity = 'compact' | 'normal' | 'spacious';
export type PersonalityCategory = 'scientist' | 'inventor' | 'artist' | 'leader' | 'athlete' | 'author' | 'musician' | 'entrepreneur' | 'historical';
export type FactCategory = 'science' | 'space' | 'technology' | 'history' | 'geography' | 'india' | 'world' | 'human_body' | 'animals' | 'mathematics' | 'psychology';
export type ReligiousTradition = 'hindu' | 'islamic' | 'christian' | 'sikh' | 'jain' | 'buddhist' | 'cultural' | 'national';


export type EventCategory = 
  | 'personal'
  | 'work'
  | 'meeting'
  | 'reminder'
  | 'birthday'
  | 'holiday'
  | 'festival'
  | 'study'
  | 'health'
  | 'travel';

export type EventPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RepeatFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  allDay?: boolean;
  location?: string;
  category: EventCategory;
  color: string;
  priority: EventPriority;
  reminderMinutes: number; // e.g. 0, 5, 15, 30, 60, 1440 (1 day)
  repeat: RepeatFrequency;
  isCompleted?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD or MM-DD for recurring
  month: number; // 1-12
  day: number; // 1-31
  year?: number;
  countryCode: string; // 'IN', 'GLOBAL', etc.
  stateCode?: string; // e.g. 'DL', 'MH', 'KA' or 'ALL'
  holidayType: 'gazetted' | 'restricted' | 'national' | 'state' | 'international' | 'observance';
  description: string;
  significance?: string;
  sourceName: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export interface FestivalItem {
  id: string;
  name: string;
  date?: string; // calculated for given year YYYY-MM-DD
  month?: number;
  day?: number;
  religion: 'hindu' | 'islamic' | 'christian' | 'sikh' | 'jain' | 'buddhist' | 'cultural' | 'national';
  region?: string;
  description: string;
  history?: string;
  significance: string;
  rituals?: string;
  sourceName: string;
  sourceUrl?: string;
  isVerified: boolean;
  isLunarBased?: boolean;
}

export interface IslamicSpecialEvent {
  id: string;
  event: string;
  name?: string;
  arabicName?: string;
  category: 'eid' | 'holy_night' | 'fasting' | 'hajj' | 'commemoration' | 'sacred_month';
  hijriDay: number;
  hijriMonth: number;
  hijriDate: string;
  gregorianDate: string; // YYYY-MM-DD
  gregorianYear?: number;
  description: string;
  significance?: string;
  ritualsOrSunnah?: string;
}

export interface IslamicDateInfo {
  gregorianDate: string;
  hijriDay: number;
  hijriMonth: number;
  hijriMonthName: string;
  hijriMonthNameArabic: string;
  hijriYear: number;
  isHolyMonth: boolean;
  isSacredMonth: boolean;
  monthName: string;
  monthNumber: number;
  formatted: string;
  formattedArabic: string;
  specialEvent?: string;
  specialEventsList?: IslamicSpecialEvent[];
  isEstimated: boolean; // clearly indicates moon sighting dependency
  disclaimer: string;
}

export interface PanchangInfo {
  date: string;
  tithi: {
    name: string;
    number: number;
    paksha: 'Shukla' | 'Krishna';
    endTime?: string;
  };
  vara: string; // Day of week (Ravivara, Somavara, etc.)
  nakshatra: {
    name: string;
    ruler: string;
    deity: string;
  };
  yoga: {
    name: string;
    meaning: string;
  };
  karana: {
    name: string;
  };
  rashi: {
    moonSign: string;
    sunSign: string;
  };
  specialTithi?: 'Purnima' | 'Amavasya' | 'Ekadashi' | 'Sankranti' | 'Chaturthi' | 'Navratri' | 'None';
  location: string;
  calculationNote: string;
}

export interface HistoricalEvent {
  id: string;
  month: number;
  day: number;
  year: number;
  title: string;
  description: string;
  category: 'india' | 'world' | 'science' | 'space' | 'technology' | 'culture' | 'politics' | 'sports';
  sourceName: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export interface FamousPersonality {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthMonth: number;
  birthDay: number;
  deathDate?: string;
  deathMonth?: number;
  deathDay?: number;
  profession: string;
  category: 'scientist' | 'inventor' | 'artist' | 'leader' | 'athlete' | 'author' | 'musician' | 'entrepreneur' | 'historical';
  country: string;
  shortBio: string;
  majorContribution: string;
  sourceName: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export interface DailyFact {
  id: string;
  month: number;
  day: number;
  category: 'science' | 'space' | 'technology' | 'history' | 'geography' | 'india' | 'world' | 'human_body' | 'animals' | 'mathematics' | 'psychology';
  fact: string;
  explanation: string;
  sourceName: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export interface InternationalObservance {
  id: string;
  officialName: string;
  month: number;
  day: number;
  organization: string; // e.g. United Nations, WHO, UNESCO, FAO
  category: 'health' | 'education' | 'science' | 'environment' | 'human_rights' | 'technology' | 'food' | 'culture' | 'women' | 'children' | 'youth';
  purpose: string;
  description: string;
  sourceName: string;
  sourceUrl?: string;
  isVerified: boolean;
}

export interface AstronomyData {
  date: string;
  sunrise: string;
  sunset: string;
  solarNoon: string;
  dayLength: string;
  moonrise: string;
  moonset: string;
  moonPhaseName: 'New Moon' | 'Waxing Crescent' | 'First Quarter' | 'Waxing Gibbous' | 'Full Moon' | 'Waning Gibbous' | 'Last Quarter' | 'Waning Crescent';
  moonIlluminationPercent: number;
  moonAgeDays: number;
  nextFullMoonDate: string;
  nextNewMoonDate: string;
  equinoxSolsticeInfo?: string;
  upcomingEclipse?: {
    type: 'Solar' | 'Lunar';
    date: string;
    visibility: string;
  };
  meteorShower?: {
    name: string;
    peakDate: string;
    rate: string;
  };
  planetVisibilitySummary: string;
  location: {
    city: string;
    lat: number;
    lng: number;
  };
}

export interface CountdownItem {
  id: string;
  title: string;
  targetDateTime: string; // ISO string YYYY-MM-DDTHH:mm
  category: 'birthday' | 'exam' | 'wedding' | 'vacation' | 'holiday' | 'deadline' | 'custom';
  color: string;
  icon?: string;
  isCompleted?: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  firstDayOfWeek: 0 | 1; // 0 for Sunday, 1 for Monday
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  country: string;
  stateProvince: string;
  city: string;
  calendarDensity: CalendarDensity;
  enabledReligiousCalendars: {
    islamic: boolean;
    hindu: boolean;
    christian: boolean;
    sikh: boolean;
    jain: boolean;
    buddhist: boolean;
    jewish: boolean;
    zoroastrian: boolean;
  };
  enabledObservanceCategories: {
    un: boolean;
    health: boolean;
    science: boolean;
    environment: boolean;
    education: boolean;
    humanRights: boolean;
  };
  notificationsEnabled: boolean;
  defaultReminderMinutes: number;
}

export interface AdminContentItem {
  id: string;
  type?: 'holiday' | 'festival' | 'fact' | 'history' | 'birthday' | 'observance';
  contentType?: 'holiday' | 'festival' | 'history' | 'birthday' | 'fact' | 'observance';
  title: string;
  dateOrKey?: string;
  date?: string;
  category?: string;
  description?: string;
  status?: 'verified' | 'pending_review' | 'rejected';
  sourceName?: string;
  sourceUrl?: string;
  lastVerifiedAt?: string;
  data?: Record<string, any>;
  isVerified?: boolean;
  createdAt?: string;
}

export interface DateDetailsData {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayName: string;
  dayNumber: number;
  monthName: string;
  monthNumber: number;
  year: number;
  weekNumber: number;
  dayOfYear: number;
  totalDaysInYear: number;
  daysPassedInYear: number;
  daysRemainingInYear: number;
  yearProgressPercent: number;
  monthProgressPercent: number;
  quarter: number;
  isLeapYear: boolean;
  islamicInfo: IslamicDateInfo;
  panchangInfo: PanchangInfo;
  astronomy: AstronomyData;
  holidays: HolidayItem[];
  festivals: FestivalItem[];
  observances: InternationalObservance[];
  historicalEvents: HistoricalEvent[];
  birthdays: FamousPersonality[];
  deaths: FamousPersonality[];
  dailyFact?: DailyFact;
  events: CalendarEvent[];
}
