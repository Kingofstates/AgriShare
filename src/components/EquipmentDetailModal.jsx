import React, { useState } from 'react';
import { X, MapPin, Phone, MessageCircle, Star, ShieldCheck, Fuel, Gauge, Award, Clock, ChevronLeft, ChevronRight, CheckCircle2, Calculator, AlertCircle } from 'lucide-react';

export default function EquipmentDetailModal({ item, distance, userLocation, onClose }) {
  if (!item) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [calcDuration, setCalcDuration] = useState(4); // Default 4 hours or days
  const [calcMode, setCalcMode] = useState(item.priceUnit || 'hour');

  const defaultPhone = '+918978112802';
  const cleanPhone = (item.ownerPhone || defaultPhone).replace(/[^0-9]/g, '');

  const renterLocationText = userLocation?.city ? `${userLocation.city}` : 'nearby region';
  const waMessage = encodeURIComponent(
    `Hello! I would like to rent your "${item.name}" located in ${item.city} (${item.village || ''}). I am contacting you from ${renterLocationText}. Please let me know its availability for my farming schedule. Thank you!`
  );
  const waUrl = `https://wa.me/${cleanPhone}?text=${waMessage}`;
  const callUrl = `tel:${item.ownerPhone || defaultPhone}`;

  const images = item.images && item.images.length > 0
    ? item.images
    : ['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80'];

  // Calculate estimated total
  let rate = item.price;
  if (calcMode === 'day' && item.dayPrice) rate = item.dayPrice;
  if (calcMode === 'acre' && item.acrePrice) rate = item.acrePrice;
  const totalCost = rate * calcDuration;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-emerald-200/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-farm-100 text-farm-800 border border-farm-200">
              {item.category}
            </span>
            {item.verified && (
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-600 text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Listing
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          
          {/* Photos Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={images[activeImgIndex]}
                alt={item.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-xs transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Distance Floating Tag */}
              <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{item.city}, {item.village || ''}</span>
                {distance !== null && <span className="text-emerald-300 font-bold">({distance} km from you)</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImgIndex === idx ? 'border-farm-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title, Rates & Owner Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                {item.name}
              </h2>

              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                <span className="font-semibold text-farm-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {item.power}
                </span>
                <span>•</span>
                <span>Model Year: {item.year || '2023'}</span>
                <span>•</span>
                <span>Fuel: {item.fuelType}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {item.ownerRating || 4.9} ({item.reviewsCount || 15} reviews)
                </span>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Machinery Description & Condition
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {item.description || 'Reliable and well-maintained farming machinery available for rent directly from local equipment owner.'}
                </p>
              </div>
            </div>

            {/* Owner & Rates Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-farm-800 uppercase tracking-wider">Rental Charges</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ₹{item.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm font-semibold text-slate-600">
                    /{item.priceUnit || 'hour'}
                  </span>
                </div>
                {item.dayPrice && (
                  <p className="text-xs text-slate-600 mt-1">
                    Day Rate: <span className="font-bold text-slate-800">₹{item.dayPrice.toLocaleString('en-IN')}</span> / day (8-10 hrs)
                  </p>
                )}
                {item.acrePrice && (
                  <p className="text-xs text-slate-600">
                    Acre Rate: <span className="font-bold text-slate-800">₹{item.acrePrice.toLocaleString('en-IN')}</span> / acre
                  </p>
                )}
              </div>

              {/* Owner Info */}
              <div className="pt-3 border-t border-emerald-200 text-xs sm:text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-farm-600 text-white flex items-center justify-center font-bold">
                    {item.ownerName ? item.ownerName.charAt(0) : 'F'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{item.ownerName || 'Verified Equipment Owner'}</div>
                    <div className="text-[11px] text-slate-500">Local Farmer / Equipment Host</div>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 text-xs text-slate-600 space-y-1">
                  <div>📞 Contact: <span className="font-bold text-slate-800">{item.ownerPhone || defaultPhone}</span></div>
                  <div>📍 Base Village: <span className="font-semibold text-slate-800">{item.village || item.city}</span></div>
                </div>
              </div>
            </div>

          </div>

          {/* Technical Specifications Grid (From PPT Modules) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-farm-600" />
              Technical Specifications & Compliance Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Engine / Capacity</span>
                <span className="font-semibold text-slate-800">{item.specs?.engine || item.power}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Operator / Driver</span>
                <span className="font-semibold text-slate-800">
                  {item.operatorAvailable ? 'Skilled Driver Available' : 'Self-Operation Only'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Insurance Status</span>
                <span className="font-semibold text-emerald-700">{item.insuranceValidUntil ? `Valid till ${item.insuranceValidUntil}` : 'Insured'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Registration / Permit</span>
                <span className="font-semibold text-slate-800">{item.registrationNumber || 'AP Commercial Ag. Registered'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Fuel Policy</span>
                <span className="font-semibold text-slate-800">{item.specs?.fuelPolicy || 'Direct arrangement with owner'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Attachments / Implements</span>
                <span className="font-semibold text-slate-800">
                  {item.specs?.implements ? item.specs.implements.join(', ') : 'Standard attachments'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Rental Cost Calculator */}
          <div className="bg-gradient-to-r from-emerald-500/10 via-farm-500/10 to-harvest-500/10 p-4 sm:p-5 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-farm-700" />
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Instant Rental Cost Estimator
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Duration Unit</label>
                <div className="flex rounded-xl bg-white p-1 border border-slate-200">
                  {['hour', 'day', 'acre'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCalcMode(mode)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                        calcMode === mode ? 'bg-farm-600 text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Quantity: <span className="font-bold text-slate-900">{calcDuration} {calcMode}(s)</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max={calcMode === 'hour' ? 24 : calcMode === 'day' ? 15 : 20}
                  value={calcDuration}
                  onChange={(e) => setCalcDuration(Number(e.target.value))}
                  className="w-full accent-farm-600 cursor-pointer"
                />
              </div>

              <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-4">
                <span className="text-xs text-slate-500 font-medium">Estimated Total</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-farm-800">
                  ₹{totalCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 grid grid-cols-2 gap-3 sm:gap-4">
          
          <a
            href={callUrl}
            className="flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 bg-emerald-50 hover:bg-farm-600 text-farm-800 hover:text-white border border-farm-300 hover:border-farm-600 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-sm active:scale-95"
          >
            <Phone className="w-5 h-5" />
            <span>Call {item.ownerPhone || defaultPhone}</span>
          </a>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#25D366]/30 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>

        </div>

      </div>
    </div>
  );
}
