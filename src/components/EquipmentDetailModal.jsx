import React, { useState } from 'react';
import { X, MapPin, Phone, MessageCircle, Star, Fuel, CheckCircle2, Calculator, ChevronLeft, ChevronRight } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function EquipmentDetailModal({ item, distance, userLocation, language = 'en', onClose }) {
  if (!item) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [duration, setDuration] = useState(4);
  const [calcUnit, setCalcUnit] = useState(item.priceUnit || 'hour');

  const vendorPhone = item.ownerPhone || '+918978112802';
  const cleanPhone = vendorPhone.replace(/[^0-9]/g, '');

  const userCity = userLocation?.city || 'nearby';
  const waMessage = encodeURIComponent(
    `Hello! I would like to rent your "${item.name}" listed in ${item.city}. My location is ${userCity}. Please let me know its availability. Thank you!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;
  const callUrl = `tel:${vendorPhone}`;

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'];

  // Calculate estimated total
  let rate = item.price;
  if (calcUnit === 'day' && item.dayPrice) rate = item.dayPrice;
  if (calcUnit === 'acre' && item.acrePrice) rate = item.acrePrice;
  const totalCost = rate * duration;

  // Simple name vs full name
  let displayName = item.fullName || item.name;
  if (language === 'te' && item.name_te) displayName = `${item.name_te} (${item.fullName || item.name})`;
  if (language === 'hi' && item.name_hi) displayName = `${item.name_hi} (${item.fullName || item.name})`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <span className="font-bold text-slate-800 text-sm">{t.viewDetails}</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1 text-slate-800">
          
          {/* Images */}
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900">
            <img
              src={images[activeImgIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{item.city} ({distance !== null ? `${distance} ${t.kmAway}` : ''})</span>
            </div>
          </div>

          {/* Title & Price */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              {displayName}
            </h2>
            <div className="flex items-baseline gap-1 mt-1 text-slate-900">
              <span className="text-2xl font-black text-farm-700">
                ₹{item.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-500 font-bold">
                {item.priceUnit === 'acre' ? t.perAcre : item.priceUnit === 'day' ? t.perDay : t.perHour}
              </span>
              {item.dayPrice && (
                <span className="text-xs text-slate-500 ml-3">
                  (Day: ₹{item.dayPrice.toLocaleString('en-IN')})
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1">
            <h4 className="font-bold text-slate-900">{t.description}</h4>
            <p className="leading-relaxed">{item.description}</p>
          </div>

          {/* Technical Specs (Only in Details Page) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Specifications</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Power / Rating</span>
                <span className="font-bold text-slate-800">{item.power || '45 HP'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Operator</span>
                <span className="font-bold text-slate-800">
                  {item.operatorAvailable ? t.driverAvailable : t.selfOperate}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Fuel Type</span>
                <span className="font-bold text-slate-800">{item.fuelType || 'Diesel'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Condition</span>
                <span className="font-bold text-slate-800">{item.condition || 'Good'}</span>
              </div>
            </div>
          </div>

          {/* Cost Calculator */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-farm-800">
              <Calculator className="w-4 h-4" />
              <span>{t.estCost}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  {duration} {calcUnit === 'hour' ? t.hours : calcUnit === 'day' ? t.days : t.acres}
                </label>
                <input
                  type="range"
                  min="1"
                  max={calcUnit === 'hour' ? 24 : 15}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-farm-600 cursor-pointer"
                />
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block">{t.estimatedTotal}</span>
                <span className="text-lg font-black text-farm-800">
                  ₹{totalCost.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Buttons Footer */}
        <div className="p-3 bg-white border-t border-slate-200 grid grid-cols-2 gap-2.5">
          <a
            href={callUrl}
            className="flex items-center justify-center gap-1.5 py-2.5 bg-farm-50 hover:bg-farm-600 text-farm-800 hover:text-white border border-farm-400 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>{t.call}</span>
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-xs active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.whatsapp}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
