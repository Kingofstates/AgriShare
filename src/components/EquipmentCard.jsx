import React from 'react';
import { MapPin, Phone, MessageCircle, Star, ShieldCheck, Gauge, Fuel, UserCheck, Calendar } from 'lucide-react';

export default function EquipmentCard({
  item,
  distance,
  userLocation,
  onSelect,
}) {
  const defaultPhone = '+918978112802';
  const cleanPhone = (item.ownerPhone || defaultPhone).replace(/[^0-9]/g, '');

  // Generate WhatsApp message URL
  const renterLocationText = userLocation?.city ? `${userLocation.city}` : 'nearby area';
  const waMessage = encodeURIComponent(
    `Hello! I want to rent your "${item.name}" listed in ${item.city} (${item.village || ''}). I am contacting you from ${renterLocationText}. Please let me know its availability and rental terms. Thank you!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;
  const callUrl = `tel:${item.ownerPhone || defaultPhone}`;

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
      className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-farm-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image & Badges Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={item.images?.[0] || 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-900/80 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            {item.category}
          </span>
          {item.verified && (
            <span className="px-2 py-1 text-[11px] font-bold rounded-full bg-emerald-600/90 text-white backdrop-blur-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Distance Badge on Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-farm-700/90 text-white backdrop-blur-md shadow-md flex items-center gap-1 border border-farm-400/40">
            <MapPin className="w-3.5 h-3.5 text-harvest-300" />
            {distance !== null ? `${distance} km away` : item.city}
          </span>
        </div>

        {/* Bottom Details Overlay on Image */}
        <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between text-white text-xs">
          <span className="font-semibold drop-shadow-md flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {item.city} {item.village ? `• ${item.village}` : ''}
          </span>
          <span className="font-bold flex items-center gap-1 text-amber-300 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {item.ownerRating || 4.9} ({item.reviewsCount || 10})
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Title and Specs Tags */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-farm-700 transition-colors line-clamp-1 font-heading">
              {item.name}
            </h3>
          </div>
          
          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
            <span>Model: {item.model || item.brand}</span>
            <span>•</span>
            <span className="text-farm-700 font-semibold">{item.power}</span>
          </p>

          {/* Quick Features */}
          <div className="flex flex-wrap gap-1.5 mt-2.5 text-[11px] font-medium text-slate-600">
            <span className="px-2 py-0.5 bg-slate-100 rounded-md flex items-center gap-1">
              <Fuel className="w-3 h-3 text-slate-500" />
              {item.fuelType}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 rounded-md flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-farm-600" />
              {item.operatorAvailable ? 'Operator Available' : 'Self-Operate'}
            </span>
            <span className="px-2 py-0.5 bg-emerald-50 text-farm-800 rounded-md font-semibold">
              {item.condition}
            </span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Rental Rate</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                /{item.priceUnit || 'hour'}
              </span>
            </div>
          </div>
          
          <div className="text-right text-[11px] text-slate-500">
            {item.dayPrice && (
              <div>₹{item.dayPrice.toLocaleString('en-IN')}/day</div>
            )}
            {item.acrePrice && (
              <div className="text-farm-700 font-semibold">₹{item.acrePrice.toLocaleString('en-IN')}/acre</div>
            )}
          </div>
        </div>

        {/* TWO PRIMARY ACTION BUTTONS: Call & WhatsApp */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          
          {/* 1. Make a Call Button */}
          <button
            type="button"
            onClick={handleCall}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-50 hover:bg-farm-600 text-farm-800 hover:text-white border border-farm-200 hover:border-farm-600 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs active:scale-95 group/call"
            title={`Call owner at ${item.ownerPhone || defaultPhone}`}
          >
            <Phone className="w-4 h-4 text-farm-600 group-hover/call:text-white group-hover/call:animate-bounce" />
            <span>Call</span>
          </button>

          {/* 2. WhatsApp Button */}
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-[#25D366]/20 active:scale-95 group/wa"
            title="Send WhatsApp message with equipment details and location"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366] group-hover/wa:scale-110 transition-transform" />
            <span>WhatsApp</span>
          </button>

        </div>

      </div>
    </div>
  );
}
