import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  CalendarDays,
  Hourglass,
  Scale,
  RotateCcw
} from 'lucide-react';
import { 
  formatDateToISO, 
  daysBetween, 
  addDaysToDate, 
  getBusinessDays, 
  isLeapYear, 
  getDayOfYear 
} from '../../utils/dateCalculations';

export const DateToolsView: React.FC = () => {
  const today = useMemo(() => new Date(), []);
  const todayISO = useMemo(() => formatDateToISO(today), [today]);

  // 1. Duration / Days Between
  const [diffStart, setDiffStart] = useState(todayISO);
  const [diffEnd, setDiffEnd] = useState(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 30);
    return formatDateToISO(d);
  });

  const diffResult = useMemo(() => {
    if (!diffStart || !diffEnd) return null;
    const d1 = new Date(diffStart);
    const d2 = new Date(diffEnd);
    const totalDays = Math.abs(daysBetween(d1, d2));
    const busDays = getBusinessDays(d1, d2);
    const weeks = (totalDays / 7).toFixed(1);
    const months = (totalDays / 30.4375).toFixed(1);
    const totalHours = totalDays * 24;

    return { totalDays, busDays, weeks, months, totalHours, isPast: d2 < d1 };
  }, [diffStart, diffEnd]);

  // 2. Date Offset / Add Subtract
  const [offsetStart, setOffsetStart] = useState(todayISO);
  const [offsetAmount, setOffsetAmount] = useState<number>(45);
  const [offsetUnit, setOffsetUnit] = useState<'days' | 'weeks' | 'months' | 'years'>('days');
  const [offsetDirection, setOffsetDirection] = useState<'add' | 'subtract'>('add');

  const offsetResult = useMemo(() => {
    if (!offsetStart) return null;
    const base = new Date(offsetStart);
    const multiplier = offsetDirection === 'add' ? 1 : -1;
    const resultDate = new Date(base);

    if (offsetUnit === 'days') {
      resultDate.setDate(resultDate.getDate() + (offsetAmount * multiplier));
    } else if (offsetUnit === 'weeks') {
      resultDate.setDate(resultDate.getDate() + (offsetAmount * 7 * multiplier));
    } else if (offsetUnit === 'months') {
      resultDate.setMonth(resultDate.getMonth() + (offsetAmount * multiplier));
    } else if (offsetUnit === 'years') {
      resultDate.setFullYear(resultDate.getFullYear() + (offsetAmount * multiplier));
    }

    return {
      formatted: resultDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      iso: formatDateToISO(resultDate),
      dayOfYear: getDayOfYear(resultDate)
    };
  }, [offsetStart, offsetAmount, offsetUnit, offsetDirection]);

  // 3. Age & Longevity Calculator
  const [birthDate, setBirthDate] = useState('2000-01-01');

  const ageResult = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();

    if (birth > now) return { invalid: true };

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDaysLived = daysBetween(birth, now);
    const totalHoursLived = totalDaysLived * 24;

    // Next Birthday
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const daysUntilNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDaysLived,
      totalHoursLived,
      daysUntilNextBday,
      invalid: false
    };
  }, [birthDate]);

  // 4. Leap Year & Ephemeris Checker
  const [checkYear, setCheckYear] = useState<number>(today.getFullYear());

  const leapInfo = useMemo(() => {
    const isLeap = isLeapYear(checkYear);
    const isCentury = checkYear % 100 === 0;
    const isQuadCentury = checkYear % 400 === 0;

    let explanation = '';
    if (isCentury && isQuadCentury) {
      explanation = `${checkYear} is a leap year because it is divisible by 400 (Gregorian century leap rule).`;
    } else if (isCentury && !isQuadCentury) {
      explanation = `${checkYear} is NOT a leap year because although divisible by 100, it is not divisible by 400.`;
    } else if (isLeap) {
      explanation = `${checkYear} is a leap year with 366 days (February has 29 days).`;
    } else {
      explanation = `${checkYear} is a common year with 365 days (February has 28 days).`;
    }

    return { isLeap, explanation, days: isLeap ? 366 : 365 };
  }, [checkYear]);

  return (
    <div id="date-tools-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-indigo-800/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-blue-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-blue-400/20 text-blue-300">
          <Calculator className="w-3.5 h-3.5" />
          <span>Precision Chronological & Calendrical Utilities</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Date & Time Calculators
        </h1>
        <p className="text-xs sm:text-sm text-blue-200/90 max-w-2xl leading-relaxed">
          Perform exact business day exclusions, project milestone durations, date offsets, exact age breakdown, and calendar century mechanics.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: Days Between & Business Days */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Duration & Business Days
              </h2>
              <p className="text-xs text-slate-500">
                Calculate total calendar days, working days (Mon–Fri), and weeks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={diffStart}
                onChange={(e) => setDiffStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={diffEnd}
                onChange={(e) => setDiffEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {diffResult && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Days</span>
                  <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                    {diffResult.totalDays}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Business Days</span>
                  <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {diffResult.busDays}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/30 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">Weeks</span>
                  <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                    {diffResult.weeks}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center">
                Equivalent to approximately {diffResult.months} months ({diffResult.totalHours.toLocaleString()} hours).
              </p>
            </div>
          )}
        </div>

        {/* Tool 2: Add or Subtract Days / Offset */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Hourglass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Add or Subtract From Date
              </h2>
              <p className="text-xs text-slate-500">
                Find target milestone date given an offset in days, weeks, or months.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Base Date
              </label>
              <input
                type="date"
                value={offsetStart}
                onChange={(e) => setOffsetStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Operation</label>
                <select
                  value={offsetDirection}
                  onChange={(e) => setOffsetDirection(e.target.value as 'add' | 'subtract')}
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="add">+ Add</option>
                  <option value="subtract">- Subtract</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={offsetAmount}
                  onChange={(e) => setOffsetAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Unit</label>
                <select
                  value={offsetUnit}
                  onChange={(e) => setOffsetUnit(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>
          </div>

          {offsetResult && (
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block">
                Calculated Target Date
              </span>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {offsetResult.formatted}
              </p>
              <p className="text-[11px] text-slate-500">
                ISO: {offsetResult.iso} • Day {offsetResult.dayOfYear} of that year
              </p>
            </div>
          )}
        </div>

        {/* Tool 3: Age & Longevity Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Exact Age & Longevity Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Precision breakdown of lived years, months, days, and next birthday countdown.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {ageResult && !ageResult.invalid && (
            <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/30 border border-pink-200/60 dark:border-pink-900/40 space-y-3">
              <div className="text-center">
                <span className="text-2xl font-black text-pink-600 dark:text-pink-400 font-mono">
                  {ageResult.years} <span className="text-xs font-sans text-slate-500">years</span> {ageResult.months} <span className="text-xs font-sans text-slate-500">months</span> {ageResult.days} <span className="text-xs font-sans text-slate-500">days</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <span className="text-[10px] text-slate-400 block">Total Days Lived</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{ageResult.totalDaysLived?.toLocaleString()}</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-pink-100 dark:border-pink-900/30">
                  <span className="text-[10px] text-slate-400 block">Next Birthday in</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400 font-mono">{ageResult.daysUntilNextBday} days</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tool 4: Leap Year & Century Rules */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Leap Year & Century Almanac
              </h2>
              <p className="text-xs text-slate-500">
                Check leap year rules, century quad-century divisibility, and day totals.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={checkYear}
              onChange={(e) => setCheckYear(parseInt(e.target.value) || 2026)}
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-1.5">
              {[2024, 2026, 2028, 2000, 2100].map(y => (
                <button
                  key={y}
                  onClick={() => setCheckYear(y)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    checkYear === y 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Status: {leapInfo.isLeap ? '✨ Leap Year (366 days)' : 'Common Year (365 days)'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                Feb: {leapInfo.isLeap ? '29 days' : '28 days'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {leapInfo.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
