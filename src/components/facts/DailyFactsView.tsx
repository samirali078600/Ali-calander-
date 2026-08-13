import React, { useState } from 'react';
import { 
  Lightbulb, 
  Shuffle, 
  Share2, 
  Check, 
  Sparkles, 
  BookOpen, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DAILY_FACTS } from '../../data/dailyFactsData';
import { FactCategory } from '../../types';

export const DailyFactsView: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const filteredFacts = DAILY_FACTS.filter(f => 
    selectedCategory === 'all' || f.category === selectedCategory
  );

  const currentFact = filteredFacts[currentIndex % filteredFacts.length] || DAILY_FACTS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredFacts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredFacts.length) % filteredFacts.length);
  };

  const handleRandom = () => {
    const r = Math.floor(Math.random() * filteredFacts.length);
    setCurrentIndex(r);
  };

  const handleCopy = () => {
    const text = `💡 Fact of the Day (${currentFact.category.toUpperCase()}):
"${currentFact.fact}"

${currentFact.explanation}

Source: ${currentFact.sourceName}
— Shared from Ali Calendar`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="daily-facts-container" className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-3 border border-amber-600/40">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-amber-500/20 px-3 py-1 rounded-full w-fit backdrop-blur-sm border border-amber-400/20 text-amber-300">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Curated Daily Fact Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Fact of the Day & Knowledge Bites
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
          Broaden your horizon daily with rigorously verified facts across science, astrophysics, mathematics, Indian heritage, geography, and human physiology.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'all', label: 'All Fields' },
          { id: 'space', label: '🚀 Space' },
          { id: 'science', label: '🔬 Science' },
          { id: 'mathematics', label: '📐 Mathematics' },
          { id: 'human_body', label: '🧬 Human Body' },
          { id: 'india', label: '🇮🇳 India' },
          { id: 'geography', label: '🌍 Geography' },
          { id: 'animals', label: '🐙 Animals' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Fact Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            {currentFact.category.replace('_', ' ')}
          </span>
          <span className="text-xs font-mono text-slate-400 font-semibold">
            Fact {(currentIndex % filteredFacts.length) + 1} of {filteredFacts.length}
          </span>
        </div>

        <blockquote className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
          “{currentFact.fact}”
        </blockquote>

        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-2">
          <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Scientific Explanation</span>
          </h4>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentFact.explanation}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Source: {currentFact.sourceName}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handleRandom}
              className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              Next Fact →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
