import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, MapPin, Phone, MessageCircle, Calculator, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { TRANSLATIONS } from '../utils/translations';

export default function EquipmentDetailModal({ item, distance, userLocation, language = 'en', onClose, onRemove }) {
  if (!item) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [duration, setDuration] = useState(4);
  const [calcUnit, setCalcUnit] = useState(item.priceUnit || 'hour');

  // Handle Browser / Mobile Hardware Back Button
  useEffect(() => {
    // Push history state so Android/browser back button closes modal instead of navigating away!
    window.history.pushState({ modal: 'equipment-detail' }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    // Prevent body scrolling when modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSafeClose = () => {
    // If state was pushed, pop it or call onClose
    if (window.history.state?.modal === 'equipment-detail') {
      window.history.back();
    } else {
      onClose();
    }
  };

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

  const isUserAdded = item.isCustom || (item.id && String(item.id).startsWith('custom-'));

  const handleRemove = () => {
    if (window.confirm(t.confirmRemove)) {
      if (onRemove) {
        onRemove(item.id);
      }
      handleSafeClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={handleSafeClose}
    >
      <div 
        className="bg-white w-full sm:max-w-2xl min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STICKY TOP NAVIGATION BAR - Always visible on mobile and desktop! */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-3.5 py-3 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
          {/* Prominent Back Button */}
          <button
            type="button"
            onClick={handleSafeClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <span className="font-extrabold text-slate-800 text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[280px]">
            {item.name}
          </span>

          {/* Right Actions: Remove if owner + Big 'X' Close Button */}
          <div className="flex items-center gap-2">
            {isUserAdded && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title={t.removeListing}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSafeClose}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95"
              title={t.close}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1 text-slate-800">
          
          {/* Images Carousel */}
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-900 shadow-xs">
            <img
              src={images[activeImgIndex]}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            <div className="absolute bottom-2.5 left-2.5 bg-black/75 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{item.city} {distance !== null ? `(${distance} ${t.kmAway})` : ''}</span>
            </div>
          </div>

          {/* Title & Rates */}
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

          {/* Specifications (Only in Details Page) */}
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

          {/* Rental Cost Estimator */}
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

        {/* Action Buttons Sticky Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 grid grid-cols-2 gap-3">
          <a
            href={callUrl}
            className="flex items-center justify-center gap-1.5 py-3 bg-farm-50 hover:bg-farm-600 text-farm-800 hover:text-white border border-farm-400 rounded-xl font-bold text-xs sm:text-sm transition active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>{t.call}</span>
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs sm:text-sm transition shadow-xs active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{t.whatsapp}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
