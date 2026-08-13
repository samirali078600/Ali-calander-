import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Bell,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react';
import { UserSettings } from '../../types';
import { formatDateToISO } from '../../utils/dateCalculations';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onOpenSearch: () => void;
  onOpenAddEvent: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  selectedDate: Date;
  onSelectToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenAddEvent,
  settings,
  onUpdateSettings,
  selectedDate,
  onSelectToday
}) => {
  const [liveTime, setLiveTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: nextTheme });
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isToday = formatDateToISO(selectedDate) === formatDateToISO(new Date());

  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button 
            id="brand-logo-button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Ali Calendar
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Plan your days. Discover every date.
              </p>
            </div>
          </button>
        </div>

        {/* Center: Live Date Ticker & Today Button */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <button
            id="today-shortcut-button"
            onClick={onSelectToday}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              isToday 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Today
          </button>
          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700" />
          <div className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <span>{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-semibold">{liveTime}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Global Search Button */}
          <button
            id="global-search-btn"
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 hover:dark:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            title="Search dates, events, holidays (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Search everything...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Quick AI Assistant Button */}
          <button
            id="quick-ai-btn"
            onClick={() => onNavigate('ai')}
            className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 hover:dark:bg-indigo-900/60 border border-indigo-200/50 dark:border-indigo-800/50 transition-colors"
            title="AI Calendar Assistant"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            title="Toggle Light / Dark Mode"
            aria-label="Toggle theme"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Settings */}
          <button
            id="header-settings-btn"
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            title="Calendar Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Add Event Button */}
          <button
            id="header-add-event-btn"
            onClick={onOpenAddEvent}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/30 hover:shadow-md hover:shadow-indigo-600/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};
