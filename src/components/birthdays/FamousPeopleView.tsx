import React, { useState, useMemo } from 'react';
import { 
  Cake, 
  Search, 
  Sparkles, 
  ExternalLink, 
  MapPin, 
  Award,
  BookOpen
} from 'lucide-react';
import { FAMOUS_PERSONALITIES } from '../../data/birthdaysDeathsData';
import { FamousPersonality, PersonalityCategory } from '../../types';

interface FamousPeopleViewProps {
  currentDate: Date;
  onNavigateToExplorer: (date: Date) => void;
}

export const FamousPeopleView: React.FC<FamousPeopleViewProps> = ({
  currentDate,
  onNavigateToExplorer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);

  const filteredPeople = useMemo(() => {
    return FAMOUS_PERSONALITIES.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.majorContribution.toLowerCase().includes(searchQuery.toLowerCase());

      if (searchQuery.trim() !== '') {
        return matchCat && matchSearch;
      }
      return matchCat && (p.birthMonth === selectedMonth || p.deathMonth === selectedMonth);
    });
  }, [selectedCategory, searchQuery, selectedMonth]);

  return (
    <div id="famous-people-container" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-pink-800/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-pink-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-pink-400/20 text-pink-300">
          <Cake className="w-3.5 h-3.5" />
          <span>Biographical Hall of Fame</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Famous Birthdays & Personalities
        </h1>
        <p className="text-xs sm:text-sm text-pink-200/90 max-w-2xl leading-relaxed">
          Discover the pioneers, scientists, philosophers, freedom fighters, and creators who shaped human progress and history.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Month:</span>
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
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, country, Nobel Prize..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'all', label: 'All Personalities' },
            { id: 'scientist', label: '🔬 Scientists & Inventors' },
            { id: 'leader', label: '🏛️ Leaders & Philosophers' },
            { id: 'artist', label: '🎨 Artists & Cinema' },
            { id: 'athlete', label: '🏅 Athletes' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === tab.id
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPeople.map(p => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-300">
                  {p.category}
                </span>
                <span className="text-xs font-mono text-slate-500 font-bold">
                  {p.birthDate} {p.deathDate ? `– ${p.deathDate}` : ''}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {p.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{p.profession} ({p.country})</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {p.shortBio}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Key Contribution:</span>
                </div>
                <p className="text-[11px] leading-relaxed">{p.majorContribution}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate max-w-[180px]">Source: {p.sourceName}</span>
              {p.sourceUrl && (
                <a
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Biography</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
