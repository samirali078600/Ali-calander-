import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Sparkles, 
  Calendar, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { HISTORICAL_EVENTS } from '../../data/historicalEventsData';
import { formatDateToISO } from '../../utils/dateCalculations';

interface OnThisDayViewProps {
  currentDate: Date;
  onNavigateToExplorer: (date: Date) => void;
}

export const OnThisDayView: React.FC<OnThisDayViewProps> = ({
  currentDate,
  onNavigateToExplorer
}) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return HISTORICAL_EVENTS.filter(evt => {
      const matchDate = evt.month === selectedMonth && evt.day === selectedDay;
      const matchCat = categoryFilter === 'all' || evt.category === categoryFilter;
      const matchSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(evt.year).includes(searchQuery);

      if (searchQuery.trim() !== '') {
        return (matchCat && matchSearch);
      }
      return matchDate && matchCat;
    }).sort((a, b) => b.year - a.year);
  }, [selectedMonth, selectedDay, categoryFilter, searchQuery]);

  return (
    <div id="on-this-day-container" className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-purple-800/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-purple-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-purple-400/20 text-purple-300">
          <History className="w-3.5 h-3.5" />
          <span>Historical Chronicle Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          On This Day in History
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/90 max-w-2xl leading-relaxed">
          Explore turning points in Indian independence, world history, scientific breakthroughs, space exploration milestones, and cultural revolutions.
        </p>
      </div>

      {/* Filter & Date Selector */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Day / Month Chooser */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Date:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            >
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={31}
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-16 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search year (e.g. 1947, 1969) or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'all', label: 'All Milestones' },
            { id: 'india', label: '🇮🇳 India' },
            { id: 'world', label: '🌐 World' },
            { id: 'space', label: '🚀 Space' },
            { id: 'science', label: '🔬 Science' },
            { id: 'technology', label: '💻 Tech' },
            { id: 'culture', label: '🎨 Culture' },
            { id: 'sports', label: '🏅 Sports' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Timeline */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-500">
              No historical records indexed for this specific date filter.
            </p>
            <p className="text-[11px] text-slate-400">
              Try searching across all dates with a keyword or choosing another day.
            </p>
          </div>
        ) : (
          filteredEvents.map(evt => (
            <div
              key={evt.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex flex-col items-center justify-center shrink-0 border border-purple-200 dark:border-purple-900/50">
                  <span className="text-[10px] uppercase font-bold tracking-wider">Year</span>
                  <span className="text-base font-extrabold font-mono">{evt.year}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {evt.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {evt.month}/{evt.day}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                    {evt.description}
                  </p>

                  <p className="text-[10px] text-slate-400 pt-1">
                    Verified Source: {evt.sourceName}
                  </p>
                </div>
              </div>

              {evt.sourceUrl && (
                <a
                  href={evt.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-end md:self-center px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 shrink-0"
                >
                  <span>Read Archive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
