import { CalendarEvent, CountdownItem, UserSettings, AdminContentItem } from '../types';

const STORAGE_KEYS = {
  EVENTS: 'ali_calendar_events',
  SETTINGS: 'ali_calendar_settings',
  COUNTDOWNS: 'ali_calendar_countdowns',
  ADMIN_RECORDS: 'ali_calendar_admin_records',
  RECENT_SEARCHES: 'ali_calendar_recent_searches'
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  firstDayOfWeek: 1, // Monday
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  country: 'IN',
  stateProvince: 'Delhi',
  city: 'New Delhi',
  calendarDensity: 'normal',
  enabledReligiousCalendars: {
    islamic: true,
    hindu: true,
    christian: true,
    sikh: true,
    jain: true,
    buddhist: true,
    jewish: true,
    zoroastrian: true
  },
  enabledObservanceCategories: {
    un: true,
    health: true,
    science: true,
    environment: true,
    education: true,
    humanRights: true
  },
  notificationsEnabled: true,
  defaultReminderMinutes: 15
};

const SAMPLE_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-sample-1',
    title: 'Independence Day Flag Hoisting Ceremony',
    description: 'Attend morning community gathering and unfurl the Tiranga.',
    date: '2026-08-15',
    startTime: '08:30',
    endTime: '10:30',
    allDay: false,
    location: 'Community Park & Red Fort Broadcast',
    category: 'holiday',
    color: '#f97316',
    priority: 'high',
    reminderMinutes: 30,
    repeat: 'yearly',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'evt-sample-2',
    title: 'Product Design & Sprint Planning',
    description: 'Review calendar roadmap milestones and release demo build.',
    date: '2026-08-14',
    startTime: '11:00',
    endTime: '12:30',
    allDay: false,
    location: 'Google Meet / Conference Room A',
    category: 'work',
    color: '#3b82f6',
    priority: 'urgent',
    reminderMinutes: 15,
    repeat: 'weekly',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'evt-sample-3',
    title: 'Astronomy Club: Perseid Meteor Shower Stargazing',
    description: 'Observation of Perseid peak meteor shower with portable telescope.',
    date: '2026-08-13',
    startTime: '21:30',
    endTime: '23:30',
    allDay: false,
    location: 'Open Rooftop Observatory',
    category: 'personal',
    color: '#8b5cf6',
    priority: 'medium',
    reminderMinutes: 60,
    repeat: 'none',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'evt-sample-4',
    title: 'Annual Health Checkup & Dental Screening',
    description: 'Routine blood panel, vital signs, and dental cleaning.',
    date: '2026-08-20',
    startTime: '10:00',
    endTime: '11:30',
    allDay: false,
    location: 'City Wellness Hospital',
    category: 'health',
    color: '#10b981',
    priority: 'high',
    reminderMinutes: 1440,
    repeat: 'none',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const SAMPLE_COUNTDOWNS: CountdownItem[] = [
  {
    id: 'cd-1',
    title: 'Indian Independence Day',
    targetDateTime: '2026-08-15T00:00',
    category: 'holiday',
    color: '#f97316'
  },
  {
    id: 'cd-2',
    title: 'New Year 2027 Countdown',
    targetDateTime: '2027-01-01T00:00',
    category: 'holiday',
    color: '#3b82f6'
  },
  {
    id: 'cd-3',
    title: 'Next Solar Eclipse',
    targetDateTime: '2026-08-12T17:45',
    category: 'custom',
    color: '#8b5cf6'
  }
];

export const storageService = {
  getEvents(): CalendarEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (!data) {
        this.saveEvents(SAMPLE_EVENTS);
        return SAMPLE_EVENTS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_EVENTS;
    }
  },

  saveEvents(events: CalendarEvent[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save events', e);
    }
  },

  addEvent(event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>): CalendarEvent {
    const events = this.getEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  },

  updateEvent(updated: CalendarEvent): CalendarEvent {
    const events = this.getEvents().map(e => e.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : e);
    this.saveEvents(events);
    return updated;
  },

  deleteEvent(id: string) {
    const events = this.getEvents().filter(e => e.id !== id);
    this.saveEvents(events);
  },

  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: UserSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  getCountdowns(): CountdownItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COUNTDOWNS);
      if (!data) {
        this.saveCountdowns(SAMPLE_COUNTDOWNS);
        return SAMPLE_COUNTDOWNS;
      }
      return JSON.parse(data);
    } catch {
      return SAMPLE_COUNTDOWNS;
    }
  },

  saveCountdowns(countdowns: CountdownItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.COUNTDOWNS, JSON.stringify(countdowns));
    } catch (e) {
      console.error('Failed to save countdowns', e);
    }
  },

  addCountdown(cd: Omit<CountdownItem, 'id'>): CountdownItem {
    const list = this.getCountdowns();
    const item: CountdownItem = {
      ...cd,
      id: `cd-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    list.push(item);
    this.saveCountdowns(list);
    return item;
  },

  deleteCountdown(id: string) {
    const list = this.getCountdowns().filter(c => c.id !== id);
    this.saveCountdowns(list);
  },

  getAdminRecords(): AdminContentItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_RECORDS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveAdminRecords(records: AdminContentItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Failed to save admin records', e);
    }
  },

  exportFullJSON(): string {
    const backup = {
      app: 'Ali Calendar',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      events: this.getEvents(),
      settings: this.getSettings(),
      countdowns: this.getCountdowns()
    };
    return JSON.stringify(backup, null, 2);
  },

  importFullJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.events)) {
        this.saveEvents(parsed.events);
      }
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      if (Array.isArray(parsed.countdowns)) {
        this.saveCountdowns(parsed.countdowns);
      }
      return true;
    } catch (e) {
      console.error('Invalid JSON backup', e);
      return false;
    }
  },

  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.EVENTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.COUNTDOWNS);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_RECORDS);
  }
};
