import React, { useState } from 'react';
import { MapPin, Plus, Globe, ChevronDown } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function Navbar({
  currentLocation,
  onDetectLocation,
  isDetectingLocation,
  onOpenAddModal,
  language,
  setLanguage
}) {
  const [langDropdown, setLangDropdown] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'te', label: 'తెలుగు', short: 'తె' },
    { code: 'hi', label: 'हिंदी', short: 'हि' },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-13 sm:h-15 gap-2">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-farm-700 flex items-center justify-center text-white shadow-xs">
              <span className="text-lg sm:text-xl">🚜</span>
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-heading">
                Agri<span className="text-farm-600">Share</span>
              </span>
            </div>
          </div>

          {/* Center Location Pill (Amazon-style deliver to / near) */}
          <button
            onClick={onDetectLocation}
            disabled={isDetectingLocation}
            className="flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold max-w-[120px] sm:max-w-[170px] truncate transition active:scale-95"
            title="Click to detect nearest equipment"
          >
            <MapPin className={`w-3.5 h-3.5 text-farm-600 shrink-0 ${isDetectingLocation ? 'animate-bounce' : ''}`} />
            <span className="truncate">
              {isDetectingLocation ? t.locating : (currentLocation?.city || 'Guntur')}
            </span>
          </button>

          {/* Right Controls: Language & Rent Out Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
              >
                <Globe className="w-3.5 h-3.5 text-farm-700" />
                <span>{currentLangObj.short}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 transition ${
                        language === l.code ? 'text-farm-700 bg-emerald-50 font-bold' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="text-[10px] text-slate-400">{l.short}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rent Out Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-farm-600 hover:bg-farm-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
              <span className="whitespace-nowrap">{t.rentOut}</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
