import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  PieChart, 
  Layers,
  Flag,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { CalendarEvent, UserSettings } from '../../types';
import { getDayOfYear, isLeapYear } from '../../utils/dateCalculations';
import { HOLIDAYS_DATABASE } from '../../data/holidaysData';
import { FESTIVALS_DATABASE } from '../../data/festivalsData';

interface YearlyStatisticsCardProps {
  currentDate: Date;
  events: CalendarEvent[];
  settings: UserSettings;
  onNavigateToCalendar?: (date: Date) => void;
  onNavigateToEvents?: () => void;
}

interface QuarterInfo {
  quarter: number;
  label: string;
  shortMonths: string;
  months: number[]; // 1-indexed (1-12)
  daysInQuarter: number;
  daysPassed: number;
  progressPercent: number;
  status: 'past' | 'current' | 'future';
  events: CalendarEvent[];
  completedEventsCount: number;
  pendingEventsCount: number;
  categoryCounts: Record<string, number>;
  holidayCount: number;
  festivalCount: number;
}

export const YearlyStatisticsCard: React.FC<YearlyStatisticsCardProps> = ({
  currentDate,
  events,
  settings,
  onNavigateToCalendar,
  onNavigateToEvents
}) => {
  const currentYear = currentDate.getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [activeQuarterTab, setActiveQuarterTab] = useState<number | null>(null);

  const isCurrentSelectedYear = selectedYear === currentYear;
  const totalDaysInSelectedYear = isLeapYear(selectedYear) ? 366 : 365;

  // Calculate days passed and remaining
  const daysPassed = useMemo(() => {
    if (selectedYear < currentYear) return totalDaysInSelectedYear;
    if (selectedYear > currentYear) return 0;
    return getDayOfYear(currentDate);
  }, [selectedYear, currentYear, currentDate, totalDaysInSelectedYear]);

  const daysRemaining = totalDaysInSelectedYear - daysPassed;
  const progressPercent = Number(((daysPassed / totalDaysInSelectedYear) * 100).toFixed(1));
  const currentWeekNumber = Math.min(52, Math.ceil(daysPassed / 7));
  const totalWeeks = 52;

  // Filter events for selected year
  const yearEvents = useMemo(() => {
    return events.filter(e => {
      const eYear = parseInt(e.date.split('-')[0], 10);
      return eYear === selectedYear;
    });
  }, [events, selectedYear]);

  // Quarterly statistics breakdown
  const quartersData: QuarterInfo[] = useMemo(() => {
    const leap = isLeapYear(selectedYear);
    const q1Days = leap ? 91 : 90;
    const q2Days = 91;
    const q3Days = 92;
    const q4Days = 92;

    const quarterDefinitions = [
      { quarter: 1, label: 'Quarter 1', shortMonths: 'Jan – Mar', months: [1, 2, 3], daysInQuarter: q1Days },
      { quarter: 2, label: 'Quarter 2', shortMonths: 'Apr – Jun', months: [4, 5, 6], daysInQuarter: q2Days },
      { quarter: 3, label: 'Quarter 3', shortMonths: 'Jul – Sep', months: [7, 8, 9], daysInQuarter: q3Days },
      { quarter: 4, label: 'Quarter 4', shortMonths: 'Oct – Dec', months: [10, 11, 12], daysInQuarter: q4Days }
    ];

    const currentMonth1Indexed = currentDate.getMonth() + 1;
    const currentQuarterNumber = Math.ceil(currentMonth1Indexed / 3);

    return quarterDefinitions.map(qDef => {
      // Calculate quarter status
      let status: 'past' | 'current' | 'future' = 'future';
      let qDaysPassed = 0;

      if (selectedYear < currentYear) {
        status = 'past';
        qDaysPassed = qDef.daysInQuarter;
      } else if (selectedYear > currentYear) {
        status = 'future';
        qDaysPassed = 0;
      } else {
        if (qDef.quarter < currentQuarterNumber) {
          status = 'past';
          qDaysPassed = qDef.daysInQuarter;
        } else if (qDef.quarter === currentQuarterNumber) {
          status = 'current';
          // Calculate days passed within this current quarter
          if (qDef.quarter === 1) {
            qDaysPassed = daysPassed;
          } else if (qDef.quarter === 2) {
            qDaysPassed = Math.max(0, daysPassed - q1Days);
          } else if (qDef.quarter === 3) {
            qDaysPassed = Math.max(0, daysPassed - (q1Days + q2Days));
          } else {
            qDaysPassed = Math.max(0, daysPassed - (q1Days + q2Days + q3Days));
          }
          qDaysPassed = Math.min(qDef.daysInQuarter, Math.max(0, qDaysPassed));
        } else {
          status = 'future';
          qDaysPassed = 0;
        }
      }

      const qProgress = Number(((qDaysPassed / qDef.daysInQuarter) * 100).toFixed(1));

      // Filter events in this quarter
      const qEvents = yearEvents.filter(e => {
        const parts = e.date.split('-');
        const monthNum = parseInt(parts[1], 10);
        return qDef.months.includes(monthNum);
      });

      const completed = qEvents.filter(e => e.isCompleted).length;
      const pending = qEvents.length - completed;

      const categoryCounts: Record<string, number> = {};
      qEvents.forEach(e => {
        categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
      });

      // Count holidays in this quarter
      const qHolidays = HOLIDAYS_DATABASE.filter(h => {
        if (h.year && h.year !== selectedYear) return false;
        return qDef.months.includes(h.month);
      }).length;

      // Count festivals in this quarter
      const qFestivals = FESTIVALS_DATABASE.filter(f => {
        if (!f.month) return false;
        return qDef.months.includes(f.month);
      }).length;

      return {
        ...qDef,
        daysPassed: qDaysPassed,
        progressPercent: qProgress,
        status,
        events: qEvents,
        completedEventsCount: completed,
        pendingEventsCount: pending,
        categoryCounts,
        holidayCount: qHolidays,
        festivalCount: qFestivals
      };
    });
  }, [selectedYear, currentYear, currentDate, daysPassed, yearEvents]);

  // Total events in the year
  const totalYearEventsCount = yearEvents.length;

  return (
    <div id="yearly-statistics-section" className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
      {/* 1. Header with Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs border border-indigo-100 dark:border-indigo-900/40">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Yearly Statistics & Quarterly Distribution
              </h2>
              {isCurrentSelectedYear && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Current Year
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Annual timeline trajectory, day count telemetry, and event distribution across quarters.
            </p>
          </div>
        </div>

        {/* Year Selector Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
          {[currentYear - 1, currentYear, currentYear + 1].map(yr => (
            <button
              key={yr}
              onClick={() => {
                setSelectedYear(yr);
                setActiveQuarterTab(null);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                selectedYear === yr
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Visual Annual Progress Bar & Metric Grid */}
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/40 dark:to-indigo-950/20 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                {selectedYear} Annual Progress
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {progressPercent}% <span className="text-xs font-normal text-slate-500">completed</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block font-mono">
                {daysPassed} / {totalDaysInSelectedYear} Days
              </span>
              <span className="text-[11px] text-slate-400">
                {isLeapYear(selectedYear) ? 'Leap Year (366 days)' : 'Standard Year (365 days)'}
              </span>
            </div>
          </div>

          {/* Primary Year Progress Bar with Quarter Markers */}
          <div className="space-y-1.5">
            <div className="relative w-full bg-slate-200 dark:bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            
            {/* Quarter Breakpoint Ticks */}
            <div className="grid grid-cols-4 text-[10px] font-semibold text-slate-400 pt-0.5 text-center">
              <div className="border-r border-slate-200 dark:border-slate-800 pb-0.5">
                <span>Q1 (Jan–Mar)</span>
              </div>
              <div className="border-r border-slate-200 dark:border-slate-800 pb-0.5">
                <span>Q2 (Apr–Jun)</span>
              </div>
              <div className="border-r border-slate-200 dark:border-slate-800 pb-0.5">
                <span>Q3 (Jul–Sep)</span>
              </div>
              <div>
                <span>Q4 (Oct–Dec)</span>
              </div>
            </div>
          </div>

          {/* 4 Core Summary Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Days Passed</span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{daysPassed}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
                {((daysPassed / totalDaysInSelectedYear) * 100).toFixed(0)}% elapsed
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Days Remaining</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 font-mono">{daysRemaining}</span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {((daysRemaining / totalDaysInSelectedYear) * 100).toFixed(0)}% to go
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Weeks Timeline</span>
              <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                {currentWeekNumber} <span className="text-xs text-slate-400 font-normal">/ {totalWeeks}</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {totalWeeks - currentWeekNumber} weeks left
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Scheduled</span>
              <span className="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">{totalYearEventsCount}</span>
              <span className="text-[10px] text-slate-400 block font-medium">
                {yearEvents.filter(e => e.isCompleted).length} completed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quarterly Event Distribution Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Quarterly Event Distribution & Activity
            </h3>
          </div>
          {onNavigateToEvents && (
            <button
              onClick={onNavigateToEvents}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Events</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stacked Proportional Distribution Bar */}
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
            <span>Event Share by Quarter</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {totalYearEventsCount} total events in {selectedYear}
            </span>
          </div>

          {totalYearEventsCount > 0 ? (
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden flex shadow-inner">
              {quartersData.map((q, idx) => {
                const sharePercent = totalYearEventsCount > 0 
                  ? (q.events.length / totalYearEventsCount) * 100 
                  : 25;
                if (sharePercent === 0) return null;

                const colors = [
                  'bg-blue-500',
                  'bg-indigo-500',
                  'bg-purple-500',
                  'bg-emerald-500'
                ];

                return (
                  <div
                    key={q.quarter}
                    style={{ width: `${sharePercent}%` }}
                    className={`${colors[idx % colors.length]} h-full transition-all relative group cursor-pointer`}
                    title={`Q${q.quarter}: ${q.events.length} events (${sharePercent.toFixed(1)}%)`}
                    onClick={() => setActiveQuarterTab(activeQuarterTab === q.quarter ? null : q.quarter)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full" />
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Q1 ({quartersData[0].events.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Q2 ({quartersData[1].events.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Q3 ({quartersData[2].events.length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Q4 ({quartersData[3].events.length})
            </span>
          </div>
        </div>

        {/* 4 Interactive Quarter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {quartersData.map(q => {
            const isTabActive = activeQuarterTab === q.quarter;
            const eventPercent = totalYearEventsCount > 0 
              ? Math.round((q.events.length / totalYearEventsCount) * 100) 
              : 0;

            return (
              <div
                key={q.quarter}
                onClick={() => setActiveQuarterTab(isTabActive ? null : q.quarter)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isTabActive
                    ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/30 shadow-md'
                    : q.status === 'current'
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Top: Quarter Name & Status Tag */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {q.label}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        {q.shortMonths}
                      </span>
                    </div>

                    {q.status === 'current' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center gap-1 border border-indigo-200 dark:border-indigo-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        Active
                      </span>
                    ) : q.status === 'past' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Passed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400">
                        Upcoming
                      </span>
                    )}
                  </div>

                  {/* Quarter Days Progress */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Timeline</span>
                      <span className="font-mono">{q.progressPercent}% ({q.daysPassed}/{q.daysInQuarter}d)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          q.status === 'past' 
                            ? 'bg-slate-400 dark:bg-slate-600' 
                            : q.status === 'current' 
                            ? 'bg-indigo-500' 
                            : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                        style={{ width: `${q.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Event Count & Proportions */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Events</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {q.events.length}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Year Share</span>
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        {eventPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Category Pills / Breakdown */}
                  {Object.keys(q.categoryCounts).length > 0 ? (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {Object.entries(q.categoryCounts).slice(0, 3).map(([cat, count]) => (
                        <span 
                          key={cat}
                          className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        >
                          {cat}: {count}
                        </span>
                      ))}
                      {Object.keys(q.categoryCounts).length > 3 && (
                        <span className="text-[9px] text-slate-400 self-center">
                          +{Object.keys(q.categoryCounts).length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 italic pt-1">
                      No custom events logged
                    </p>
                  )}
                </div>

                {/* Bottom Context: Holidays & Quick Calendar Jump */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Flag className="w-3 h-3 text-orange-500" />
                    {q.holidayCount} holidays
                  </span>

                  {onNavigateToCalendar && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Jump to 1st of this quarter's start month
                        const targetMonth = q.months[0] - 1;
                        onNavigateToCalendar(new Date(selectedYear, targetMonth, 1));
                      }}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                      title={`Open Calendar in ${q.label}`}
                    >
                      <span>Jump</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Quarter Event Detail Drawer (if clicked) */}
        {activeQuarterTab !== null && (
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Events in Quarter {activeQuarterTab} ({quartersData[activeQuarterTab - 1].shortMonths} {selectedYear})
                </h4>
              </div>
              <button
                onClick={() => setActiveQuarterTab(null)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                Close ✕
              </button>
            </div>

            {quartersData[activeQuarterTab - 1].events.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No events currently scheduled in Quarter {activeQuarterTab}.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                {quartersData[activeQuarterTab - 1].events.map(evt => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        {evt.date}
                      </span>
                      <span 
                        className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase text-white"
                        style={{ backgroundColor: evt.color || '#6366f1' }}
                      >
                        {evt.category}
                      </span>
                    </div>
                    <p className={`text-xs font-bold text-slate-900 dark:text-white ${evt.isCompleted ? 'line-through opacity-60' : ''}`}>
                      {evt.title}
                    </p>
                    {evt.location && (
                      <p className="text-[10px] text-slate-400 truncate">📍 {evt.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
