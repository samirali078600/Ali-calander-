import React, { useState, useMemo } from 'react';
import { 
  Flag, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Info,
  Building,
  Globe
} from 'lucide-react';
import { HOLIDAYS_DATABASE, INDIAN_STATES_AND_UTS } from '../../data/holidaysData';
import { UserSettings } from '../../types';

interface HolidaysViewProps {
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  onSelectDate: (date: Date) => void;
  onNavigateToExplorer: (date: Date) => void;
}

export const HolidaysView: React.FC<HolidaysViewProps> = ({
  settings,
  onUpdateSettings,
  onSelectDate,
  onNavigateToExplorer
}) => {
  const [selectedState, setSelectedState] = useState<string>(settings.stateProvince || 'Delhi (NCT)');
  const [activeTab, setActiveTab] = useState<'all' | 'national' | 'gazetted' | 'restricted' | 'bank'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    onUpdateSettings({ ...settings, stateProvince: newState });
  };

  const filteredHolidays = useMemo(() => {
    return HOLIDAYS_DATABASE.filter(h => {
      // State matching
      const matchState = !h.stateCode || h.stateCode === 'ALL' || h.stateCode === selectedState;
      
      // Type matching
      const matchType = activeTab === 'all' || 
        (activeTab === 'national' && h.holidayType === 'national') ||
        (activeTab === 'gazetted' && (h.holidayType === 'gazetted' || h.holidayType === 'national')) ||
        (activeTab === 'restricted' && h.holidayType === 'restricted') ||
        (activeTab === 'bank' && (h.holidayType === 'gazetted' || h.holidayType === 'national' || h.holidayType === 'state'));

      // Search matching
      const matchSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        h.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchState && matchType && matchSearch;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedState, activeTab, searchQuery]);

  return (
    <div id="indian-holidays-container" className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
          <Flag className="w-3.5 h-3.5" />
          <span>Government of India & State Gazettes</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Indian National & State Holidays (2026)
        </h1>
        <p className="text-xs sm:text-sm text-orange-100 max-w-2xl leading-relaxed">
          Comprehensive verified schedule of national public holidays, Central Government gazetted holidays, restricted options, and state-specific bank holidays across all 28 States and 8 Union Territories.
        </p>
      </div>

      {/* Control Bar: State Selector & Type Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* State / UT Selector */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Select State / UT:
            </label>
            <select
              id="state-holiday-selector"
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {INDIAN_STATES_AND_UTS.map(st => (
                <option key={st.code} value={st.name}>{st.name}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search holiday name or law..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: 'all', label: 'All Holidays' },
            { id: 'national', label: '🇮🇳 National (3)' },
            { id: 'gazetted', label: '🏛️ Central Gazetted' },
            { id: 'restricted', label: '📝 Restricted' },
            { id: 'bank', label: '🏦 Bank Holidays (NI Act)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Holiday Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHolidays.map(hol => {
          const [y, m, d] = hol.date.split('-').map(Number);
          const dateObj = new Date(y, m - 1, d);
          const isNational = hol.isNationalHoliday;

          return (
            <div
              key={hol.id}
              onClick={() => onNavigateToExplorer(dateObj)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer hover:shadow-lg flex flex-col justify-between ${
                isNational
                  ? 'bg-gradient-to-br from-orange-50/70 via-white to-emerald-50/70 dark:from-orange-950/20 dark:via-slate-900 dark:to-emerald-950/20 border-orange-200 dark:border-orange-900/60 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-lg">
                    {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    hol.holidayType === 'national' 
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      : hol.holidayType === 'gazetted'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {hol.holidayType}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {hol.name}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {hol.description}
                </p>

                {hol.significance && (
                  <p className="text-[11px] text-slate-500 italic">
                    {hol.significance}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate max-w-[180px]">Source: {hol.sourceName}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  Analyze Date →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
