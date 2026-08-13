import React, { useState, useMemo } from 'react';
import { 
  Moon, 
  Calendar, 
  Sparkles, 
  Info, 
  ArrowRight, 
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  Share2,
  CalendarDays
} from 'lucide-react';
import { 
  getHijriDate, 
  hijriToGregorian, 
  HIJRI_MONTHS, 
  HIJRI_MONTH_NAMES, 
  SACRED_HIJRI_MONTHS, 
  getIslamicSpecialDatesForGregorianYear,
  getIslamicSpecialDatesForHijriYear,
  getHijriMonthDays,
  ALL_ISLAMIC_FESTIVALS_TEMPLATE
} from '../../utils/hijriCalculations';
import { formatDateToISO } from '../../utils/dateCalculations';
import { IslamicSpecialEvent } from '../../types';

interface IslamicCalendarViewProps {
  currentDate: Date;
  onNavigateToExplorer: (date: Date) => void;
  onNavigateToCalendar?: (date: Date) => void;
}

export const IslamicCalendarView: React.FC<IslamicCalendarViewProps> = ({
  currentDate,
  onNavigateToExplorer,
  onNavigateToCalendar
}) => {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'calendar' | 'festivals' | 'converter' | 'months'>('calendar');

  // Year Selection
  const [selectedGregYear, setSelectedGregYear] = useState<number>(currentDate.getFullYear());
  
  // Current Today Hijri info
  const todayHijri = useMemo(() => getHijriDate(currentDate), [currentDate]);

  // Selected Hijri Month & Year for the Month Grid Calendar
  const [selectedHijriYear, setSelectedHijriYear] = useState<number>(todayHijri.hijriYear);
  const [selectedHijriMonth, setSelectedHijriMonth] = useState<number>(todayHijri.hijriMonth);

  // Festival Filters & Search
  const [festivalCategory, setFestivalCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFestivalModal, setSelectedFestivalModal] = useState<IslamicSpecialEvent | null>(null);

  // Converter States
  const [gregInput, setGregInput] = useState(formatDateToISO(currentDate));
  const [convHijriYear, setConvHijriYear] = useState<number>(todayHijri.hijriYear);
  const [convHijriMonth, setConvHijriMonth] = useState<number>(todayHijri.hijriMonth);
  const [convHijriDay, setConvHijriDay] = useState<number>(todayHijri.hijriDay);

  // Computed Hijri Month Grid
  const monthDays = useMemo(() => {
    return getHijriMonthDays(selectedHijriYear, selectedHijriMonth);
  }, [selectedHijriYear, selectedHijriMonth]);

  const currentMonthMeta = useMemo(() => {
    return HIJRI_MONTHS[selectedHijriMonth - 1] || HIJRI_MONTHS[0];
  }, [selectedHijriMonth]);

  // Dynamic Festivals for the selected Gregorian Year
  const yearIslamicEvents = useMemo(() => {
    return getIslamicSpecialDatesForGregorianYear(selectedGregYear);
  }, [selectedGregYear]);

  // Filtered Festivals
  const filteredEvents = useMemo(() => {
    return yearIslamicEvents.filter(ev => {
      const matchCat = festivalCategory === 'all' || ev.category === festivalCategory;
      const matchSearch = !searchQuery || 
        ev.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.arabicName?.includes(searchQuery) ||
        ev.hijriDate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.gregorianDate?.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [yearIslamicEvents, festivalCategory, searchQuery]);

  // Gregorian to Hijri output
  const convertedHijri = useMemo(() => {
    if (!gregInput) return null;
    const [y, m, d] = gregInput.split('-').map(Number);
    if (!y || !m || !d) return null;
    return getHijriDate(new Date(y, m - 1, d));
  }, [gregInput]);

  // Hijri to Gregorian output
  const convertedGreg = useMemo(() => {
    return hijriToGregorian(convHijriYear, convHijriMonth, convHijriDay);
  }, [convHijriYear, convHijriMonth, convHijriDay]);

  // Month navigation handlers
  const handlePrevHijriMonth = () => {
    if (selectedHijriMonth === 1) {
      setSelectedHijriMonth(12);
      setSelectedHijriYear(prev => prev - 1);
    } else {
      setSelectedHijriMonth(prev => prev - 1);
    }
  };

  const handleNextHijriMonth = () => {
    if (selectedHijriMonth === 12) {
      setSelectedHijriMonth(1);
      setSelectedHijriYear(prev => prev + 1);
    } else {
      setSelectedHijriMonth(prev => prev + 1);
    }
  };

  const handleJumpToTodayHijri = () => {
    setSelectedHijriYear(todayHijri.hijriYear);
    setSelectedHijriMonth(todayHijri.hijriMonth);
  };

  return (
    <div id="islamic-calendar-container" className="space-y-6 animate-fade-in pb-12">
      {/* 1. Hero Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 px-3.5 py-1.5 rounded-full w-fit backdrop-blur-sm border border-emerald-400/20 text-emerald-300">
              <Moon className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>Comprehensive Islamic Hijri Almanac & Ephemeris</span>
            </div>

            {/* Quick Today Badge */}
            <button
              onClick={handleJumpToTodayHijri}
              className="px-3 py-1 text-xs font-bold bg-white/10 hover:bg-white/20 text-emerald-200 rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Jump to Current Hijri Month</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                Current Hijri Lunar Date
              </span>
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {todayHijri.formatted}
                </h1>
                <span className="text-xl sm:text-2xl font-serif text-emerald-300 font-normal dir-rtl" dir="rtl">
                  {todayHijri.formattedArabic}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-emerald-200/90 font-medium">
                  Month: <strong className="text-white">{todayHijri.monthName}</strong> ({todayHijri.monthNumber} of 12)
                </span>
                <span className="text-emerald-400/60">•</span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  todayHijri.isHolyMonth 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  {todayHijri.isHolyMonth ? '🌟 Sacred Month (Al-Ashhur Al-Hurum)' : 'Standard Lunar Month'}
                </span>
              </div>
            </div>

            {/* Moon Sighting Advisory Box */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Ru’yah (Moon Sighting) Protocol</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Dates are calculated according to standard astronomical lunar algorithmic projection (Umm al-Qura standard). Actual festival dates may vary by ±1 to 2 days based on verified regional crescent moon visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Hijri Month Calendar</span>
          </button>

          <button
            onClick={() => setActiveTab('festivals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'festivals'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>All Islamic Festivals ({yearIslamicEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('converter')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'converter'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ArrowRight className="w-4 h-4" />
            <span>Date Converter</span>
          </button>

          <button
            onClick={() => setActiveTab('months')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'months'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>12 Islamic Months Guide</span>
          </button>
        </div>

        {/* Global Year Filter */}
        <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Year:</span>
          <select
            value={selectedGregYear}
            onChange={(e) => setSelectedGregYear(Number(e.target.value))}
            className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2035, 2040].map(y => (
              <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                Solar {y} (AH ~{y - 579})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: HIJRI MONTH CALENDAR GRID */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Month & Year Navigation Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevHijriMonth}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                  title="Previous Hijri Month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {currentMonthMeta.name} {selectedHijriYear} AH
                    </h2>
                    <span className="text-lg font-serif text-emerald-600 dark:text-emerald-400" dir="rtl">
                      {currentMonthMeta.arabic}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Month {selectedHijriMonth} of 12 • {currentMonthMeta.significance}
                  </p>
                </div>

                <button
                  onClick={handleNextHijriMonth}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700 transition-colors"
                  title="Next Hijri Month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Month & Year Jump Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedHijriMonth}
                  onChange={(e) => setSelectedHijriMonth(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                >
                  {HIJRI_MONTHS.map(m => (
                    <option key={m.number} value={m.number}>
                      {m.number}. {m.name} ({m.arabic})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1350}
                  max={1550}
                  value={selectedHijriYear}
                  onChange={(e) => setSelectedHijriYear(Number(e.target.value))}
                  className="w-24 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                  title="Hijri Year"
                />
              </div>
            </div>

            {/* Month Virtues Banner */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
              currentMonthMeta.holy 
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200' 
                : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Info className="w-4 h-4 shrink-0" />
                <span>Virtues & Spiritual Significance of {currentMonthMeta.name}:</span>
              </div>
              <p>{currentMonthMeta.virtues}</p>
            </div>

            {/* Hijri Calendar Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 pt-2">
              {monthDays.map((cell) => {
                const hasEvent = cell.specialEvents.length > 0;
                
                return (
                  <div
                    key={cell.hijriDay}
                    onClick={() => onNavigateToExplorer(cell.gregorianDate)}
                    className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] group ${
                      cell.isToday
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-slate-900'
                        : hasEvent
                        ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800 hover:border-amber-400 hover:shadow-md'
                        : cell.isWhiteDay
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-300 hover:shadow-sm'
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
                    }`}
                  >
                    {/* Top Row: Hijri Day Number & Weekday */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-xl font-black ${
                          cell.isToday ? 'text-white' : 'text-slate-900 dark:text-white'
                        }`}>
                          {cell.hijriDay}
                        </span>
                        <span className={`text-[10px] font-medium ${
                          cell.isToday ? 'text-emerald-100' : 'text-slate-400'
                        }`}>
                          AH
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                          cell.isFriday 
                            ? cell.isToday ? 'text-amber-200' : 'text-emerald-600 dark:text-emerald-400'
                            : cell.isToday ? 'text-emerald-200' : 'text-slate-400'
                        }`}>
                          {cell.dayOfWeek}
                        </span>
                        {cell.isFriday && (
                          <span className={`text-[9px] font-bold px-1 rounded ${
                            cell.isToday ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                          }`}>
                            Jumu’ah
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle: Badges for Fasting / Events */}
                    <div className="my-1.5 space-y-1">
                      {cell.isWhiteDay && !hasEvent && (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md block text-center ${
                          cell.isToday 
                            ? 'bg-white/20 text-emerald-100' 
                            : 'bg-teal-100/80 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                        }`}>
                          Ayyam al-Beed (White Fast)
                        </span>
                      )}

                      {hasEvent && (
                        <div className="space-y-0.5">
                          {cell.specialEvents.map(ev => (
                            <span 
                              key={ev.id}
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md block leading-tight truncate ${
                                cell.isToday
                                  ? 'bg-amber-400 text-slate-900'
                                  : 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border border-amber-300/60 dark:border-amber-700'
                              }`}
                              title={ev.name}
                            >
                              🌟 {ev.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom: Corresponding Gregorian Date */}
                    <div className="pt-1 border-t border-slate-200/40 dark:border-slate-700/50 flex items-center justify-between text-[10px]">
                      <span className={cell.isToday ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}>
                        {cell.gregorianDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className={`group-hover:translate-x-0.5 transition-transform ${
                        cell.isToday ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                      }`}>
                        →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
                <span>Today's Date</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-200 dark:bg-amber-900 inline-block border border-amber-400" />
                <span>Major Islamic Festival / Holy Night</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-teal-100 dark:bg-teal-950 inline-block border border-teal-300" />
                <span>Ayyam al-Beed (13th, 14th, 15th Recommended Sunnah Fast)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Jumu’ah:</span>
                <span>Blessed Friday Prayer</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL ISLAMIC FESTIVALS & SACRED DATES ALMANAC */}
      {activeTab === 'festivals' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Complete Islamic Festivals & Holy Occasions ({selectedGregYear})</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Dynamic calculations for all Eid celebrations, sacred nights, fasting milestones, Hajj days, and historical anniversaries.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search festival (e.g. Ramadan, Eid, Ashura)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {[
                { id: 'all', label: 'All Occasions' },
                { id: 'eid', label: '🕌 Eid Celebrations' },
                { id: 'holy_night', label: '✨ Blessed Holy Nights' },
                { id: 'fasting', label: '🌙 Fasting & Ramadan' },
                { id: 'hajj', label: '🕋 Hajj & Dhu al-Hijjah' },
                { id: 'commemoration', label: '📜 Commemorations & History' },
                { id: 'sacred_month', label: '⭐ Sacred Month Starts' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFestivalCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    festivalCategory === cat.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Festival Grid Cards */}
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">No Islamic festivals matching your search filter for {selectedGregYear}.</p>
                <button
                  onClick={() => { setFestivalCategory('all'); setSearchQuery(''); }}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => {
                  const [y, m, d] = event.gregorianDate.split('-').map(Number);
                  const dObj = new Date(y, m - 1, d);

                  return (
                    <div
                      key={event.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        {/* Top: Hijri Date & Gregorian Date */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                            {event.hijriDate}
                          </span>
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                            {dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Event Name & Arabic Name */}
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                            {event.name}
                          </h3>
                          {event.arabicName && (
                            <span className="text-xs font-serif text-emerald-700 dark:text-emerald-400 block mt-0.5 dir-rtl" dir="rtl">
                              {event.arabicName}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {event.description}
                        </p>

                        {/* Significance / Rituals Tag */}
                        {event.ritualsOrSunnah && (
                          <div className="p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-300 space-y-1">
                            <span className="font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-500" />
                              <span>Sunnah & Recommended Rituals:</span>
                            </span>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
                              {event.ritualsOrSunnah}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedFestivalModal(event)}
                          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>

                        <button
                          onClick={() => onNavigateToExplorer(dObj)}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                        >
                          <span>Explore Date</span>
                          <span>→</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE TWO-WAY CONVERTER */}
      {activeTab === 'converter' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gregorian to Hijri */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Solar (Gregorian) to Lunar (Hijri)
                </h3>
                <p className="text-xs text-slate-500">Convert any solar date into its exact Hijri equivalent.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Select Gregorian Date:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={gregInput}
                  onChange={(e) => setGregInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => setGregInput(formatDateToISO(new Date()))}
                  className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-200 shrink-0"
                >
                  Today
                </button>
              </div>
            </div>

            {convertedHijri && (
              <div className="p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 block">
                    Calculated Islamic Lunar Date
                  </span>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {convertedHijri.formatted}
                  </p>
                  <p className="text-lg font-serif text-emerald-700 dark:text-emerald-400 mt-0.5" dir="rtl">
                    {convertedHijri.formattedArabic}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Month Number:</span>
                    <strong className="text-slate-800 dark:text-slate-200">Month {convertedHijri.monthNumber} of 12</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Sacred Month:</span>
                    <strong className={convertedHijri.isHolyMonth ? 'text-amber-600 font-bold' : 'text-slate-800 dark:text-slate-200'}>
                      {convertedHijri.isHolyMonth ? 'Yes (Ashhur Hurum)' : 'Standard'}
                    </strong>
                  </div>
                </div>

                {convertedHijri.specialEvent && (
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Occasion: {convertedHijri.specialEvent}</span>
                  </div>
                )}

                <button
                  onClick={() => {
                    const [y, m, d] = convertedHijri.gregorianDate.split('-').map(Number);
                    onNavigateToExplorer(new Date(y, m - 1, d));
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Date Telemetry</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          {/* Hijri to Gregorian */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lunar (Hijri) to Solar (Gregorian)
                </h3>
                <p className="text-xs text-slate-500">Calculate the corresponding solar date for any Hijri day & month.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Day (1-30)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={convHijriDay}
                  onChange={(e) => setConvHijriDay(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hijri Month
                </label>
                <select
                  value={convHijriMonth}
                  onChange={(e) => setConvHijriMonth(Number(e.target.value))}
                  className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white truncate"
                >
                  {HIJRI_MONTHS.map(m => (
                    <option key={m.number} value={m.number}>
                      {m.number}. {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Hijri Year (AH)
                </label>
                <input
                  type="number"
                  min={1350}
                  max={1600}
                  value={convHijriYear}
                  onChange={(e) => setConvHijriYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {convertedGreg && (
              <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/50 space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 block">
                    Calculated Solar (Gregorian) Date
                  </span>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                    {convertedGreg.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ISO: {formatDateToISO(convertedGreg)}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-teal-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-bold block text-teal-800 dark:text-teal-300">Observation Note:</span>
                  <p className="text-[11px] leading-relaxed">
                    Subject to regional crescent sighting. Ideal for long-term spiritual planning, Hajj scheduling, Ramadan projections, and historical conversions.
                  </p>
                </div>

                <button
                  onClick={() => onNavigateToExplorer(convertedGreg)}
                  className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Date Details</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: THE 12 ISLAMIC MONTHS DIRECTORY */}
      {activeTab === 'months' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>The 12 Holy Months of the Islamic Lunar Calendar</span>
            </h2>
            <p className="text-xs text-slate-500">
              Complete guide to month names, Arabic roots, sacred status (Al-Ashhur Al-Hurum), and religious milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {HIJRI_MONTHS.map(month => (
              <div
                key={month.number}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  month.holy
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-800 dark:text-slate-200">
                    {month.number}
                  </span>
                  {month.holy && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300/60">
                      🌟 Sacred Month
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {month.name}
                    </h3>
                    <span className="text-lg font-serif text-emerald-700 dark:text-emerald-400" dir="rtl">
                      {month.arabic}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {month.transliteration}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-slate-700 dark:text-slate-300 font-semibold">
                    {month.significance}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {month.virtues}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedHijriMonth(month.number);
                    setActiveTab('calendar');
                  }}
                  className="w-full py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-900/50 transition-colors"
                >
                  View Month in Calendar →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Festival Modal Popup */}
      {selectedFestivalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Islamic Occasion Details</span>
              </div>
              <button
                onClick={() => setSelectedFestivalModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {selectedFestivalModal.name}
                </h3>
                {selectedFestivalModal.arabicName && (
                  <span className="text-lg font-serif text-emerald-600" dir="rtl">
                    {selectedFestivalModal.arabicName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 mt-1">
                <span>{selectedFestivalModal.hijriDate}</span>
                <span>•</span>
                <span>{selectedFestivalModal.gregorianDate}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block mb-0.5">Historical & Spiritual Context:</strong>
                <p>{selectedFestivalModal.description}</p>
              </div>

              {selectedFestivalModal.significance && (
                <div>
                  <strong className="text-slate-900 dark:text-white block mb-0.5">Significance:</strong>
                  <p>{selectedFestivalModal.significance}</p>
                </div>
              )}

              {selectedFestivalModal.ritualsOrSunnah && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                  <strong className="text-emerald-900 dark:text-emerald-300 block mb-0.5">Recommended Sunnah & Traditions:</strong>
                  <p>{selectedFestivalModal.ritualsOrSunnah}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedFestivalModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const [y, m, d] = selectedFestivalModal.gregorianDate.split('-').map(Number);
                  onNavigateToExplorer(new Date(y, m - 1, d));
                  setSelectedFestivalModal(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
              >
                <span>Open in Date Explorer</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
