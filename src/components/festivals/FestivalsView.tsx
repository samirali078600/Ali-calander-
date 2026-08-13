import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  BookOpen, 
  X, 
  Share2, 
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { FESTIVALS_DATABASE, getFestivalsForYear } from '../../data/festivalsData';
import { FestivalItem, ReligiousTradition } from '../../types';

interface FestivalsViewProps {
  onNavigateToExplorer: (date: Date) => void;
}

export const FestivalsView: React.FC<FestivalsViewProps> = ({
  onNavigateToExplorer
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedReligion, setSelectedReligion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalFestival, setActiveModalFestival] = useState<FestivalItem | null>(null);

  const yearFestivals = useMemo(() => {
    return getFestivalsForYear(selectedYear);
  }, [selectedYear]);

  const filteredFestivals = useMemo(() => {
    return yearFestivals.filter(f => {
      const matchRel = selectedReligion === 'all' || f.religion === selectedReligion;
      const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.region?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRel && matchSearch;
    }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [yearFestivals, selectedReligion, searchQuery]);

  return (
    <div id="festivals-encyclopedia-container" className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
          <Globe className="w-3.5 h-3.5 text-emerald-300" />
          <span>Multi-Faith Religious & Cultural Heritage</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Major Indian & Global Festivals ({selectedYear})
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed mt-1">
              Explore the spiritual history, origin legends, astronomical alignments, and rituals behind Islamic, Hindu, Sikh, Christian, Jain, Buddhist, and regional cultural celebrations.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
            <span className="text-xs font-bold text-emerald-200">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-sm font-black text-white focus:outline-none cursor-pointer"
            >
              {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2032, 2035].map(y => (
                <option key={y} value={y} className="bg-slate-900 text-white">
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Religion Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'all', label: `All Festivals (${yearFestivals.length})` },
              { id: 'islamic', label: '☪️ Islamic' },
              { id: 'hindu', label: '🕉️ Hindu' },
              { id: 'sikh', label: '☬ Sikh' },
              { id: 'christian', label: '✝️ Christian' },
              { id: 'jain', label: '☸️ Jain' },
              { id: 'buddhist', label: '☸ Buddhist' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedReligion(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedReligion === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search festival, deity, ritual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Festival Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFestivals.map(fest => {
          const [y, m, d] = (fest.date || `${selectedYear}-01-01`).split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);

          return (
            <div
              key={fest.id}
              onClick={() => setActiveModalFestival(fest)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg">
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {fest.religion}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {fest.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {fest.description}
                </p>

                {fest.region && (
                  <p className="text-[11px] text-slate-400">
                    📍 Observed in: {fest.region}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <span>View Full Origin & Rituals</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Festival Detail Modal */}
      {activeModalFestival && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveModalFestival(null)}
        >
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200">
                  {activeModalFestival.religion}
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {activeModalFestival.date}
                </span>
              </div>
              <button 
                onClick={() => setActiveModalFestival(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeModalFestival.name}
              </h2>
              {activeModalFestival.region && (
                <p className="text-xs text-slate-500 mt-0.5">
                  Region: {activeModalFestival.region}
                </p>
              )}
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white">Overview & Meaning</h4>
                <p>{activeModalFestival.description}</p>
              </div>

              {activeModalFestival.history && (
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300">Historical & Spiritual Origin</h4>
                  <p>{activeModalFestival.history}</p>
                </div>
              )}

              {activeModalFestival.significance && (
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-1">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Spiritual Significance</h4>
                  <p>{activeModalFestival.significance}</p>
                </div>
              )}

              {activeModalFestival.rituals && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Customs, Rituals & Celebrations</h4>
                  <p>{activeModalFestival.rituals}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                Source: {activeModalFestival.sourceName}
              </span>
              <button
                onClick={() => {
                  const [y, m, d] = (activeModalFestival.date || `${selectedYear}-01-01`).split('-').map(Number);
                  onNavigateToExplorer(new Date(y, m - 1, d));
                  setActiveModalFestival(null);
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors"
              >
                Inspect in Date Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

