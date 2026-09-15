import React from 'react';
import { Home, MapPin, PlusCircle, Info, Phone } from 'lucide-react';

export default function MobileBottomNav({
  onDetectLocation,
  isDetectingLocation,
  onOpenAddModal,
  onOpenProjectModal,
}) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-farm-700 py-1"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* GPS Near Me */}
        <button
          onClick={onDetectLocation}
          disabled={isDetectingLocation}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-farm-700 py-1"
        >
          <MapPin className={`w-5 h-5 text-farm-600 ${isDetectingLocation ? 'animate-bounce' : ''}`} />
          <span className="text-[10px] font-bold">Near Me</span>
        </button>

        {/* Center: Rent Out Machinery FAB */}
        <button
          onClick={onOpenAddModal}
          className="flex flex-col items-center justify-center -mt-6 w-13 h-13 rounded-full bg-gradient-to-tr from-farm-700 to-emerald-500 text-white shadow-lg shadow-farm-700/40 border-4 border-white active:scale-95 transition"
        >
          <PlusCircle className="w-6 h-6" />
        </button>

        {/* Call Helpline */}
        <a
          href="tel:+918978112802"
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-farm-700 py-1"
        >
          <Phone className="w-5 h-5 text-emerald-600" />
          <span className="text-[10px] font-bold">Helpline</span>
        </a>

        {/* Project Info */}
        <button
          onClick={onOpenProjectModal}
          className="flex flex-col items-center gap-1 text-slate-600 hover:text-farm-700 py-1"
        >
          <Info className="w-5 h-5 text-farm-700" />
          <span className="text-[10px] font-bold">VVIT CSP</span>
        </button>

      </div>
    </div>
  );
}
