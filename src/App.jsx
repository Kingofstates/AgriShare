import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import FilterBar from './components/FilterBar';
import EquipmentCard from './components/EquipmentCard';
import EquipmentDetailModal from './components/EquipmentDetailModal';
import AddEquipmentModal from './components/AddEquipmentModal';
import ProjectInfoModal from './components/ProjectInfoModal';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

import { DEFAULT_EQUIPMENT } from './data/equipmentData';
import { getCustomEquipment, saveCustomEquipment } from './utils/storage';
import { calculateDistance, KNOWN_CITIES, getCityCoordinates } from './utils/distance';
import { Sparkles, MapPin, RefreshCw, PlusCircle, Search, SlidersHorizontal, AlertCircle } from 'lucide-react';

export default function App() {
  // Equipment Data (Preloaded + Custom)
  const [equipmentList, setEquipmentList] = useState([]);
  
  // User Location State (Default: Guntur, Andhra Pradesh)
  const [userLocation, setUserLocation] = useState({
    city: 'Guntur',
    lat: 16.3067,
    lon: 80.4365,
    isGps: false,
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Filters and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('distance-asc'); // Nearest first by default!
  const [maxDistance, setMaxDistance] = useState(9999); // Max radius km
  const [language, setLanguage] = useState('en');

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Load Initial Equipment from Seed & LocalStorage
  useEffect(() => {
    const custom = getCustomEquipment();
    setEquipmentList([...custom, ...DEFAULT_EQUIPMENT]);
  }, []);

  // Detect GPS Location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find closest known AP city or label as Current Location
        let closestCity = 'Current GPS Location';
        let minD = 99999;
        for (const [key, val] of Object.entries(KNOWN_CITIES)) {
          const d = calculateDistance(latitude, longitude, val.lat, val.lon);
          if (d !== null && d < minD) {
            minD = d;
            closestCity = `${val.name} Area`;
          }
        }

        setUserLocation({
          city: minD < 40 ? closestCity : 'My Location',
          lat: latitude,
          lon: longitude,
          isGps: true,
        });
        setIsDetectingLocation(false);
      },
      (error) => {
        console.warn('Geolocation access error:', error);
        setIsDetectingLocation(false);
        // Fallback to default Guntur
        setUserLocation({
          city: 'Guntur (Default)',
          lat: 16.3067,
          lon: 80.4365,
          isGps: false,
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Add new equipment handler
  const handleAddEquipment = (newItem) => {
    const updated = saveCustomEquipment(newItem);
    setEquipmentList([newItem, ...equipmentList]);
  };

  // Calculate distances & Filter / Sort
  const processedEquipment = useMemo(() => {
    return equipmentList
      .map((item) => {
        // Calculate distance from user's current coordinates to machinery's coordinates
        const itemCoords = item.lat && item.lon 
          ? { lat: item.lat, lon: item.lon }
          : getCityCoordinates(item.city);

        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          itemCoords.lat,
          itemCoords.lon
        );

        return {
          ...item,
          calculatedDistance: dist !== null ? dist : 5.0,
        };
      })
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // City filter
        if (selectedCity !== 'all' && item.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // Max distance filter
        if (item.calculatedDistance > maxDistance) {
          return false;
        }

        // Search keyword filter (matches name, model, description, city, village, category)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchBrand = item.brand?.toLowerCase().includes(q);
          const matchModel = item.model?.toLowerCase().includes(q);
          const matchCity = item.city?.toLowerCase().includes(q);
          const matchVillage = item.village?.toLowerCase().includes(q);
          const matchCat = item.category?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchModel && !matchCity && !matchVillage && !matchCat && !matchDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance-asc') {
          return a.calculatedDistance - b.calculatedDistance;
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'rating-desc') {
          return (b.ownerRating || 0) - (a.ownerRating || 0);
        }
        return 0;
      });
  }, [equipmentList, userLocation, selectedCategory, selectedCity, searchTerm, maxDistance, sortBy]);

  return (
    <div className="min-h-screen bg-[#f7faf7] flex flex-col selection:bg-farm-600 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        currentLocation={userLocation}
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Hero Banner with Voice Search & GPS */}
      <HeroBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
        currentLocation={userLocation}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        totalResults={processedEquipment.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Proximity notice alert */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-farm-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-farm-600 shrink-0" />
            <span>
              Showing machinery sorted by <strong>closest distance to {userLocation.city}</strong>.
            </span>
          </div>
          <button
            onClick={handleDetectLocation}
            className="text-farm-700 hover:text-farm-800 font-bold underline cursor-pointer flex items-center gap-1 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>Recalculate Proximity</span>
          </button>
        </div>

        {/* Equipment Cards Grid */}
        {processedEquipment.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {processedEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                distance={item.calculatedDistance}
                userLocation={userLocation}
                onSelect={(eq) => setSelectedEquipment(eq)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-farm-600 flex items-center justify-center mx-auto text-2xl">
              🌾
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Machinery Found</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              No equipment found matching "{searchTerm || selectedCategory}". Try searching another keyword, widening distance, or list your own tractor!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedCity('all');
                  setMaxDistance(9999);
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                + Rent Out Your Equipment
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Equipment Full Detail Modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          item={selectedEquipment}
          distance={selectedEquipment.calculatedDistance}
          userLocation={userLocation}
          onClose={() => setSelectedEquipment(null)}
        />
      )}

      {/* Add / Upload Equipment Modal */}
      {isAddModalOpen && (
        <AddEquipmentModal
          userLocation={userLocation}
          onClose={() => setIsAddModalOpen(false)}
          onAddEquipment={handleAddEquipment}
        />
      )}

      {/* CSP Project Overview Modal */}
      {isProjectModalOpen && (
        <ProjectInfoModal
          onClose={() => setIsProjectModalOpen(false)}
        />
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
      />

      {/* Footer */}
      <Footer
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

    </div>
  );
}
