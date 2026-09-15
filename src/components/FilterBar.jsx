import React from 'react';
import { CATEGORIES } from '../data/equipmentData';
import { SlidersHorizontal, MapPin, ArrowUpDown, Check, Filter } from 'lucide-react';

export default function FilterBar({
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  maxDistance,
  setMaxDistance,
  totalResults
}) {
  return (
    <div className="bg-white border-b border-slate-200/80 sticky top-16 sm:top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        
        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-farm-700 text-white shadow-sm shadow-farm-700/30 ring-2 ring-farm-600/30'
                    : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sort & Distance Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs sm:text-sm">
          
          {/* Results Count & Distance Radius */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900 bg-emerald-50 text-farm-800 px-2.5 py-1 rounded-lg border border-emerald-200/60">
              {totalResults} Machinery Available
            </span>

            {/* Distance Filter */}
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <span className="text-xs font-medium text-slate-500">Max Distance:</span>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-farm-500"
              >
                <option value={9999}>Any Distance</option>
                <option value={10}>Within 10 km</option>
                <option value={25}>Within 25 km</option>
                <option value={50}>Within 50 km</option>
                <option value={100}>Within 100 km</option>
              </select>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-farm-600 shrink-0" />
            <span className="text-xs font-medium text-slate-500 hidden xs:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-farm-500 cursor-pointer"
            >
              <option value="distance-asc">📍 Nearest First (Proximity)</option>
              <option value="price-asc">💰 Price: Low to High</option>
              <option value="price-desc">💸 Price: High to Low</option>
              <option value="rating-desc">⭐ Top Rated Owners</option>
            </select>
          </div>

        </div>

      </div>
    </div>
  );
}
