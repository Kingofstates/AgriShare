import React, { useState } from 'react';
import { X, Upload, Camera, Mic, MapPin, Sparkles, Plus, Trash2, CheckCircle2, Shield, Info } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';
import confetti from 'canvas-confetti';
import { getCityCoordinates } from '../utils/distance';

export default function AddEquipmentModal({ onClose, onAddEquipment, userLocation }) {
  // Step tracker: 1: Owner Details, 2: Equipment Info, 3: Photos & Pricing
  const [step, setStep] = useState(1);

  // Form State
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('+918978112802');
  const [city, setCity] = useState(userLocation?.city || 'Guntur');
  const [village, setVillage] = useState('');
  const [category, setCategory] = useState('Tractors');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [power, setPower] = useState('45 HP');
  const [fuelType, setFuelType] = useState('Diesel');
  const [operatorAvailable, setOperatorAvailable] = useState(true);
  const [condition, setCondition] = useState('Excellent Condition');
  const [price, setPrice] = useState(600);
  const [priceUnit, setPriceUnit] = useState('hour');
  const [dayPrice, setDayPrice] = useState(4000);
  const [acrePrice, setAcrePrice] = useState(850);
  const [description, setDescription] = useState('');
  const [insuranceValidUntil, setInsuranceValidUntil] = useState('Dec 2026');
  const [registrationNumber, setRegistrationNumber] = useState('');
  
  // Photos
  const [images, setImages] = useState([
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80'
  ]);
  const [isDetectingCity, setIsDetectingCity] = useState(false);

  // Preset sample pictures that farmers can choose quickly
  const samplePresets = [
    { label: 'Mahindra Tractor', url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80' },
    { label: 'John Deere Tractor', url: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Harvester', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Power Tiller', url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80' },
    { label: 'Drone Sprayer', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80' },
  ];

  // GPS Detect for City
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingCity(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingCity(false);
        setCity('Guntur (Current Location)');
        setVillage('Nearby Village');
      },
      (err) => {
        setIsDetectingCity(false);
        setCity('Guntur');
      }
    );
  };

  // Handle local image file upload
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
      alert('Please enter equipment name or speak it using the microphone.');
      return;
    }

    const cityCoords = getCityCoordinates(city);

    const newEquipment = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      brand: name.split(' ')[0] || 'Custom',
      model: model || name,
      year: new Date().getFullYear(),
      power: power || '40 HP',
      fuelType,
      condition,
      operatorAvailable,
      operatorIncludedInPrice: operatorAvailable,
      price: Number(price) || 500,
      priceUnit,
      dayPrice: Number(dayPrice) || (Number(price) * 7),
      acrePrice: Number(acrePrice) || (Number(price) * 1.5),
      city: city.trim() || 'Guntur',
      village: village.trim() || 'Local Farmland',
      state: 'Andhra Pradesh',
      lat: cityCoords.lat,
      lon: cityCoords.lon,
      ownerName: ownerName.trim() || 'Farmer Host',
      ownerPhone: ownerPhone.trim() || '+918978112802',
      ownerRating: 5.0,
      reviewsCount: 1,
      verified: true,
      insuranceValidUntil,
      registrationNumber: registrationNumber || 'AP New Listing',
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?auto=format&fit=crop&w=1000&q=80'],
      description: description.trim() || `Available for rent in ${city}. Contact for immediate farm operation.`,
      specs: {
        engine: power,
        fuelPolicy: 'Direct arrangement with owner',
      }
    };

    onAddEquipment(newEquipment);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl border border-emerald-300/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-farm-800 to-farm-700 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Farmer Machinery Hub
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading">
              List Your Machinery for Rent
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress */}
        <div className="bg-emerald-50/80 px-5 py-3 border-b border-emerald-100 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-farm-800 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-farm-700 text-white' : 'bg-slate-200'}`}>1</span>
            <span>Owner Info</span>
          </div>
          <div className="h-0.5 w-8 bg-emerald-200"></div>
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-farm-800 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-farm-700 text-white' : 'bg-slate-200'}`}>2</span>
            <span>Equipment Specs</span>
          </div>
          <div className="h-0.5 w-8 bg-emerald-200"></div>
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-farm-800 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-farm-700 text-white' : 'bg-slate-200'}`}>3</span>
            <span>Photos & Pricing</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto max-h-[70vh] space-y-5">
          
          {/* STEP 1: OWNER DETAILS */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-farm-600 shrink-0" />
                <span>Enter your contact details so nearby farmers can call or WhatsApp you directly.</span>
              </div>

              {/* Owner Name with Voice Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Your Full Name *</span>
                  <span className="text-emerald-700 font-normal">Click mic to speak</span>
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Chowdary"
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                  />
                  <VoiceInputButton onTranscript={(text) => setOwnerName(text)} />
                </div>
              </div>

              {/* Phone Number (Numeric Keypad) */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Contact Phone Number * (Opens numeric keypad)
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                  <span className="text-sm font-bold text-farm-700 mr-2">🇮🇳</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9+ ]*"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+91 8978112802"
                    className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Default test phone: +918978112802</p>
              </div>

              {/* City / Location with GPS Auto-Detect Button */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>City / Town / Mandalam *</span>
                  <span className="text-emerald-700 font-normal">Click mic to speak</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                    <MapPin className="w-4 h-4 text-farm-600 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Guntur, Tenali, Vijayawada"
                      className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                    />
                    <VoiceInputButton onTranscript={(text) => setCity(text)} />
                  </div>

                  {/* GPS Detect Location button */}
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingCity}
                    className="px-3.5 py-2 bg-farm-100 hover:bg-farm-200 text-farm-800 font-bold text-xs rounded-xl border border-farm-300 flex items-center gap-1.5 shrink-0 transition active:scale-95"
                    title="Get current GPS Location"
                  >
                    <MapPin className={`w-3.5 h-3.5 ${isDetectingCity ? 'animate-bounce text-red-500' : 'text-farm-600'}`} />
                    <span>{isDetectingCity ? 'Locating...' : 'GPS Auto'}</span>
                  </button>
                </div>
              </div>

              {/* Village / Landmark */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Village / Area Landmark</span>
                  <span className="text-emerald-700 font-normal">Click mic to speak</span>
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Nambur, Near High School"
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none"
                  />
                  <VoiceInputButton onTranscript={(text) => setVillage(text)} />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!ownerName || !ownerPhone || !city) {
                      alert('Please complete Name, Phone, and City.');
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-3 bg-farm-600 hover:bg-farm-700 text-white font-bold rounded-xl shadow-md transition active:scale-95"
                >
                  Continue to Equipment Details →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EQUIPMENT SPECS */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">
                  Equipment Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-farm-500"
                >
                  <option value="Tractors">🚜 Tractor</option>
                  <option value="Harvesters">🌾 Combine Harvester</option>
                  <option value="Tillers">⚙️ Power Tiller / Rotary</option>
                  <option value="Drones">🚁 Agricultural Drone Sprayer</option>
                  <option value="Sprayers">💦 Boom / Power Sprayer</option>
                  <option value="Cultivators">🌱 Cultivator / Plough / Seed Drill</option>
                  <option value="Water Pumps">🚰 Diesel Water Pump</option>
                </select>
              </div>

              {/* Machinery Name & Model with Voice Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Machinery Name & Model *</span>
                  <span className="text-emerald-700 font-normal">Click mic to speak</span>
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Mahindra 575 DI 45 HP Tractor"
                    className="w-full bg-transparent text-sm text-slate-800 focus:outline-none font-semibold"
                  />
                  <VoiceInputButton onTranscript={(text) => setName(text)} />
                </div>
              </div>

              {/* Power / HP and Fuel Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Power / Capacity</span>
                    <span className="text-emerald-700 font-normal">Mic</span>
                  </label>
                  <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                    <input
                      type="text"
                      value={power}
                      onChange={(e) => setPower(e.target.value)}
                      placeholder="e.g. 45 HP or 16L"
                      className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none"
                    />
                    <VoiceInputButton onTranscript={(text) => setPower(text)} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">
                    Fuel Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Electric Battery">Electric Battery</option>
                    <option value="Tractor PTO Driven">Tractor PTO</option>
                  </select>
                </div>
              </div>

              {/* Operator Included and Condition */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={operatorAvailable}
                      onChange={(e) => setOperatorAvailable(e.target.checked)}
                      className="w-4 h-4 text-farm-600 rounded accent-farm-600 cursor-pointer"
                    />
                    <span>Driver / Operator Available</span>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Excellent Condition">Excellent (Like New)</option>
                    <option value="Very Good">Very Good Working</option>
                    <option value="Good Operational">Good Operational</option>
                  </select>
                </div>
              </div>

              {/* Insurance & Registration status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Insurance Valid Till</label>
                  <input
                    type="text"
                    value={insuranceValidUntil}
                    onChange={(e) => setInsuranceValidUntil(e.target.value)}
                    placeholder="e.g. Dec 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Reg Number (Optional)</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. AP 07 BK 1234"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!name) {
                      alert('Please enter machinery name');
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 py-3 bg-farm-600 hover:bg-farm-700 text-white font-bold rounded-xl shadow-md transition active:scale-95"
                >
                  Continue to Photos & Pricing →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PHOTOS, PRICING & DESCRIPTION */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* Photo Upload Section */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Machinery Photos (Upload or Choose Presets)</span>
                  <span className="text-xs text-farm-700 font-bold">{images.length} photos ready</span>
                </label>

                {/* Upload Buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-farm-50 hover:bg-farm-100 text-farm-800 border border-farm-200 rounded-xl cursor-pointer text-xs font-bold transition">
                    <Upload className="w-4 h-4 text-farm-600" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <label className="flex items-center gap-1.5 px-3 py-2 bg-farm-50 hover:bg-farm-100 text-farm-800 border border-farm-200 rounded-xl cursor-pointer text-xs font-bold transition">
                    <Camera className="w-4 h-4 text-farm-600" />
                    <span>Take Camera Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="mb-2">
                  <span className="text-[11px] text-slate-500 block mb-1">Or pick realistic preset image:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {samplePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImages([preset.url, ...images.filter(u => u !== preset.url)])}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-farm-800 rounded-lg text-[11px] font-medium whitespace-nowrap border border-slate-200 transition"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uploaded Images Thumbnails */}
                <div className="flex gap-2 overflow-x-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 group border border-slate-300">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Hourly Rate (₹)</label>
                  <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                    <span className="text-xs font-bold text-slate-400 mr-1">₹</span>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      placeholder="600"
                      className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Day Rate (₹)</label>
                  <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                    <span className="text-xs font-bold text-slate-400 mr-1">₹</span>
                    <input
                      type="number"
                      value={dayPrice}
                      onChange={(e) => setDayPrice(Number(e.target.value))}
                      placeholder="4000"
                      className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-700 mb-1 block">Acre Rate (₹)</label>
                  <div className="relative flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                    <span className="text-xs font-bold text-slate-400 mr-1">₹</span>
                    <input
                      type="number"
                      value={acrePrice}
                      onChange={(e) => setAcrePrice(Number(e.target.value))}
                      placeholder="850"
                      className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description with Voice Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Detailed Description / Instructions</span>
                  <span className="text-emerald-700 font-normal">Click mic to speak description</span>
                </label>
                <div className="relative bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus-within:ring-2 focus-within:ring-farm-500 focus-within:bg-white">
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Speak or type condition, attachments included, preferred farming tasks..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end pt-1">
                    <VoiceInputButton onTranscript={(text) => setDescription((prev) => prev ? `${prev} ${text}` : text)} />
                  </div>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-farm-600 to-emerald-500 hover:from-farm-700 hover:to-emerald-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-farm-600/30 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-harvest-300" />
                  <span>Publish Equipment Listing</span>
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
}
