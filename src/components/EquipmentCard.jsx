import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function EquipmentCard({
  item,
  distance,
  userLocation,
  language = 'en',
  onSelect,
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Resolve simple name based on active language
  let displayName = item.name;
  if (language === 'te' && item.name_te) displayName = item.name_te;
  if (language === 'hi' && item.name_hi) displayName = item.name_hi;

  // Resolve price unit text
  const unitText = item.priceUnit === 'acre' 
    ? t.perAcre 
    : item.priceUnit === 'day' 
      ? t.perDay 
      : t.perHour;

  // Phone number for call / WhatsApp (DO NOT display text on card!)
  const vendorPhone = item.ownerPhone || '+918978112802';
  const cleanPhone = vendorPhone.replace(/[^0-9]/g, '');

  const userCity = userLocation?.city || 'nearby';
  const waMessage = encodeURIComponent(
    `Hello! I would like to rent your "${item.name}" listed in ${item.city}. My location is ${userCity}. Please let me know its availability. Thank you!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;
  const callUrl = `tel:${vendorPhone}`;

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = callUrl;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className="bg-white rounded-xl border border-slate-200/90 hover:border-farm-500 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer active:scale-[0.99]"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=600&q=80'}
          alt={displayName}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Clean, Non-overlapping Distance Tag */}
        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span>{distance !== null ? `${distance} ${t.kmAway}` : item.city}</span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        
        <div>
          {/* Simple Name (e.g. "Tractor", "Harvester", "Rotavator") */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 font-heading">
            {displayName}
          </h3>

          {/* Location / Village */}
          <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
            <span className="truncate">{item.city} {item.village ? `• ${item.village}` : ''}</span>
          </p>
        </div>

        {/* Price Row (Bold, Amazon-style) */}
        <div className="pt-1 flex items-baseline justify-between border-t border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 block leading-tight">{t.rentalRate}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-600 font-medium">{unitText}</span>
            </div>
          </div>

          <span className="text-[11px] text-farm-700 font-bold hover:underline">
            {t.viewDetails} →
          </span>
        </div>

        {/* Two Clean Action Buttons (NO phone number text displayed) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          
          {/* 1. Call Button */}
          <button
            type="button"
            onClick={handleCall}
            className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-50 hover:bg-farm-600 text-farm-800 hover:text-white border border-farm-300 hover:border-farm-600 rounded-lg text-xs font-bold transition active:scale-95"
            title="Call Owner"
          >
            <Phone className="w-3.5 h-3.5 text-farm-600 hover:text-white" />
            <span>{t.call}</span>
          </button>

          {/* 2. WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1 py-2 px-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-lg text-xs font-bold transition shadow-xs active:scale-95"
            title="Send WhatsApp Message"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
            <span>{t.whatsapp}</span>
          </button>

        </div>

      </div>
    </div>
  );
}
