import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Plus,
  Compass,
  Menu,
  X,
  Sparkles,
  Flag,
  Globe,
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
  CheckSquare
} from 'lucide-react';

interface MobileNavProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  onOpenAddEvent: () => void;
  eventCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentSection,
  onNavigate,
  onOpenAddEvent,
  eventCount
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSelect = (section: string) => {
    onNavigate(section);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 py-1 px-3 flex items-center justify-around"
      >
        {/* Dashboard */}
        <button
          id="mobile-nav-dashboard"
          onClick={() => handleSelect('dashboard')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentSection === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* Calendar */}
        <button
          id="mobile-nav-calendar"
          onClick={() => handleSelect('calendar')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentSection === 'calendar'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span>Calendar</span>
        </button>

        {/* Floating Add Event Button */}
        <div className="relative -top-4">
          <button
            id="mobile-floating-add-event"
            onClick={onOpenAddEvent}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-lg shadow-indigo-600/40 flex items-center justify-center active:scale-95 transition-transform"
            aria-label="Add Event"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Date Explorer */}
        <button
          id="mobile-nav-explorer"
          onClick={() => handleSelect('date-explorer')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium transition-colors ${
            currentSection === 'date-explorer'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span>Explore</span>
        </button>

        {/* Full Menu Drawer Trigger */}
        <button
          id="mobile-nav-menu"
          onClick={() => setIsDrawerOpen(true)}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl text-[10px] font-medium text-slate-500 dark:text-slate-400"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          id="mobile-drawer-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div 
            id="mobile-drawer-content"
            className="w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ali Calendar</h3>
                    <p className="text-[10px] text-slate-500">Navigation Menu</p>
                  </div>
                </div>
                <button
                  id="mobile-drawer-close"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="space-y-1 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Sections</p>
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { id: 'calendar', label: 'Main Calendar', icon: Calendar },
                  { id: 'events', label: `Events & Tasks (${eventCount})`, icon: CheckSquare },
                  { id: 'date-explorer', label: 'Date Explorer', icon: Compass },
                  { id: 'holidays', label: 'Indian Holidays', icon: Flag },
                  { id: 'festivals', label: 'Festivals', icon: Globe },
                  { id: 'islamic', label: 'Islamic Calendar', icon: Moon },
                  { id: 'panchang', label: 'Hindu Panchang', icon: Sun },
                  { id: 'history', label: 'On This Day', icon: History },
                  { id: 'birthdays', label: 'Famous Birthdays', icon: Cake },
                  { id: 'facts', label: 'Daily Facts', icon: Lightbulb },
                  { id: 'astronomy', label: 'Astronomy', icon: Telescope },
                  { id: 'tools', label: 'Date Tools', icon: Calculator },
                  { id: 'countdowns', label: 'Countdowns', icon: Timer },
                  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
                  { id: 'settings', label: 'Settings', icon: Settings },
                  { id: 'admin', label: 'Content Admin', icon: ShieldCheck }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-[11px] text-slate-400">
                Ali Calendar • Production Ready
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
