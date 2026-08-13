// Date calculation utilities for Ali Calendar

export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISODate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // Noon to prevent timezone shifting
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getTotalDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate();
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) + 1;
}

export function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export const getWeekNumber = getISOWeekNumber;

export function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

export interface CalendarDayCell {
  date: Date;
  dateString: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  dayOfWeek: number;
}

export function getMonthDaysMatrix(year: number, monthZeroIndexed: number, firstDayOfWeek: number = 0): CalendarDayCell[][] {
  const firstDayOfMonth = new Date(year, monthZeroIndexed, 1);
  const lastDayOfMonth = new Date(year, monthZeroIndexed + 1, 0);
  const today = new Date();

  const startDay = firstDayOfMonth.getDay(); // 0 is Sun
  let offset = (startDay - firstDayOfWeek + 7) % 7;

  const startDate = new Date(year, monthZeroIndexed, 1 - offset);
  const weeks: CalendarDayCell[][] = [];

  let currentDate = new Date(startDate);
  // Generate 6 weeks (42 days) to guarantee uniform month view matrix
  for (let w = 0; w < 6; w++) {
    const week: CalendarDayCell[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(currentDate);
      const isCurrentMonth = cellDate.getMonth() === monthZeroIndexed;
      const isTodayCell = isSameDay(cellDate, today);
      const dayOfWeek = cellDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      week.push({
        date: cellDate,
        dateString: formatDateToISO(cellDate),
        dayOfMonth: cellDate.getDate(),
        isCurrentMonth,
        isToday: isTodayCell,
        isWeekend,
        dayOfWeek
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
}

export function calculateDateDifference(d1: Date, d2: Date) {
  const t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
  const t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
  const diffTime = Math.abs(t2 - t1);
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const remainingDaysInWeeks = diffDays % 7;

  // Exact Year / Month / Day difference
  const start = t1 <= t2 ? new Date(t1) : new Date(t2);
  const end = t1 <= t2 ? new Date(t2) : new Date(t1);

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonthLastDay;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return {
    totalDays: diffDays,
    totalWeeks: diffWeeks,
    remainingDaysInWeeks,
    totalHours: diffDays * 24,
    totalMinutes: diffDays * 24 * 60,
    years,
    months,
    days,
    isFuture: t2 > t1,
    isPast: t2 < t1,
    isSame: t1 === t2
  };
}

export function daysBetween(d1: Date, d2: Date): number {
  const t1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate()).getTime();
  const t2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate()).getTime();
  return Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24));
}

export function addDaysToDate(date: Date, days: number): Date {
  const res = new Date(date);
  res.setDate(res.getDate() + days);
  return res;
}

export function calculateAge(birthDate: Date, asOfDate: Date = new Date()) {
  return calculateDateDifference(birthDate, asOfDate);
}

export function calculateBusinessDays(startDate: Date, endDate: Date, holidays: string[] = []): {
  totalDays: number;
  businessDays: number;
  weekendDays: number;
  holidayDays: number;
} {
  const start = new Date(Math.min(startDate.getTime(), endDate.getTime()));
  const end = new Date(Math.max(startDate.getTime(), endDate.getTime()));
  
  let current = new Date(start);
  let businessDays = 0;
  let weekendDays = 0;
  let holidayDays = 0;
  let totalDays = 0;

  const holidaySet = new Set(holidays);

  while (current <= end) {
    totalDays++;
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateKey = formatDateToISO(current);
    const isHoliday = holidaySet.has(dateKey);

    if (isWeekend) {
      weekendDays++;
    } else if (isHoliday) {
      holidayDays++;
    } else {
      businessDays++;
    }

    current.setDate(current.getDate() + 1);
  }

  return { totalDays, businessDays, weekendDays, holidayDays };
}

export function getBusinessDays(d1: Date, d2: Date, holidays: string[] = []): number {
  return calculateBusinessDays(d1, d2, holidays).businessDays;
}


export function addSubtractDays(baseDate: Date, days: number): Date {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}

export function addSubtractMonths(baseDate: Date, months: number): Date {
  const result = new Date(baseDate);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function formatCustomDate(date: Date, format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  }
  if (format === 'YYYY-MM-DD') {
    return `${year}-${month}-${day}`;
  }
  return `${day}/${month}/${year}`;
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const DAY_NAMES_FULL = DAY_NAMES;

export const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
