import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import { CATEGORIES } from '../data/equipmentData';
import { TRANSLATIONS } from '../utils/translations';

export default function SearchBarAndFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  language,
  totalResults
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const quickVoiceTerms = [
    'Tractor', 'Harvester', 'Rotavator', 'Power Tiller', 'Sprayer', 'Water Pump'
  ];

  return (
    <div className="bg-white border-b border-slate-200/90 pt-2 pb-2.5 px-3 sm:px-4 space-y-2.5">
      <div className="max-w-6xl mx-auto space-y-2">
        
        {/* Amazon-Style Compact Search Bar */}
        <div className="relative flex items-center bg-slate-100 hover:bg-slate-200/70 rounded-xl px-2.5 py-1.5 border border-slate-300/80 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-farm-600 focus-within:border-farm-600">
          <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-slate-400 hover:text-slate-600 mr-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {/* Voice Input Button */}
          <VoiceInputButton
            lang={language}
            onTranscript={(text) => setSearchTerm(text)}
            quickSuggestions={quickVoiceTerms}
          />
        </div>

        {/* Scrollable Multiple Choice List Filters (Category Chips) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const categoryName = t[cat.key] || cat.key;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-farm-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                }`}
              >
                <span className="text-sm">{cat.icon}</span>
                <span>{categoryName}</span>
              </button>
            );
          })}
        </div>

        {/* Proximity Sorting & Results Count */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
          <span className="font-semibold text-slate-600 text-[11px] sm:text-xs">
            {totalResults} {t.machineryAvailable}
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3 h-3 text-farm-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 text-[11px] sm:text-xs focus:outline-none cursor-pointer py-0.5"
            >
              <option value="distance-asc">{t.sortNearest}</option>
              <option value="price-asc">{t.sortPriceLow}</option>
              <option value="price-desc">{t.sortPriceHigh}</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
