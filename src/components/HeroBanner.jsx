import React from 'react';
import { Search, MapPin, Sparkles, Navigation, Phone, ShieldCheck, Zap, Mic } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

export default function HeroBanner({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
  onDetectLocation,
  isDetectingLocation,
  currentLocation,
  onOpenAddModal
}) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-farm-900 via-farm-800 to-farm-950 text-white pt-8 pb-12 sm:pt-12 sm:pb-16 px-4 sm:px-6 lg:px-8 shadow-xl">
      {/* Background Decorative Pattern & Image */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80')`
        }}
      />
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 bottom-0 w-80 h-80 bg-harvest-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-emerald-200 shadow-inner">
          <Sparkles className="w-4 h-4 text-harvest-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Vasireddy Venkatadri Institute of Technology (VVIT) CSE Initiative</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-heading">
          Empowering Rural Farmers with <br />
          <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-harvest-300 bg-clip-text text-transparent">
            Shared Agricultural Machinery
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-emerald-100/90 font-normal leading-relaxed">
          Rent tractors, harvesters, tillers, and sprayers directly from nearby farm owners. 
          Save up to 70% equipment cost with instant Call & WhatsApp connectivity.
        </p>

        {/* Search & Voice Box */}
        <div className="max-w-3xl mx-auto mt-6">
          <div className="bg-white/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-2xl border border-emerald-300/40 text-slate-800">
            <div className="flex flex-col md:flex-row items-center gap-2">
              
              {/* Keyword Search Input with Voice Button */}
              <div className="relative flex-1 w-full flex items-center bg-slate-50 hover:bg-slate-100/80 rounded-xl sm:rounded-2xl px-3 py-2 border border-slate-200/80 transition-all focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Tractor, Harvester, Drone, Tiller..."
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {/* Voice-to-Text Button */}
                <VoiceInputButton
                  onTranscript={(text) => setSearchTerm(text)}
                  className="ml-1 shrink-0"
                />
              </div>

              {/* City / Distance Selector */}
              <div className="flex w-full md:w-auto items-center gap-2">
                <div className="relative flex-1 md:w-44 flex items-center bg-slate-50 rounded-xl sm:rounded-2xl px-3 py-2 border border-slate-200/80">
                  <MapPin className="w-4 h-4 text-farm-600 mr-1.5 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">📍 All Locations</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Tenali">Tenali</option>
                    <option value="Amaravati">Amaravati</option>
                    <option value="Mangalagiri">Mangalagiri</option>
                    <option value="Eluru">Eluru</option>
                    <option value="Ongole">Ongole</option>
                    <option value="Bapatla">Bapatla</option>
                    <option value="Narasaraopet">Narasaraopet</option>
                  </select>
                </div>

                {/* Detect GPS button */}
                <button
                  type="button"
                  onClick={onDetectLocation}
                  disabled={isDetectingLocation}
                  className="px-3.5 py-2.5 bg-farm-600 hover:bg-farm-700 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-farm-600/30"
                  title="Detect GPS location for nearest distance calculation"
                >
                  <Navigation className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Nearest</span>
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Value Highlights Pill Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-emerald-100 font-medium">
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Verified Machinery Owners</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <Zap className="w-4 h-4 text-harvest-300" />
            <span>Voice-Assisted Search & Booking</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
            <Phone className="w-4 h-4 text-emerald-300" />
            <span>Direct Call & WhatsApp (No Middlemen)</span>
          </div>
        </div>

      </div>
    </div>
  );
}
