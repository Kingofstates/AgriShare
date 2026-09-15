import React from 'react';
import { X, Award, Users, BookOpen, GraduationCap, CheckCircle, Smartphone, Database, Server, Compass } from 'lucide-react';

export default function ProjectInfoModal({ onClose }) {
  const teamMembers = [
    { name: 'Ch. Lakshmi Sri Sahasra', roll: '24BQ1A0570', role: 'Documentation & PPT' },
    { name: 'Ch. Varshitha Chowdary', roll: '24BQ1A0573', role: 'UI/UX & Registration Flow' },
    { name: 'D. Premraj Naga Koushik', roll: '24BQ1A05A5', role: 'Interface & Module Testing' },
    { name: 'D. Greeshmanth', roll: '24BQ1A05B2', role: 'Machinery Listing & Search Logic' },
    { name: 'G. Karunya', roll: '24BQ1A05B9', role: 'System Testing & Data Validation' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden flex flex-col shadow-2xl border border-emerald-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-farm-900 via-farm-800 to-farm-700 text-white p-5 sm:p-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" />
              <span>Vasireddy Venkatadri Institute of Technology (VVIT)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading mt-1">
              CSE Community Service Project (CSP)
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              Agricultural Machinery Management System: A Digital Platform for Providing Easy, Affordable, and Timely Access to Agricultural Equipment for Rural Farmers
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-6 text-slate-700 text-xs sm:text-sm">
          
          {/* Guide & Batch Pill */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-farm-700 text-white flex items-center justify-center font-bold">
                👨‍🏫
              </div>
              <div>
                <span className="text-[11px] text-farm-800 font-bold uppercase">Project Guidance</span>
                <div className="font-extrabold text-slate-900 text-sm">Dr. Mohammad Shareef</div>
                <div className="text-[11px] text-slate-500">Dept. of Computer Science & Engineering</div>
              </div>
            </div>

            <div className="bg-harvest-50 p-3.5 rounded-2xl border border-harvest-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-harvest-600 text-white flex items-center justify-center font-bold">
                🎯
              </div>
              <div>
                <span className="text-[11px] text-harvest-800 font-bold uppercase">Batch Reference</span>
                <div className="font-extrabold text-slate-900 text-sm">Batch No: 12</div>
                <div className="text-[11px] text-slate-500">B.Tech CSE Community Outreach</div>
              </div>
            </div>
          </div>

          {/* Abstract / Problem Statement */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-farm-600" />
              Core Problem & Solution
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-slate-600 leading-relaxed">
              <p>
                <strong>Problem:</strong> Small and marginal rural farmers often face severe difficulties accessing modern farming machinery due to high capital costs, limited localized availability, and inefficient informal broker practices.
              </p>
              <p>
                <strong>Solution:</strong> AgriShare digital sharing platform bridges the gap by connecting machinery owners directly with nearby farmers. Features voice-assisted search, GPS distance calculation, instant WhatsApp & telephone bookings, and verified equipment specifications.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-farm-600" />
              Project Presentation Team (Batch 12)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {teamMembers.map((m, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="font-bold text-slate-800 text-xs sm:text-sm">{m.name}</div>
                    <div className="text-[11px] text-slate-500">{m.role}</div>
                  </div>
                  <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {m.roll}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Module Breakdown (From PPT Slide 5) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-farm-600" />
              Technical Architecture & System Modules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                <Smartphone className="w-4 h-4 text-farm-700" />
                <div className="font-bold text-slate-900 text-xs">Module 1: User & Interface</div>
                <p className="text-[11px] text-slate-600">Mobile-first React UI, Voice-to-text dictation, GPS distance sorting & WhatsApp integration.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                <Server className="w-4 h-4 text-farm-700" />
                <div className="font-bold text-slate-900 text-xs">Module 2: Equipment Engine</div>
                <p className="text-[11px] text-slate-600">Categorized machinery catalog, verified owner records, insurance & rental charge calculations.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                <Database className="w-4 h-4 text-farm-700" />
                <div className="font-bold text-slate-900 text-xs">Module 3: Booking & Proximity</div>
                <p className="text-[11px] text-slate-600">Haversine GPS geospatial distance algorithm & offline-tolerant LocalStorage synchronization.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow transition active:scale-95"
          >
            Close Project Overview
          </button>
        </div>

      </div>
    </div>
  );
}
