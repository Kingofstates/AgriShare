import React, { useState } from 'react';
import { MapPin, PlusCircle, Globe, Sparkles, Navigation, Info, PhoneCall } from 'lucide-react';

export default function Navbar({
  currentLocation,
  onDetectLocation,
  isDetectingLocation,
  onOpenAddModal,
  onOpenProjectModal,
  language,
  setLanguage
}) {
  const [langDropdown, setLangDropdown] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'te', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-farm-700 via-farm-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-farm-700/20 ring-2 ring-emerald-100">
              <span className="text-2xl sm:text-3xl">🚜</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
                  Agri<span className="text-farm-600">Share</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-farm-100 text-farm-800 rounded-full border border-farm-200">
                  Rural Hub
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden xs:block">
                Farm Machinery & Resource Sharing
              </p>
            </div>
          </div>

          {/* Center: GPS Location Pill */}
          <div className="flex items-center">
            <button
              onClick={onDetectLocation}
              disabled={isDetectingLocation}
              className="group flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 bg-emerald-50 hover:bg-emerald-100 text-slate-700 hover:text-farm-800 rounded-full border border-emerald-200/80 transition-all text-xs sm:text-sm font-medium shadow-xs"
              title="Click to detect your current location via GPS"
            >
              <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-farm-600 ${isDetectingLocation ? 'animate-bounce' : 'group-hover:scale-110'}`} />
              <div className="text-left flex flex-col sm:flex-row sm:items-center sm:gap-1">
                <span className="text-[10px] sm:text-xs text-slate-500 hidden md:inline">Near:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[90px] sm:max-w-[130px]">
                  {isDetectingLocation ? 'Locating...' : (currentLocation?.city || 'Guntur, AP')}
                </span>
              </div>
              <span className="text-[10px] bg-farm-600 text-white rounded-full px-1.5 py-0.2 hidden lg:inline font-bold">
                GPS
              </span>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-farm-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                <Globe className="w-3.5 h-3.5 text-farm-600" />
                <span className="uppercase">{language}</span>
              </button>

              {langDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fadeIn">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center gap-2 hover:bg-emerald-50 transition ${
                        language === l.code ? 'text-farm-700 font-bold bg-emerald-50/60' : 'text-slate-700'
                      }`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CSP Project Info Pill */}
            <button
              onClick={onOpenProjectModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200 rounded-xl border border-emerald-300/60 transition"
              title="View VVIT CSP Project Details"
            >
              <Info className="w-3.5 h-3.5 text-farm-700" />
              <span>VVIT Project</span>
            </button>

            {/* Rent Out Machinery (Upload) Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-farm-600 to-emerald-500 hover:from-farm-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-farm-600/25 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="whitespace-nowrap">Rent Out Machinery</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
