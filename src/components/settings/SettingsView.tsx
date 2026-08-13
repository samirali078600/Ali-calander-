import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Monitor, 
  MapPin, 
  Calendar, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Bell,
  Globe,
  Flame,
  Layers
} from 'lucide-react';
import { UserSettings } from '../../types';
import { INDIAN_STATES_AND_UTS } from '../../data/holidaysData';
import { storageService, DEFAULT_SETTINGS } from '../../services/storageService';
import { triggerFileDownload } from '../../utils/icsExportImport';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onDataReset
}) => {
  const [saveToast, setSaveToast] = useState(false);
  const [importMessage, setImportMessage] = useState<string>('');

  const updateField = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    const updated = { ...settings, [key]: value };
    onUpdateSettings(updated);
    if (key === 'theme') {
      if (value === 'dark') document.documentElement.classList.add('dark');
      else if (value === 'light') document.documentElement.classList.remove('dark');
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportFullJSON();
    triggerFileDownload(jsonStr, `ali-calendar-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;
      const success = storageService.importFullJSON(content);
      if (success) {
        setImportMessage('Backup successfully restored! Reloading state...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportMessage('Error: Invalid JSON backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all custom events, countdowns, and preferences to defaults? This cannot be undone.')) {
      storageService.resetToDefault();
      onDataReset();
    }
  };

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-slate-700/60">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full w-fit backdrop-blur-sm">
          <SettingsIcon className="w-3.5 h-3.5 text-indigo-400" />
          <span>User Preferences & Ephemeris Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Calendar & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Customize your regional holidays, sacred religious systems, layout density, notification thresholds, and data backups.
        </p>
      </div>

      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-scale-up">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated and saved!</span>
        </div>
      )}

      {/* Grid of Settings Panels */}
      <div className="space-y-6">
        {/* Panel 1: Theme & Visual Appearance */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Theme & Display Styling</span>
          </h2>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Auto', icon: Monitor }
            ].map(themeItem => {
              const Icon = themeItem.icon;
              const isSel = settings.theme === themeItem.id;
              return (
                <button
                  key={themeItem.id}
                  onClick={() => updateField('theme', themeItem.id as any)}
                  className={`p-3.5 rounded-2xl border text-xs font-semibold flex flex-col items-center justify-center gap-2 transition-all ${
                    isSel 
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{themeItem.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Calendar Grid Density
              </label>
              <select
                value={settings.calendarDensity || 'normal'}
                onChange={(e) => updateField('calendarDensity', e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="compact">Compact (Dense matrix)</option>
                <option value="normal">Normal (Balanced)</option>
                <option value="spacious">Spacious (Large cells)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                First Day of Week
              </label>
              <select
                value={settings.firstDayOfWeek}
                onChange={(e) => updateField('firstDayOfWeek', parseInt(e.target.value) as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value={0}>Sunday</option>
                <option value={1}>Monday (Standard)</option>
                <option value={6}>Saturday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Panel 2: Regional Location & Statutory State */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>Regional Location & State Gazetted Scope</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Country
              </label>
              <input
                type="text"
                disabled
                value="India (IN)"
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                State / Union Territory (for gazetted holidays)
              </label>
              <select
                value={settings.stateProvince}
                onChange={(e) => updateField('stateProvince', e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {INDIAN_STATES_AND_UTS.map(state => (
                  <option key={state.code} value={state.name}>{state.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Panel 3: Religious Systems Visibility */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Multi-Faith Religious Traditions</span>
          </h2>
          <p className="text-xs text-slate-500">
            Choose which religious ephemeris calendars to display across the date explorer and festival encyclopedia.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'islamic', label: '☪️ Islamic Hijri' },
              { id: 'hindu', label: '🕉️ Hindu Panchang' },
              { id: 'christian', label: '✝️ Christian' },
              { id: 'sikh', label: '☬ Sikh' },
              { id: 'jain', label: '🕊️ Jain' },
              { id: 'buddhist', label: '☸️ Buddhist' },
              { id: 'jewish', label: '✡️ Jewish' },
              { id: 'zoroastrian', label: '🔥 Zoroastrian' }
            ].map(trad => {
              const isEnabled = settings.enabledReligiousCalendars[trad.id as keyof typeof settings.enabledReligiousCalendars] ?? true;
              return (
                <button
                  key={trad.id}
                  onClick={() => {
                    const current = { ...settings.enabledReligiousCalendars };
                    current[trad.id as keyof typeof settings.enabledReligiousCalendars] = !isEnabled;
                    updateField('enabledReligiousCalendars', current);
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    isEnabled
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                  }`}
                >
                  <span>{trad.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel 4: Data Backup, JSON Export & Restore */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-500" />
            <span>Data Sovereignty, Backup & Recovery</span>
          </h2>
          <p className="text-xs text-slate-500">
            Export a full JSON snapshot of your events, countdowns, and preferences, or restore from an existing backup file.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportBackup}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Full JSON Backup</span>
            </button>

            <label className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-slate-200 dark:border-slate-700">
              <Upload className="w-4 h-4" />
              <span>Restore Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-red-200/60 dark:border-red-900/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          {importMessage && (
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {importMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
