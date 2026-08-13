import React, { useState, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  Compass, 
  Clock, 
  Sparkles, 
  ShieldAlert, 
  MapPin,
  Calendar,
  Info
} from 'lucide-react';
import { calculatePanchang } from '../../utils/panchangCalculations';
import { formatDateToISO } from '../../utils/dateCalculations';

interface PanchangViewProps {
  currentDate: Date;
  onNavigateToExplorer: (date: Date) => void;
}

export const PanchangView: React.FC<PanchangViewProps> = ({
  currentDate,
  onNavigateToExplorer
}) => {
  const [selectedDateStr, setSelectedDateStr] = useState(formatDateToISO(currentDate));
  const [selectedCity, setSelectedCity] = useState('New Delhi');

  const selectedDate = useMemo(() => {
    const [y, m, d] = selectedDateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [selectedDateStr]);

  const panchang = useMemo(() => {
    return calculatePanchang(selectedDate);
  }, [selectedDate]);

  return (
    <div id="vedic-panchang-container" className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-amber-700/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-amber-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-amber-400/20 text-amber-300">
          <Sun className="w-3.5 h-3.5" />
          <span>Vedic Ephemeris & Drik Siddhanta</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Daily Vedic Panchang
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-1">
              Five limbs of time: Tithi (Lunar day), Vaar (Solar day), Nakshatra (Constellation), Yoga (Solar-lunar angle), Karana (Half-tithi).
            </p>
          </div>

          {/* Date & Location Chooser */}
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="New Delhi" className="text-slate-900">New Delhi (28.6° N)</option>
              <option value="Mumbai" className="text-slate-900">Mumbai (19.0° N)</option>
              <option value="Kolkata" className="text-slate-900">Kolkata (22.5° N)</option>
              <option value="Chennai" className="text-slate-900">Chennai (13.0° N)</option>
              <option value="Bengaluru" className="text-slate-900">Bengaluru (12.9° N)</option>
              <option value="Varanasi" className="text-slate-900">Varanasi (25.3° N)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Special Highlights: Ekadashi / Purnima / Amavasya Alert */}
      {(panchang.tithi.isEkadashi || panchang.tithi.isPurnima || panchang.tithi.isAmavasya) && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300">
              {panchang.tithi.isEkadashi && '🌟 Sacred Ekadashi Vrat (11th Lunar Day) — Fasting and meditation.'}
              {panchang.tithi.isPurnima && '🌕 Purnima (Full Moon Day) — Auspicious rituals and charity.'}
              {panchang.tithi.isAmavasya && '🌑 Amavasya (New Moon Day) — Ancestral remembrance and introspection.'}
            </span>
          </div>
        </div>
      )}

      {/* The Five Limbs (Panch-Anga) Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Tithi */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">1. Lunar Day</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {panchang.paksha} Paksha
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {panchang.tithi.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Deity: {panchang.tithi.deity} • Index {panchang.tithi.index} of 30
          </p>
        </div>

        {/* 2. Nakshatra */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">2. Lunar Mansion</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
              Nakshatra #{panchang.nakshatra.index}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {panchang.nakshatra.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Lord: {panchang.nakshatra.lord} • Deity: {panchang.nakshatra.deity}
          </p>
        </div>

        {/* 3. Yoga */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">3. Solar-Lunar Yoga</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              Yoga #{panchang.yoga.index}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {panchang.yoga.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Meaning: {panchang.yoga.meaning}
          </p>
        </div>

        {/* 4. Karana */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">4. Half-Tithi</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
              Karana
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {panchang.karana.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Type: {panchang.karana.type === 'movable' ? 'Chara (Movable)' : 'Sthira (Fixed)'}
          </p>
        </div>

        {/* 5. Vaar (Day) & Sun Times */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">5. Vaar (Solar Day)</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
              {panchang.vaar}
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Sunrise & Sunset
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-mono">
            🌅 Sunrise: {panchang.sunrise} • 🌇 Sunset: {panchang.sunset}
          </p>
        </div>

        {/* 6. Zodiac (Rashi) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Zodiac Alignment</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
              Rashi
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Sun: {panchang.sunRashi}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Moon Rashi: {panchang.moonRashi}
          </p>
        </div>
      </div>

      {/* Auspicious & Inauspicious Muhurats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inauspicious Times */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Inauspicious Periods (Ashubh Kaal)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Rahu Kaal:</span>
                <p className="text-[11px] text-slate-500">Avoid starting new endeavors</p>
              </div>
              <span className="font-mono font-bold text-rose-700 dark:text-rose-300">
                {panchang.inauspiciousTimes.rahuKaal}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Yamaganda:</span>
                <p className="text-[11px] text-slate-500">Inauspicious solar quadrant</p>
              </div>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {panchang.inauspiciousTimes.yamaganda}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Gulika Kaal:</span>
                <p className="text-[11px] text-slate-500">Saturn-ruled division</p>
              </div>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {panchang.inauspiciousTimes.gulikaKaal}
              </span>
            </div>
          </div>
        </div>

        {/* Auspicious Muhurats */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Auspicious Timings (Shubh Muhurat)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Abhijit Muhurat:</span>
                <p className="text-[11px] text-slate-500">Midday victor muhurat</p>
              </div>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {panchang.auspiciousTimes.abhijit}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Brahma Muhurat:</span>
                <p className="text-[11px] text-slate-500">Pre-dawn spiritual meditation window</p>
              </div>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                {panchang.auspiciousTimes.brahmaMuhurat}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">Amrit Kaal:</span>
                <p className="text-[11px] text-slate-500">Auspicious lunar period</p>
              </div>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {panchang.auspiciousTimes.amritKaal}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
