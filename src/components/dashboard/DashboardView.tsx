import React, { useMemo } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Moon, 
  Sun, 
  Flag, 
  Globe, 
  History, 
  Cake, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Flame,
  Plus,
  Compass,
  Timer,
  ShieldCheck
} from 'lucide-react';
import { CalendarEvent, CountdownItem, UserSettings } from '../../types';
import { formatDateToISO, getDayOfYear, isLeapYear } from '../../utils/dateCalculations';
import { getHolidaysForDate, HOLIDAYS_DATABASE } from '../../data/holidaysData';
import { getFestivalsForDate, FESTIVALS_DATABASE } from '../../data/festivalsData';
import { getHistoricalEventsForDate } from '../../data/historicalEventsData';
import { getBirthdaysForDate, getDeathsForDate } from '../../data/birthdaysDeathsData';
import { getDailyFactForDate } from '../../data/dailyFactsData';
import { getObservancesForDate } from '../../data/observancesData';
import { getMoonPhase, calculateSunTimes } from '../../utils/astronomyCalculations';
import { getHijriDate } from '../../utils/hijriCalculations';
import { calculatePanchang } from '../../utils/panchangCalculations';
import { YearlyStatisticsCard } from './YearlyStatisticsCard';

interface DashboardViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  countdowns: CountdownItem[];
  settings: UserSettings;
  onNavigate: (section: string) => void;
  onSelectDate: (date: Date) => void;
  onOpenAddEvent: () => void;
  onToggleEventComplete: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentDate,
  events,
  countdowns,
  settings,
  onNavigate,
  onSelectDate,
  onOpenAddEvent,
  onToggleEventComplete
}) => {
  const dateStr = formatDateToISO(currentDate);
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Year Progress calculation
  const dayOfYear = getDayOfYear(currentDate);
  const totalDaysInYear = isLeapYear(year) ? 366 : 365;
  const yearProgressPercent = ((dayOfYear / totalDaysInYear) * 100).toFixed(1);

  // Today's Data
  const todayHolidays = useMemo(() => getHolidaysForDate(dateStr, settings.stateProvince), [dateStr, settings.stateProvince]);
  const todayFestivals = useMemo(() => getFestivalsForDate(dateStr), [dateStr]);
  const todayObservances = useMemo(() => getObservancesForDate(month, day), [month, day]);
  const todayHistory = useMemo(() => getHistoricalEventsForDate(month, day), [month, day]);
  const todayBirthdays = useMemo(() => getBirthdaysForDate(month, day), [month, day]);
  const todayFact = useMemo(() => getDailyFactForDate(month, day), [month, day]);
  const moonPhase = useMemo(() => getMoonPhase(currentDate), [currentDate]);
  const sunTimes = useMemo(() => calculateSunTimes(currentDate, 28.6139, 77.2090), [currentDate]); // Delhi default
  const hijri = useMemo(() => getHijriDate(currentDate), [currentDate]);
  const panchang = useMemo(() => calculatePanchang(currentDate), [currentDate]);

  // Today & Upcoming Events
  const todayEvents = useMemo(() => {
    return events.filter(e => e.date === dateStr);
  }, [events, dateStr]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter(e => e.date >= dateStr && !e.isCompleted)
      .sort((a, b) => (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')))
      .slice(0, 5);
  }, [events, dateStr]);

  return (
    <div id="dashboard-container" className="space-y-6 animate-fade-in">
      {/* 1. Top Hero Card: Date, Calendar systems & Year Progress */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left: Gregorian & Sacred Date Identifiers */}
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Today’s Universal Ephemeris</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h1>
              <p className="text-indigo-200/90 text-xs sm:text-sm mt-1 font-medium">
                Day {dayOfYear} of {totalDaysInYear} • Week {Math.ceil(dayOfYear / 7)} • {totalDaysInYear - dayOfYear} days remaining in {year}
              </p>
            </div>

            {/* Multi-System Parallel Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 shrink-0">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-200 block">
                    Islamic Hijri
                  </span>
                  <span className="text-xs font-bold text-white">
                    {hijri.formatted}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200 block">
                    Vedic Panchang
                  </span>
                  <span className="text-xs font-bold text-white">
                    {panchang.tithi.name} • {panchang.nakshatra.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Year Progress & Quick Action */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-indigo-100 mb-1.5">
                <span>{year} Year Progress</span>
                <span>{yearProgressPercent}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 via-indigo-300 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${yearProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-indigo-200 pt-1">
              <span>Moon Phase:</span>
              <span className="font-bold text-white">{moonPhase.name} ({moonPhase.phasePercentage}%)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="hero-explore-date-btn"
                onClick={() => onNavigate('date-explorer')}
                className="w-full py-2 px-3 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Explore Date</span>
              </button>
              <button
                id="hero-add-event-btn"
                onClick={onOpenAddEvent}
                className="w-full py-2 px-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Event</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. "What's Special Today?" Multi-Faceted Breakdown */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                What’s Special Today?
              </h2>
              <p className="text-xs text-slate-500">
                Verified occurrences, celebrations, and historical milestones for {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('date-explorer')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Full Analysis</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Holidays & Festivals */}
          <div className="p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-800 dark:text-orange-300">
              <Flag className="w-4 h-4 text-orange-600" />
              <span>Holidays & Festivals</span>
            </div>
            {todayHolidays.length > 0 || todayFestivals.length > 0 ? (
              <div className="space-y-1.5">
                {todayHolidays.map(h => (
                  <div key={h.id} className="text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{h.name}</p>
                    <p className="text-[11px] text-slate-500">{h.description}</p>
                  </div>
                ))}
                {todayFestivals.map(f => (
                  <div key={f.id} className="text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{f.name}</p>
                    <p className="text-[11px] text-slate-500">{f.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                No statutory gazetted holiday today. Working day in {settings.stateProvince}.
              </p>
            )}
          </div>

          {/* Observances & UN Days */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-800 dark:text-blue-300">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>International Observances</span>
            </div>
            {todayObservances.length > 0 ? (
              <div className="space-y-1.5">
                {todayObservances.map(obs => (
                  <div key={obs.id} className="text-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{obs.officialName}</p>
                    <p className="text-[11px] text-slate-500">{obs.purpose}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                International Left-Handers Day & World Organ Donation Awareness Day.
              </p>
            )}
          </div>

          {/* Historical Spotlight */}
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
              <History className="w-4 h-4 text-purple-600" />
              <span>History Highlight</span>
            </div>
            {todayHistory.length > 0 ? (
              <div className="text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {todayHistory[0].year}: {todayHistory[0].title}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {todayHistory[0].description}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                1961: Construction of the Berlin Wall begins in Germany.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Yearly Statistics & Quarterly Event Breakdown */}
      <YearlyStatisticsCard
        currentDate={currentDate}
        events={events}
        settings={settings}
        onNavigateToCalendar={(targetDate) => {
          onSelectDate(targetDate);
          onNavigate('calendar');
        }}
        onNavigateToEvents={() => onNavigate('events')}
      />

      {/* 4. Main Two-Column Grid: Today's Tasks vs Countdowns & Facts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Scheduled Events & Quick Planner */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Today’s Schedule ({todayEvents.length})
                  </h3>
                  <p className="text-xs text-slate-500">Your personalized schedule for today</p>
                </div>
              </div>
              <button
                id="add-event-today-btn"
                onClick={onOpenAddEvent}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            {todayEvents.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  No events scheduled for today. Enjoy your day or add a task!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayEvents.map(evt => (
                  <div
                    key={evt.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      evt.isCompleted
                        ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleEventComplete(evt.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        <CheckCircle2 className={`w-5 h-5 ${evt.isCompleted ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                      </button>
                      <div>
                        <h4 className={`text-xs font-bold text-slate-900 dark:text-white ${evt.isCompleted ? 'line-through' : ''}`}>
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" />
                            {evt.allDay ? 'All Day' : evt.startTime}
                          </span>
                          {evt.location && <span>• {evt.location}</span>}
                          <span 
                            className="px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase text-white"
                            style={{ backgroundColor: evt.color || '#6366f1' }}
                          >
                            {evt.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Schedule Horizon */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Horizon
              </h3>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View All Events</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {upcomingEvents.map(evt => (
                <div
                  key={evt.id}
                  className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: evt.color || '#6366f1' }}
                    />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{evt.title}</p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {evt.startTime ? ` at ${evt.startTime}` : ' (All day)'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">
                    {evt.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Fact of the Day, Live Countdowns, Astronomy */}
        <div className="space-y-6">
          {/* Fact of the Day Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 rounded-3xl p-6 border border-amber-200/80 dark:border-amber-900/40 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-xs font-bold">
                <Lightbulb className="w-4 h-4" />
                <span>Fact of the Day</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {todayFact.category.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
              "{todayFact.fact}"
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {todayFact.explanation}
            </p>
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[10px] text-slate-500">
              <span>Source: {todayFact.sourceName}</span>
              <button 
                onClick={() => onNavigate('facts')}
                className="font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                More facts →
              </button>
            </div>
          </div>

          {/* Live Countdowns Widget */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <Timer className="w-4 h-4 text-indigo-600" />
                <span>Live Countdowns</span>
              </div>
              <button
                onClick={() => onNavigate('countdowns')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {countdowns.slice(0, 3).map(cd => {
                const target = new Date(cd.targetDateTime).getTime();
                const now = new Date().getTime();
                const diff = target - now;
                const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
                return (
                  <div 
                    key={cd.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{cd.title}</p>
                      <p className="text-[10px] text-slate-500">{new Date(cd.targetDateTime).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        {days}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">days left</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick AI Assistant Card */}
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-600 rounded-3xl p-5 text-white space-y-3 shadow-lg shadow-indigo-600/20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-bold">Ali Calendar AI Assistant</h4>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Ask any question about dates, schedule your exam, calculate business days, or explore historical milestones.
            </p>
            <button
              id="dashboard-open-ai-chat"
              onClick={() => onNavigate('ai')}
              className="w-full py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ask AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
