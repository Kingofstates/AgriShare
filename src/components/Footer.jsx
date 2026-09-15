import React from 'react';
import { Phone, MessageCircle, Heart, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function Footer({ onOpenProjectModal, onOpenAddModal }) {
  const helplinePhone = '+918978112802';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚜</span>
              <span className="text-2xl font-black text-white tracking-tight font-heading">
                Agri<span className="text-emerald-400">Share</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              Bridging the gap in rural agriculture by enabling farmers to rent, share, and manage modern agricultural machinery at affordable rates with zero middleman commission.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-emerald-400 border border-slate-700">
                🌱 Rural Farmer Initiative
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-harvest-300 border border-slate-700">
                ⚡ GPS Proximity Engine
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-blue-300 border border-slate-700">
                🎙️ Voice-Assisted Input
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <button
                  onClick={onOpenAddModal}
                  className="hover:text-emerald-400 transition flex items-center gap-1.5"
                >
                  <span>+ List Your Tractor / Harvester</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                  className="hover:text-emerald-400 transition"
                >
                  Browse Nearby Machinery
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProjectModal}
                  className="hover:text-emerald-400 transition text-emerald-300 font-medium"
                >
                  VVIT CSP Batch 12 Presentation
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Helpline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Direct Helpline</h4>
            <div className="space-y-2">
              <a
                href={`tel:${helplinePhone}`}
                className="flex items-center gap-2 p-2.5 bg-slate-800/90 hover:bg-emerald-800/40 rounded-xl text-xs sm:text-sm text-white font-bold border border-slate-700 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call: {helplinePhone}</span>
              </a>

              <a
                href={`https://wa.me/918978112802?text=${encodeURIComponent('Hello AgriShare Helpline! I need assistance with equipment booking.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 bg-slate-800/90 hover:bg-[#25D366]/20 rounded-xl text-xs sm:text-sm text-[#25D366] font-bold border border-slate-700 transition"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                <span>WhatsApp Support</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AgriShare. CSE Community Service Project - VVIT Nambur, Guntur.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for rural farming communities</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
}
