import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Plus, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Share2,
  X
} from 'lucide-react';
import { CountdownItem } from '../../types';
import { storageService } from '../../services/storageService';

interface CountdownsViewProps {
  countdowns: CountdownItem[];
  onAddCountdown: (item: Omit<CountdownItem, 'id'>) => void;
  onDeleteCountdown: (id: string) => void;
}

export const CountdownsView: React.FC<CountdownsViewProps> = ({
  countdowns,
  onAddCountdown,
  onDeleteCountdown
}) => {
  const [now, setNow] = useState<number>(Date.now());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDateTime, setNewDateTime] = useState('2026-12-31T23:59');
  const [newCategory, setNewCategory] = useState<'holiday' | 'exam' | 'birthday' | 'custom'>('custom');
  const [newColor, setNewColor] = useState('#6366f1');

  // Live second updater
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDateTime) return;

    onAddCountdown({
      title: newTitle.trim(),
      targetDateTime: newDateTime,
      category: newCategory,
      color: newColor
    });

    setNewTitle('');
    setIsModalOpen(false);
  };

  const PRESETS = [
    { title: 'Indian Independence Day', target: '2026-08-15T00:00', cat: 'holiday', color: '#f97316' },
    { title: 'Diwali (Deepavali)', target: '2026-11-08T00:00', cat: 'holiday', color: '#eab308' },
    { title: 'New Year 2027', target: '2027-01-01T00:00', cat: 'holiday', color: '#3b82f6' },
    { title: 'Next Solar Eclipse', target: '2026-08-12T17:45', cat: 'custom', color: '#8b5cf6' }
  ];

  return (
    <div id="countdowns-view" className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-violet-800/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-violet-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-violet-400/20 text-violet-300">
          <Timer className="w-3.5 h-3.5" />
          <span>Real-Time Chronological Countdown Engine</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Live Countdowns & Milestones
            </h1>
            <p className="text-xs sm:text-sm text-violet-200/90 max-w-xl leading-relaxed mt-1">
              Track critical upcoming exams, holidays, celestial events, product launches, and personal life milestones with second-by-second precision.
            </p>
          </div>

          <button
            id="add-countdown-btn"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create Countdown</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Add Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Quick Add:
        </span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onAddCountdown({
              title: preset.title,
              targetDateTime: preset.target,
              category: preset.cat as any,
              color: preset.color
            })}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-600 whitespace-nowrap text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.color }} />
            <span>{preset.title}</span>
          </button>
        ))}
      </div>

      {/* Countdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {countdowns.map(cd => {
          const target = new Date(cd.targetDateTime).getTime();
          const diff = target - now;
          const isPassed = diff <= 0;

          const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
          const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
          const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
          const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

          return (
            <div
              key={cd.id}
              className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Category Color Accent Bar */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: cd.color || '#6366f1' }}
              />

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span 
                      className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ 
                        backgroundColor: `${cd.color || '#6366f1'}20`, 
                        color: cd.color || '#6366f1' 
                      }}
                    >
                      {cd.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {cd.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onDeleteCountdown(cd.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
                    title="Delete countdown"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(cd.targetDateTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </p>
              </div>

              {/* Ticker Box */}
              {isPassed ? (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Milestone Completed!
                  </span>
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">
                      {days}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Days</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">
                      {String(hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Hours</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">
                      {String(minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Mins</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/50">
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 font-mono block animate-pulse">
                      {String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-indigo-500 dark:text-indigo-400">Secs</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Timer className="w-5 h-5 text-indigo-600" />
                <span>New Milestone Countdown</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPSC Prelims Exam, Sister's Wedding"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="holiday">Holiday</option>
                    <option value="exam">Exam / Career</option>
                    <option value="birthday">Birthday</option>
                    <option value="custom">Custom Goal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {['#6366f1', '#f97316', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6'].map(color => (
                      <button
                        type="button"
                        key={color}
                        onClick={() => setNewColor(color)}
                        className={`w-6 h-6 rounded-full transition-transform ${newColor === color ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : ''}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30"
                >
                  Save Countdown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
