import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import SearchBarAndFilters from './components/SearchBarAndFilters';
import EquipmentCard from './components/EquipmentCard';
import EquipmentDetailModal from './components/EquipmentDetailModal';
import AddEquipmentModal from './components/AddEquipmentModal';
import Footer from './components/Footer';

import { DEFAULT_EQUIPMENT } from './data/equipmentData';
import { getCustomEquipment, saveCustomEquipment } from './utils/storage';
import { calculateDistance, KNOWN_CITIES, getCityCoordinates } from './utils/distance';
import { TRANSLATIONS } from './utils/translations';
import { RefreshCw } from 'lucide-react';

export default function App() {
  // Equipment Data
  const [equipmentList, setEquipmentList] = useState([]);
  
  // User Location State
  const [userLocation, setUserLocation] = useState({
    city: 'Guntur',
    lat: 16.3067,
    lon: 80.4365,
    isGps: false,
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Filters, Search & Language
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance-asc');
  const [language, setLanguage] = useState('en'); // 'en' | 'te' | 'hi'

  // Modals
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Load Initial Equipment
  useEffect(() => {
    const custom = getCustomEquipment();
    setEquipmentList([...custom, ...DEFAULT_EQUIPMENT]);
  }, []);

  // GPS Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        let closestCity = 'Current Location';
        let minD = 99999;
        for (const [key, val] of Object.entries(KNOWN_CITIES)) {
          const d = calculateDistance(latitude, longitude, val.lat, val.lon);
          if (d !== null && d < minD) {
            minD = d;
            closestCity = val.name;
          }
        }

        setUserLocation({
          city: minD < 35 ? closestCity : 'My Location',
          lat: latitude,
          lon: longitude,
          isGps: true,
        });
        setIsDetectingLocation(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsDetectingLocation(false);
        setUserLocation({
          city: 'Guntur',
          lat: 16.3067,
          lon: 80.4365,
          isGps: false,
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Add Equipment Handler
  const handleAddEquipment = (newItem) => {
    saveCustomEquipment(newItem);
    setEquipmentList([newItem, ...equipmentList]);
  };

  // Compute distances, filter & sort
  const processedEquipment = useMemo(() => {
    return equipmentList
      .map((item) => {
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

        // Search filter (name, translated names, full name, city)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchTe = item.name_te?.toLowerCase().includes(q);
          const matchHi = item.name_hi?.toLowerCase().includes(q);
          const matchFull = item.fullName?.toLowerCase().includes(q);
          const matchCity = item.city?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchTe && !matchHi && !matchFull && !matchCity && !matchDesc) {
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
        return 0;
      });
  }, [equipmentList, userLocation, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-farm-600 selection:text-white">
      
      {/* 1. Amazon-Style Top Bar */}
      <Navbar
        currentLocation={userLocation}
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. Compact Search & Horizontal Scrollable Category Filter Chips */}
      <SearchBarAndFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        language={language}
        totalResults={processedEquipment.length}
      />

      {/* 3. Main Product Grid (Amazon Mobile style 2-col or compact cards) */}
      <main className="max-w-6xl mx-auto px-2.5 sm:px-4 py-4 flex-1 w-full">
        
        {processedEquipment.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {processedEquipment.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                distance={item.calculatedDistance}
                userLocation={userLocation}
                language={language}
                onSelect={(eq) => setSelectedEquipment(eq)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 max-w-sm mx-auto my-6 space-y-3">
            <span className="text-3xl block">🌾</span>
            <h3 className="font-bold text-slate-800 text-sm">{t.noMachinesFound}</h3>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-1.5 bg-farm-700 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              {t.resetFilters}
            </button>
          </div>
        )}

      </main>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          item={selectedEquipment}
          distance={selectedEquipment.calculatedDistance}
          userLocation={userLocation}
          language={language}
          onClose={() => setSelectedEquipment(null)}
        />
      )}

      {/* Add Equipment Modal */}
      {isAddModalOpen && (
        <AddEquipmentModal
          userLocation={userLocation}
          language={language}
          onClose={() => setIsAddModalOpen(false)}
          onAddEquipment={handleAddEquipment}
        />
      )}

      {/* Clean Footer (No personal phone numbers, no college project text) */}
      <Footer language={language} />

    </div>
  );
}
