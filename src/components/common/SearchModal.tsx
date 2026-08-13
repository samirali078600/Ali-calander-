import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  Flag, 
  Globe, 
  History, 
  Cake, 
  Lightbulb, 
  Tag, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CalendarEvent } from '../../types';
import { HOLIDAYS_DATABASE } from '../../data/holidaysData';
import { FESTIVALS_DATABASE } from '../../data/festivalsData';
import { HISTORICAL_EVENTS } from '../../data/historicalEventsData';
import { FAMOUS_PERSONALITIES } from '../../data/birthdaysDeathsData';
import { DAILY_FACTS } from '../../data/dailyFactsData';
import { INTERNATIONAL_OBSERVANCES } from '../../data/observancesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  onNavigate: (section: string) => void;
}

interface SearchResultItem {
  id: string;
  type: 'event' | 'holiday' | 'festival' | 'history' | 'birthday' | 'fact' | 'observance';
  title: string;
  subtitle: string;
  dateStr?: string;
  targetSection: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  events,
  onSelectDate,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via parent
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results: SearchResultItem[] = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const list: SearchResultItem[] = [];

    // 1. Events
    for (const evt of events) {
      if (evt.title.toLowerCase().includes(q) || (evt.description && evt.description.toLowerCase().includes(q))) {
        list.push({
          id: `evt-${evt.id}`,
          type: 'event',
          title: evt.title,
          subtitle: `Personal Event • ${evt.date} ${evt.startTime ? 'at ' + evt.startTime : ''}`,
          dateStr: evt.date,
          targetSection: 'events'
        });
      }
    }

    // 2. Holidays
    for (const hol of HOLIDAYS_DATABASE) {
      if (hol.name.toLowerCase().includes(q) || hol.description.toLowerCase().includes(q)) {
        list.push({
          id: `hol-${hol.id}`,
          type: 'holiday',
          title: hol.name,
          subtitle: `Holiday (${hol.holidayType.toUpperCase()}) • ${hol.date}`,
          dateStr: hol.date,
          targetSection: 'holidays'
        });
      }
    }

    // 3. Festivals
    for (const fest of FESTIVALS_DATABASE) {
      if (fest.name.toLowerCase().includes(q) || fest.description.toLowerCase().includes(q) || fest.religion.toLowerCase().includes(q)) {
        list.push({
          id: `fest-${fest.id}`,
          type: 'festival',
          title: fest.name,
          subtitle: `Festival (${fest.religion.toUpperCase()}) • ${fest.region || 'Pan-India'}`,
          dateStr: fest.date,
          targetSection: 'festivals'
        });
      }
    }

    // 4. Historical Events
    for (const hist of HISTORICAL_EVENTS) {
      if (hist.title.toLowerCase().includes(q) || hist.description.toLowerCase().includes(q) || String(hist.year).includes(q)) {
        list.push({
          id: `hist-${hist.id}`,
          type: 'history',
          title: `${hist.year}: ${hist.title}`,
          subtitle: `Historical Milestones • Category: ${hist.category}`,
          targetSection: 'history'
        });
      }
    }

    // 5. Famous Personalities
    for (const person of FAMOUS_PERSONALITIES) {
      if (person.name.toLowerCase().includes(q) || person.profession.toLowerCase().includes(q) || person.majorContribution.toLowerCase().includes(q)) {
        list.push({
          id: `bio-${person.id}`,
          type: 'birthday',
          title: person.name,
          subtitle: `${person.profession} • Born ${person.birthDate} (${person.country})`,
          targetSection: 'birthdays'
        });
      }
    }

    // 6. Facts
    for (const fact of DAILY_FACTS) {
      if (fact.fact.toLowerCase().includes(q) || fact.category.toLowerCase().includes(q)) {
        list.push({
          id: `fact-${fact.id}`,
          type: 'fact',
          title: fact.fact,
          subtitle: `Fact of the Day • Category: ${fact.category}`,
          targetSection: 'facts'
        });
      }
    }

    // 7. Observances
    for (const obs of INTERNATIONAL_OBSERVANCES) {
      if (obs.officialName.toLowerCase().includes(q) || obs.purpose.toLowerCase().includes(q) || obs.organization.toLowerCase().includes(q)) {
        list.push({
          id: `obs-${obs.id}`,
          type: 'observance',
          title: obs.officialName,
          subtitle: `International Observance (${obs.organization})`,
          targetSection: 'holidays'
        });
      }
    }

    return list.slice(0, 15);
  }, [query, events]);

  if (!isOpen) return null;

  const handleResultClick = (item: SearchResultItem) => {
    if (item.dateStr) {
      const [y, m, d] = item.dateStr.split('-').map(Number);
      onSelectDate(new Date(y, m - 1, d));
    }
    onNavigate(item.targetSection);
    onClose();
  };

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'event': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'holiday': return <Flag className="w-4 h-4 text-orange-500" />;
      case 'festival': return <Globe className="w-4 h-4 text-emerald-500" />;
      case 'history': return <History className="w-4 h-4 text-purple-500" />;
      case 'birthday': return <Cake className="w-4 h-4 text-pink-500" />;
      case 'fact': return <Lightbulb className="w-4 h-4 text-amber-500" />;
      default: return <Tag className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div 
      id="global-search-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 sm:pt-20"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            id="search-modal-input"
            type="text"
            placeholder="Search dates, events, Indian holidays, festivals, Einstein, 15 August 1947..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 font-medium"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results / Quick Shortcuts */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Global Universal Calendar Search
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                Instant search across your schedule, Indian holidays, major world festivals, historical milestones, and astronomy.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {['Independence Day', 'Einstein', 'Diwali', 'Ramadan', 'Moon Eclipse', 'Gandhi Jayanti'].map((example) => (
                  <button
                    key={example}
                    onClick={() => setQuery(example)}
                    className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching results found for "{query}". Try a different keyword or year.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleResultClick(item)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
