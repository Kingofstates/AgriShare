import React from 'react';
import { TRANSLATIONS } from '../utils/translations';

export default function Footer({ language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-white font-bold text-sm">
          <span>🚜</span>
          <span>AgriShare</span>
        </div>
        <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
          {t.safetyNote}
        </p>
        <p className="text-slate-400">
          © {new Date().getFullYear()} AgriShare. {t.footerText}
        </p>
      </div>
    </footer>
  );
}
