import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Sparkles,
  Compass,
  Moon,
  Sun,
  History,
  Cake,
  Lightbulb,
  Telescope,
  Calculator,
  Timer,
  Settings,
  ShieldCheck,
  Flag,
  Globe
} from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  eventCount: number;
  countdownCount: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  category?: 'main' | 'cultural' | 'tools' | 'system';
}

const NAV_ITEMS: NavItem[] = [
  // Main
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'main' },
  { id: 'calendar', label: 'Main Calendar', icon: Calendar, category: 'main' },
  { id: 'events', label: 'Events & Tasks', icon: CheckSquare, category: 'main' },
  { id: 'date-explorer', label: 'Date Explorer', icon: Compass, category: 'main' },
  
  // Cultural & Religious
  { id: 'holidays', label: 'Indian Holidays', icon: Flag, category: 'cultural' },
  { id: 'festivals', label: 'Festivals', icon: Globe, category: 'cultural' },
  { id: 'islamic', label: 'Islamic Calendar', icon: Moon, category: 'cultural' },
  { id: 'panchang', label: 'Hindu Panchang', icon: Sun, category: 'cultural' },

  // Knowledge & Discoveries
  { id: 'history', label: 'On This Day', icon: History, category: 'tools' },
  { id: 'birthdays', label: 'Famous Birthdays', icon: Cake, category: 'tools' },
  { id: 'facts', label: 'Daily Facts', icon: Lightbulb, category: 'tools' },
  { id: 'astronomy', label: 'Astronomy', icon: Telescope, category: 'tools' },
  
  // Utilities & AI
  { id: 'tools', label: 'Date Tools', icon: Calculator, category: 'tools' },
  { id: 'countdowns', label: 'Countdowns', icon: Timer, category: 'tools' },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles, category: 'tools' },
  
  // Settings & Admin
  { id: 'settings', label: 'Settings', icon: Settings, category: 'system' },
  { id: 'admin', label: 'Content Admin', icon: ShieldCheck, category: 'system' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onNavigate,
  eventCount,
  countdownCount
}) => {
  return (
    <aside 
      id="desktop-sidebar"
      className="hidden lg:flex flex-col w-64 shrink-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-r border-slate-200/80 dark:border-slate-800/80 min-h-[calc(100vh-4rem)] p-3 select-none"
    >
      <div className="space-y-6 flex-1 overflow-y-auto pr-1">
        {/* Main Section */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Core Planning
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.filter(item => item.category === 'main').map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              const badge = item.id === 'events' && eventCount > 0 ? eventCount : undefined;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Culture & Religions */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Cultures & Ephemeris
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.filter(item => item.category === 'cultural').map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Discovery, Astronomy & Tools */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Discover & Utilities
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.filter(item => item.category === 'tools').map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              const badge = item.id === 'countdowns' && countdownCount > 0 ? countdownCount : undefined;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'ai' && (
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                      AI
                    </span>
                  )}
                  {badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                    }`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System & Config */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
            Administration
          </p>
          <nav className="space-y-0.5">
            {NAV_ITEMS.filter(item => item.category === 'system').map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Verified Data Badge in Sidebar Footer */}
      <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 px-2 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Sources</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            Curated from UN, ISRO, Archaeological & Gazette records.
          </p>
        </div>
      </div>
    </aside>
  );
};
