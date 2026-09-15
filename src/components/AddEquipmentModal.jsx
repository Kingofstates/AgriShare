import React, { useState } from 'react';
import { X, Upload, Camera, MapPin, Sparkles, Plus, Trash2 } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import confetti from 'canvas-confetti';
import { getCityCoordinates } from '../utils/distance';
import { TRANSLATIONS } from '../utils/translations';

export default function AddEquipmentModal({ onClose, onAddEquipment, userLocation, language = 'en' }) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Form State - Phone is EMPTY by default as explicitly requested!
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState(''); // EMPTY by default!
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

  // Quick preset photos
  const samplePresets = [
    { label: 'Tractor', url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=800&q=80' },
    { label: 'Rotavator', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80' },
    { label: 'Harvester', url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80' },
    { label: 'Power Tiller', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80' },
    { label: 'Water Pump', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80' },
  ];

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

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      
      <div 
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-farm-800 text-white px-4 py-3 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold font-heading">
            {t.uploadTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-emerald-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[78vh] space-y-3.5 text-xs sm:text-sm">
          
          {/* Owner Name with Voice Input */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t.yourName} *
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white">
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

          {/* Phone Number (Numeric Keypad ONLY, EMPTY by default) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t.phoneNumber} *
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white">
              <span className="font-bold text-slate-500 mr-2">+91</span>
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

          {/* City with GPS Location Button */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t.cityTown} *
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white">
                <MapPin className="w-3.5 h-3.5 text-farm-600 mr-1.5 shrink-0" />
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
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-farm-800 font-bold text-xs rounded-lg border border-emerald-300 flex items-center gap-1 shrink-0"
              >
                <MapPin className={`w-3.5 h-3.5 ${isLocating ? 'animate-bounce text-red-500' : 'text-farm-600'}`} />
                <span>{isLocating ? t.locating : t.detectGps}</span>
              </button>
            </div>
          </div>

          {/* Equipment Name (Simple Name, Voice input) */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t.equipmentTitle} *
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white">
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
            <label className="font-bold text-slate-700 block mb-1">
              {t.categoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-semibold text-slate-800 focus:outline-none"
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
            <label className="font-bold text-slate-700 block mb-1">
              {t.rentalRate} (₹) *
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white">
                <span className="font-bold text-slate-400 mr-1">₹</span>
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
                className="w-28 bg-slate-50 border border-slate-300 rounded-lg px-2 font-bold text-slate-800 text-xs focus:outline-none"
              >
                <option value="hour">{t.perHour}</option>
                <option value="day">{t.perDay}</option>
                <option value="acre">{t.perAcre}</option>
              </select>
            </div>
          </div>

          {/* Photos Upload & Presets */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t.uploadPhotos}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              <label className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg cursor-pointer text-xs font-bold transition">
                <Upload className="w-3.5 h-3.5 text-farm-700" />
                <span>Device Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <label className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg cursor-pointer text-xs font-bold transition">
                <Camera className="w-3.5 h-3.5 text-farm-700" />
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
            <div className="flex gap-2 overflow-x-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-16 h-12 rounded overflow-hidden shrink-0 border border-slate-300">
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description with Voice Input */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t.description}
            </label>
            <div className="relative bg-slate-50 border border-slate-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-farm-600 focus-within:bg-white">
              <textarea
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="w-full bg-transparent text-xs text-slate-900 focus:outline-none resize-none"
              />
              <div className="flex justify-end">
                <VoiceInputButton lang={language} onTranscript={(text) => setDescription((prev) => prev ? `${prev} ${text}` : text)} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-lg shadow transition active:scale-95 text-xs sm:text-sm"
            >
              {t.publishListing}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
