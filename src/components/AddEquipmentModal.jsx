import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Upload, Camera, MapPin, Sparkles, Plus, Trash2 } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import confetti from 'canvas-confetti';
import { getCityCoordinates } from '../utils/distance';
import { TRANSLATIONS } from '../utils/translations';

export default function AddEquipmentModal({ onClose, onAddEquipment, userLocation, language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Handle Browser / Mobile Hardware Back Button
  useEffect(() => {
    window.history.pushState({ modal: 'add-equipment' }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSafeClose = () => {
    if (window.history.state?.modal === 'add-equipment') {
      window.history.back();
    } else {
      onClose();
    }
  };

  // Form State - Phone is completely EMPTY by default!
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [city, setCity] = useState(userLocation?.city || 'Guntur');
  const [category, setCategory] = useState('Tractors');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('hour');
  const [description, setDescription] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Photos
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'
  ]);

  // GPS Detect for Current Location
  const handleDetectCity = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not available');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setCity('Current Location');
      },
      (err) => {
        setIsLocating(false);
        setCity('Guntur');
      }
    );
  };

  // Upload local images
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter or speak machinery name');
      return;
    }
    if (!ownerPhone.trim()) {
      alert('Please enter your phone number');
      return;
    }

    const cityCoords = getCityCoordinates(city);

    const newEquipment = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      fullName: name.trim(),
      category,
      isCustom: true,
      condition: 'Good Working Condition',
      operatorAvailable: true,
      price: Number(price) || 500,
      priceUnit,
      dayPrice: Number(price) * 7,
      acrePrice: Number(price) * 1.5,
      city: city.trim() || 'Guntur',
      lat: cityCoords.lat,
      lon: cityCoords.lon,
      ownerName: ownerName.trim() || 'Equipment Owner',
      ownerPhone: ownerPhone.trim(),
      ownerRating: 5.0,
      reviewsCount: 1,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80'],
      description: description.trim() || `Available for rent in ${city}. Call or WhatsApp to book.`,
      specs: {
        power: 'Standard',
        fuelType: 'Diesel',
      }
    };

    onAddEquipment(newEquipment);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // ignore
    }

    handleSafeClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex flex-col items-center justify-start sm:justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={handleSafeClose}
    >
      <div 
        className="bg-white w-full sm:max-w-xl min-h-screen sm:min-h-0 sm:max-h-[92vh] sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header with Back and Close */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 border-b border-slate-200 bg-white shadow-xs">
          <button
            type="button"
            onClick={handleSafeClose}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>

          <h3 className="font-bold text-slate-900 text-sm sm:text-base font-heading">
            {t.uploadTitle}
          </h3>

          <button
            type="button"
            onClick={handleSafeClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition active:scale-95"
            title={t.close}
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body - Comfortable, Spacious Padding */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          
          {/* Owner Name with Voice Input */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.yourName} *
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white focus-within:border-farm-600 transition">
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Ramesh"
                className="w-full bg-transparent text-slate-900 focus:outline-none"
              />
              <VoiceInputButton lang={language} onTranscript={(text) => setOwnerName(text)} />
            </div>
          </div>

          {/* Phone Number (Numeric Keypad, Empty by Default) */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.phoneNumber} *
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white focus-within:border-farm-600 transition">
              <span className="font-bold text-slate-500 mr-2 shrink-0">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full bg-transparent font-semibold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* City / Village with GPS Auto-detect Button */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.cityTown} *
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white focus-within:border-farm-600 transition">
                <MapPin className="w-4 h-4 text-farm-600 mr-2 shrink-0" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Guntur, Tenali"
                  className="w-full bg-transparent text-slate-900 focus:outline-none"
                />
                <VoiceInputButton lang={language} onTranscript={(text) => setCity(text)} />
              </div>
              <button
                type="button"
                onClick={handleDetectCity}
                disabled={isLocating}
                className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-farm-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center gap-1.5 shrink-0 transition active:scale-95"
              >
                <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-red-500' : 'text-farm-600'}`} />
                <span>{isLocating ? t.locating : t.detectGps}</span>
              </button>
            </div>
          </div>

          {/* Equipment Name (Voice-to-Text enabled) */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.equipmentTitle} *
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white focus-within:border-farm-600 transition">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.simpleNameHint}
                className="w-full bg-transparent font-semibold text-slate-900 focus:outline-none"
              />
              <VoiceInputButton 
                lang={language} 
                onTranscript={(text) => setName(text)} 
                quickSuggestions={['Tractor', 'Rotavator', 'Harvester', 'Power Tiller', 'Water Pump']}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.categoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-farm-600 cursor-pointer"
            >
              <option value="Tractors">{t.tractor}</option>
              <option value="Attachments">{t.attachment}</option>
              <option value="Harvesters">{t.harvester}</option>
              <option value="Tillers">{t.tiller}</option>
              <option value="Sprayers">{t.sprayer}</option>
              <option value="Drones">{t.drone}</option>
              <option value="Pumps">{t.pump}</option>
            </select>
          </div>

          {/* Rental Price */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.rentalRate} (₹) *
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white focus-within:border-farm-600 transition">
                <span className="font-bold text-slate-400 mr-1.5">₹</span>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="600"
                  className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value)}
                className="w-32 bg-slate-50 border border-slate-300 rounded-xl px-2.5 font-bold text-slate-800 text-xs focus:outline-none cursor-pointer"
              >
                <option value="hour">{t.perHour}</option>
                <option value="day">{t.perDay}</option>
                <option value="acre">{t.perAcre}</option>
              </select>
            </div>
          </div>

          {/* Upload Photos */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.uploadPhotos}
            </label>
            <div className="flex flex-wrap gap-2.5 mb-2.5">
              <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl cursor-pointer text-xs font-bold transition active:scale-95">
                <Upload className="w-4 h-4 text-farm-700" />
                <span>Upload Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl cursor-pointer text-xs font-bold transition active:scale-95">
                <Camera className="w-4 h-4 text-farm-700" />
                <span>Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Photo thumbnails */}
            <div className="flex gap-2 overflow-x-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-18 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-300 shadow-2xs">
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description with Voice Input */}
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              {t.description}
            </label>
            <div className="relative bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white focus-within:border-farm-600 transition">
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none resize-none"
              />
              <div className="flex justify-end pt-1">
                <VoiceInputButton lang={language} onTranscript={(text) => setDescription((prev) => prev ? `${prev} ${text}` : text)} />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleSafeClose}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition active:scale-95"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm"
            >
              {t.publishListing}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
