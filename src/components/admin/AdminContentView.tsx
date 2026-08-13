import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Database, 
  Flag, 
  Globe, 
  History, 
  Cake, 
  Lightbulb, 
  Download, 
  CheckCircle2, 
  Trash2,
  X
} from 'lucide-react';
import { HOLIDAYS_DATABASE } from '../../data/holidaysData';
import { FESTIVALS_DATABASE } from '../../data/festivalsData';
import { HISTORICAL_EVENTS } from '../../data/historicalEventsData';
import { FAMOUS_PERSONALITIES } from '../../data/birthdaysDeathsData';
import { DAILY_FACTS } from '../../data/dailyFactsData';
import { AdminContentItem } from '../../types';
import { storageService } from '../../services/storageService';
import { triggerFileDownload } from '../../utils/icsExportImport';

export const AdminContentView: React.FC = () => {
  const [contentType, setContentType] = useState<'holidays' | 'festivals' | 'history' | 'birthdays' | 'facts' | 'custom'>('holidays');
  const [searchQuery, setSearchQuery] = useState('');
  const [customRecords, setCustomRecords] = useState<AdminContentItem[]>(() => storageService.getAdminRecords());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Record Form
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('2026-08-15');
  const [newType, setNewType] = useState<AdminContentItem['contentType']>('holiday');

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const record: AdminContentItem = {
      id: `admin-${Date.now()}`,
      contentType: newType,
      title: newTitle.trim(),
      description: newDesc.trim(),
      date: newDate,
      isVerified: true,
      createdAt: new Date().toISOString()
    };

    const updated = [record, ...customRecords];
    setCustomRecords(updated);
    storageService.saveAdminRecords(updated);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteRecord = (id: string) => {
    const updated = customRecords.filter(r => r.id !== id);
    setCustomRecords(updated);
    storageService.saveAdminRecords(updated);
  };

  const handleExportFullDB = () => {
    const fullDb = {
      holidays: HOLIDAYS_DATABASE,
      festivals: FESTIVALS_DATABASE,
      historicalEvents: HISTORICAL_EVENTS,
      famousPersonalities: FAMOUS_PERSONALITIES,
      dailyFacts: DAILY_FACTS,
      customRecords
    };
    triggerFileDownload(JSON.stringify(fullDb, null, 2), 'ali-calendar-full-encyclopedia-database.json', 'application/json');
  };

  return (
    <div id="admin-content-view" className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ephemeris Encyclopedia Content Management</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Content Admin & Master Database
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl leading-relaxed mt-1">
              Inspect all curated Indian statutory gazetted holidays, multi-faith festivals, world history chronicles, personalities, and manage custom records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportFullDB}
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Database</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'holidays', label: `Holidays (${HOLIDAYS_DATABASE.length})`, icon: Flag },
          { id: 'festivals', label: `Festivals (${FESTIVALS_DATABASE.length})`, icon: Globe },
          { id: 'history', label: `History (${HISTORICAL_EVENTS.length})`, icon: History },
          { id: 'birthdays', label: `Personalities (${FAMOUS_PERSONALITIES.length})`, icon: Cake },
          { id: 'facts', label: `Facts (${DAILY_FACTS.length})`, icon: Lightbulb },
          { id: 'custom', label: `Custom Added (${customRecords.length})`, icon: Database }
        ].map(tab => {
          const Icon = tab.icon;
          const isSel = contentType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setContentType(tab.id as any)}
              className={`px-3.5 py-2 rounded-2xl font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                isSel
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search records by title, description, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Database Records Table / Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Dataset Entries ({contentType.toUpperCase()})
        </h3>

        <div className="space-y-2.5">
          {contentType === 'holidays' && (
            HOLIDAYS_DATABASE
              .filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.description.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(h => (
                <div key={h.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{h.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                        {h.holidayType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{h.date} • {h.description}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))
          )}

          {contentType === 'festivals' && (
            FESTIVALS_DATABASE
              .filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(f => (
                <div key={f.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{f.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                        {f.religion}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{f.date} • {f.description}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))
          )}

          {contentType === 'history' && (
            HISTORICAL_EVENTS
              .filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || h.description.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(h => (
                <div key={h.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{h.year}: {h.title}</span>
                    <p className="text-[11px] text-slate-500">{h.description}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))
          )}

          {contentType === 'birthdays' && (
            FAMOUS_PERSONALITIES
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.profession.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(p => (
                <div key={p.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{p.name} ({p.birthDate}{p.deathDate ? ` – ${p.deathDate}` : ''})</span>
                    <p className="text-[11px] text-slate-500">{p.profession} • {p.majorContribution}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))
          )}

          {contentType === 'facts' && (
            DAILY_FACTS
              .filter(f => f.fact.toLowerCase().includes(searchQuery.toLowerCase()) || f.explanation.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(f => (
                <div key={f.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">"{f.fact}"</span>
                    <p className="text-[11px] text-slate-500">{f.explanation} (Source: {f.sourceName})</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))
          )}

          {contentType === 'custom' && (
            customRecords.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No custom records added yet. Click "Add Custom Record" to add your own entry.
              </div>
            ) : (
              customRecords.map(rec => (
                <div key={rec.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{rec.title}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        {rec.contentType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{rec.date} • {rec.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteRecord(rec.id)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Add Custom Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <span>Add Custom Almanac Record</span>
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Content Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="holiday">Holiday</option>
                  <option value="festival">Festival</option>
                  <option value="history">Historical Event</option>
                  <option value="birthday">Famous Birthday</option>
                  <option value="fact">Daily Fact</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Record title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Description / Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Full background, significance, or source..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
