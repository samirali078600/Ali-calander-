import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Filter, 
  Layers, 
  CheckCircle2, 
  Compass,
  List,
  Grid,
  Columns
} from 'lucide-react';
import { CalendarEvent, CalendarViewMode, UserSettings } from '../../types';
import { 
  formatDateToISO, 
  getMonthDaysMatrix, 
  isSameDay, 
  getDaysInMonth,
  isLeapYear,
  DAY_NAMES_FULL,
  MONTH_NAMES
} from '../../utils/dateCalculations';
import { getHolidaysForDate } from '../../data/holidaysData';
import { getFestivalsForDate } from '../../data/festivalsData';

interface CalendarViewProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  events: CalendarEvent[];
  settings: UserSettings;
  onOpenAddEvent: (dateStr?: string) => void;
  onNavigateToExplorer: (date: Date) => void;
  onEditEvent: (event: CalendarEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onSelectDate,
  events,
  settings,
  onOpenAddEvent,
  onNavigateToExplorer,
  onEditEvent
}) => {
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [density, setDensity] = useState<'compact' | 'normal' | 'spacious'>(settings.calendarDensity || 'normal');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() - 1);
    else if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else if (viewMode === 'day') next.setDate(next.getDate() - 1);
    else if (viewMode === 'year') next.setFullYear(next.getFullYear() - 1);
    else next.setMonth(next.getMonth() - 1);
    onSelectDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'month') next.setMonth(next.getMonth() + 1);
    else if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else if (viewMode === 'day') next.setDate(next.getDate() + 1);
    else if (viewMode === 'year') next.setFullYear(next.getFullYear() + 1);
    else next.setMonth(next.getMonth() + 1);
    onSelectDate(next);
  };

  const handleToday = () => {
    onSelectDate(new Date());
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    if (selectedCategoryFilter === 'all') return events;
    return events.filter(e => e.category === selectedCategoryFilter);
  }, [events, selectedCategoryFilter]);

  // Month Matrix
  const monthMatrix = useMemo(() => {
    return getMonthDaysMatrix(year, month, settings.firstDayOfWeek);
  }, [year, month, settings.firstDayOfWeek]);

  // Day Name headers based on first day of week
  const weekDayHeaders = useMemo(() => {
    const shortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    for (let i = 0; i < 7; i++) {
      const idx = (settings.firstDayOfWeek + i) % 7;
      result.push(shortNames[idx]);
    }
    return result;
  }, [settings.firstDayOfWeek]);

  // Week days for week view
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = (day - settings.firstDayOfWeek + 7) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate, settings.firstDayOfWeek]);

  return (
    <div id="main-calendar-container" className="space-y-4 animate-fade-in">
      {/* Top Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation & Header */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              id="cal-prev-btn"
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
              title="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="cal-today-btn"
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              Today
            </button>
            <button
              id="cal-next-btn"
              onClick={handleNext}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-all"
              title="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {MONTH_NAMES[month]} {year}
          </h2>
        </div>

        {/* View Mode & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Modes Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            {(['month', 'week', 'day', 'year', 'agenda'] as CalendarViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Density Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setDensity(density === 'compact' ? 'normal' : density === 'normal' ? 'spacious' : 'compact')}
              className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 hover:text-slate-900 dark:hover:text-white capitalize"
              title="Toggle Calendar Grid Density"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{density}</span>
            </button>
          </div>

          {/* Add Event Button */}
          <button
            id="cal-add-event-btn"
            onClick={() => onOpenAddEvent(formatDateToISO(currentDate))}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {weekDayHeaders.map((dayName, i) => (
              <div 
                key={dayName} 
                className={`py-2 text-xs font-bold uppercase tracking-wider ${
                  i === 0 || i === 6 ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Month Matrix Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {monthMatrix.flat().map((cell, idx) => {
              const cellDate = cell.date;
              const isCurrentMonth = cell.isCurrentMonth;
              const isToday = cell.isToday;
              const isSelected = isSameDay(cellDate, currentDate);
              const cellISO = cell.dateString;

              // Data for this cell
              const cellEvents = filteredEvents.filter(e => e.date === cellISO);
              const cellHolidays = getHolidaysForDate(cellISO, settings.stateProvince);
              const cellFestivals = getFestivalsForDate(cellISO);

              const minHeightClass = 
                density === 'compact' ? 'min-h-[75px]' :
                density === 'spacious' ? 'min-h-[135px]' : 'min-h-[105px]';

              return (
                <div
                  key={idx}
                  onClick={() => onSelectDate(cellDate)}
                  onDoubleClick={() => onOpenAddEvent(cellISO)}
                  className={`relative p-1.5 sm:p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${minHeightClass} ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm'
                      : isToday
                      ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 font-bold'
                      : isCurrentMonth
                      ? 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-950/30 opacity-40 hover:opacity-80'
                  }`}
                >
                  {/* Top Bar: Day Number & Holiday Pill */}
                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-xs sm:text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : isSelected
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                          : isCurrentMonth 
                          ? 'text-slate-800 dark:text-slate-200' 
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayOfMonth}
                    </span>

                    {/* Explore Quick Link icon on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToExplorer(cellDate);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:opacity-100 p-1 text-slate-400 hover:text-indigo-600 transition-opacity"
                      title="Inspect full date details in Date Explorer"
                    >
                      <Compass className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Middle / Tags: Holidays & Festivals */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {cellHolidays.slice(0, 1).map(h => (
                      <div
                        key={h.id}
                        className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold truncate bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/50"
                        title={h.name}
                      >
                        🇮🇳 {h.name}
                      </div>
                    ))}
                    {cellFestivals.slice(0, 1).map(f => (
                      <div
                        key={f.id}
                        className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold truncate bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                        title={f.name}
                      >
                        ✨ {f.name}
                      </div>
                    ))}

                    {/* User Events */}
                    {cellEvents.slice(0, density === 'compact' ? 1 : 2).map(evt => (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEvent(evt);
                        }}
                        className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold truncate text-white transition-transform hover:scale-[1.02] ${
                          evt.isCompleted ? 'line-through opacity-60' : ''
                        }`}
                        style={{ backgroundColor: evt.color || '#6366f1' }}
                        title={`${evt.title} (${evt.startTime || 'All day'})`}
                      >
                        {evt.startTime && <span className="font-mono mr-1">{evt.startTime}</span>}
                        {evt.title}
                      </div>
                    ))}

                    {cellEvents.length > (density === 'compact' ? 1 : 2) && (
                      <span className="text-[9px] font-bold text-slate-400 block px-1">
                        +{cellEvents.length - (density === 'compact' ? 1 : 2)} more
                      </span>
                    )}
                  </div>

                  {/* Empty Footer spacing */}
                  <div className="h-1" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {weekDays.map((wDate, idx) => {
              const wISO = formatDateToISO(wDate);
              const isToday = isSameDay(wDate, new Date());
              const isSelected = isSameDay(wDate, currentDate);
              const dayEvents = filteredEvents.filter(e => e.date === wISO);
              const dayHolidays = getHolidaysForDate(wISO, settings.stateProvince);
              const dayFestivals = getFestivalsForDate(wISO);

              return (
                <div
                  key={idx}
                  onClick={() => onSelectDate(wDate)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                    isSelected
                      ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-sm'
                      : isToday
                      ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30'
                      : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 block uppercase">
                          {wDate.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className={`text-base font-extrabold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                          {wDate.getDate()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenAddEvent(wISO);
                        }}
                        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600"
                        title="Add event on this date"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Holidays & Festivals */}
                    {dayHolidays.map(h => (
                      <div
                        key={h.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold truncate bg-orange-100 dark:bg-orange-950/80 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-900/50"
                        title={h.name}
                      >
                        🇮🇳 {h.name}
                      </div>
                    ))}
                    {dayFestivals.map(f => (
                      <div
                        key={f.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold truncate bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50"
                        title={f.name}
                      >
                        ✨ {f.name}
                      </div>
                    ))}

                    {/* Events list */}
                    <div className="space-y-1 mt-1">
                      {dayEvents.map(evt => (
                        <div
                          key={evt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEvent(evt);
                          }}
                          className={`p-1.5 rounded-lg text-[10px] font-semibold text-white truncate shadow-xs cursor-pointer hover:opacity-90 ${
                            evt.isCompleted ? 'line-through opacity-60' : ''
                          }`}
                          style={{ backgroundColor: evt.color || '#6366f1' }}
                          title={`${evt.title} (${evt.startTime || 'All day'})`}
                        >
                          {evt.startTime && <span className="font-mono mr-1 text-[9px]">{evt.startTime}</span>}
                          {evt.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 mt-auto text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToExplorer(wDate);
                      }}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AGENDA / LIST VIEW */}
      {viewMode === 'agenda' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Agenda Schedule ({filteredEvents.length} Events)
            </h3>
            <button
              onClick={() => onOpenAddEvent(formatDateToISO(currentDate))}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add New Event
            </button>
          </div>

          {filteredEvents.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No events scheduled in this range.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredEvents
                .sort((a, b) => (a.date + (a.startTime || '')).localeCompare(b.date + (b.startTime || '')))
                .map(evt => (
                  <div
                    key={evt.id}
                    onClick={() => onEditEvent(evt)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: evt.color || '#6366f1' }}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-semibold">{evt.date}</span>
                          <span>•</span>
                          <span className="font-mono">{evt.allDay ? 'All Day' : `${evt.startTime} - ${evt.endTime}`}</span>
                          {evt.location && <span>• {evt.location}</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {evt.category}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* YEAR MATRIX VIEW */}
      {viewMode === 'year' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MONTH_NAMES.map((mName, mIdx) => {
            const mMatrix = getMonthDaysMatrix(year, mIdx, settings.firstDayOfWeek);
            return (
              <div
                key={mName}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2 text-center">
                  {mName}
                </h4>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={i} className="text-slate-400 font-bold">{d}</span>
                  ))}
                  {mMatrix.flat().map((cell, cIdx) => {
                    const isCur = cell.isCurrentMonth;
                    const isTod = cell.isToday;
                    return (
                      <button
                        key={cIdx}
                        onClick={() => {
                          onSelectDate(cell.date);
                          setViewMode('month');
                        }}
                        className={`p-1 rounded font-medium ${
                          isTod
                            ? 'bg-indigo-600 text-white font-bold'
                            : isCur
                            ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      >
                        {cell.dayOfMonth}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500">Hourly timeline breakdown</p>
            </div>
            <button
              onClick={() => onNavigateToExplorer(currentDate)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Full Date Analysis</span>
            </button>
          </div>

          {/* Day Hour Slots */}
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {Array.from({ length: 24 }).map((_, hour) => {
              const hourStr = `${String(hour).padStart(2, '0')}:00`;
              const hourEvents = filteredEvents.filter(e => e.date === formatDateToISO(currentDate) && e.startTime?.startsWith(String(hour).padStart(2, '0')));
              
              return (
                <div key={hour} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/50">
                  <span className="w-14 text-xs font-mono font-bold text-slate-400">
                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                  </span>
                  <div className="flex-1 min-h-[32px] flex items-center gap-2">
                    {hourEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => onEditEvent(evt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm cursor-pointer hover:scale-[1.01] transition-transform"
                        style={{ backgroundColor: evt.color || '#6366f1' }}
                      >
                        {evt.title} ({evt.startTime} - {evt.endTime})
                      </div>
                    ))}
                    {hourEvents.length === 0 && (
                      <span className="text-[11px] text-slate-300 dark:text-slate-700 italic">No events</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
