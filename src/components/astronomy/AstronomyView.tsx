import React, { useMemo } from 'react';
import { 
  Telescope, 
  Moon, 
  Sun, 
  Sparkles, 
  Compass, 
  Clock, 
  Globe,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { 
  getMoonPhase, 
  calculateSunTimes, 
  ASTRONOMICAL_EVENTS_2026, 
  METEOR_SHOWERS 
} from '../../utils/astronomyCalculations';

interface AstronomyViewProps {
  currentDate: Date;
  onNavigateToExplorer: (date: Date) => void;
}

export const AstronomyView: React.FC<AstronomyViewProps> = ({
  currentDate,
  onNavigateToExplorer
}) => {
  const moonPhase = useMemo(() => getMoonPhase(currentDate), [currentDate]);
  const sunTimes = useMemo(() => calculateSunTimes(currentDate, 28.6139, 77.2090), [currentDate]); // Delhi coordinates

  return (
    <div id="astronomy-hub-container" className="space-y-6 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-indigo-900/50">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-indigo-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-indigo-400/20 text-indigo-300">
          <Telescope className="w-3.5 h-3.5" />
          <span>Celestial Mechanics & Solar System Ephemeris</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Astronomy, Moon Phases & Sky Almanac
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
              Track real-time synodic moon phases, solar declination, seasonal equinoxes, solstices, lunar/solar eclipses, and active meteor shower peaks.
            </p>
          </div>

          {/* Current Moon Phase Graphical Visualizer */}
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-300 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-3xl">{moonPhase.emoji}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{moonPhase.name}</h3>
              <p className="text-xs text-indigo-200 font-mono">
                {moonPhase.phasePercentage}% Illuminated • Age {moonPhase.moonAgeDays}d
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sun & Solar Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Sun className="w-4 h-4" />
            <span>Sunrise (Civil Dawn)</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            {sunTimes.sunrise}
          </p>
          <p className="text-[11px] text-slate-500">First direct light on horizon</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400">
            <Sun className="w-4 h-4" />
            <span>Solar Noon</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            {sunTimes.solarNoon}
          </p>
          <p className="text-[11px] text-slate-500">Sun highest in the sky</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
            <Moon className="w-4 h-4" />
            <span>Sunset (Dusk)</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            {sunTimes.sunset}
          </p>
          <p className="text-[11px] text-slate-500">Golden hour concludes</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Clock className="w-4 h-4" />
            <span>Day Length</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            {sunTimes.dayLength}
          </p>
          <p className="text-[11px] text-slate-500">Total daylight duration</p>
        </div>
      </div>

      {/* Major Astronomical Events for 2026 */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Major Astronomical Events (2026)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASTRONOMICAL_EVENTS_2026.map(item => (
            <div 
              key={item.title}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {item.date}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Annual Meteor Showers Guide */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Annual Major Meteor Showers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {METEOR_SHOWERS.map(ms => (
            <div 
              key={ms.name}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ms.name}</h4>
                <span className="text-[10px] font-bold text-amber-600 font-mono">{ms.rate}</span>
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Peak: {ms.peakDate}</p>
              <p className="text-[11px] text-slate-500">Active: {ms.activePeriod}</p>
              <p className="text-[10px] text-slate-400">Parent: {ms.parentBody}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
