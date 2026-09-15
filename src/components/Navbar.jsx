import React, { useState } from 'react';
import { MapPin, Plus, Globe, ChevronDown, Navigation } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* Top Bar with comfortable breathing room */}
      <div className="max-w-6xl mx-auto px-3.5 sm:px-5 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-farm-700 flex items-center justify-center text-white shadow-xs">
              <span className="text-xl sm:text-2xl">🚜</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">
                Agri<span className="text-farm-600">Share</span>
              </span>
            </div>
          </div>

          {/* Desktop/Tablet Location Pill */}
          <div className="hidden md:flex items-center">
            <button
              onClick={onDetectLocation}
              disabled={isDetectingLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold transition active:scale-95"
              title="Click to detect nearest equipment via GPS"
            >
              <MapPin className={`w-3.5 h-3.5 text-farm-600 ${isDetectingLocation ? 'animate-bounce' : ''}`} />
              <span>{t.nearYou}:</span>
              <strong className="text-slate-900">{isDetectingLocation ? t.locating : (currentLocation?.city || 'Guntur')}</strong>
              <span className="text-[10px] bg-farm-100 text-farm-800 font-bold px-1.5 py-0.2 rounded">GPS</span>
            </button>
          </div>

          {/* Right Controls: Language & Rent Out Button */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition"
              >
                <Globe className="w-3.5 h-3.5 text-farm-700" />
                <span>{currentLangObj.short}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between hover:bg-emerald-50 transition ${
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
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-farm-600 hover:bg-farm-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="whitespace-nowrap">{t.rentOut}</span>
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE LOCATION BAR - 100% Guaranteed Visible on Mobile! (Amazon mobile deliver-to strip) */}
      <div className="md:hidden bg-slate-100/90 border-t border-slate-200/80 px-3.5 py-1.5">
        <button
          onClick={onDetectLocation}
          disabled={isDetectingLocation}
          className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-farm-800 transition active:scale-98"
        >
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className={`w-3.5 h-3.5 text-farm-600 shrink-0 ${isDetectingLocation ? 'animate-bounce text-red-500' : ''}`} />
            <span className="text-slate-500 font-medium">{t.nearYou}:</span>
            <span className="font-bold text-slate-900 truncate">
              {isDetectingLocation ? t.locating : (currentLocation?.city || 'Guntur, Andhra Pradesh')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-farm-700 font-bold text-[11px] shrink-0 pl-2">
            <Navigation className="w-3 h-3" />
            <span>{t.detectGps}</span>
          </div>
        </button>
      </div>

    </header>
  );
}
