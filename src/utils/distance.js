// Haversine formula to compute distance between two lat/lon points in kilometers
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }

  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

// Default reference coordinates for Indian agricultural cities & regions
export const KNOWN_CITIES = {
  guntur: { name: 'Guntur', lat: 16.3067, lon: 80.4365, state: 'Andhra Pradesh' },
  vijayawada: { name: 'Vijayawada', lat: 16.5062, lon: 80.6480, state: 'Andhra Pradesh' },
  tenali: { name: 'Tenali', lat: 16.2437, lon: 80.6400, state: 'Andhra Pradesh' },
  amaravati: { name: 'Amaravati', lat: 16.5735, lon: 80.3575, state: 'Andhra Pradesh' },
  mangalagiri: { name: 'Mangalagiri', lat: 16.4326, lon: 80.5694, state: 'Andhra Pradesh' },
  eluru: { name: 'Eluru', lat: 16.7107, lon: 81.0952, state: 'Andhra Pradesh' },
  ongole: { name: 'Ongole', lat: 15.5057, lon: 80.0499, state: 'Andhra Pradesh' },
  bapatla: { name: 'Bapatla', lat: 15.9042, lon: 80.4674, state: 'Andhra Pradesh' },
  narasaraopet: { name: 'Narasaraopet', lat: 16.2359, lon: 80.0494, state: 'Andhra Pradesh' },
  rajahmundry: { name: 'Rajahmundry', lat: 17.0005, lon: 81.8040, state: 'Andhra Pradesh' },
  khammam: { name: 'Khammam', lat: 17.2473, lon: 80.1514, state: 'Telangana' },
  hyderabad: { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, state: 'Telangana' },
  tirupati: { name: 'Tirupati', lat: 13.6288, lon: 79.4192, state: 'Andhra Pradesh' },
};

export function getCityCoordinates(cityName) {
  if (!cityName) return KNOWN_CITIES.guntur;
  const key = cityName.toLowerCase().trim();
  if (KNOWN_CITIES[key]) return KNOWN_CITIES[key];
  
  // Fuzzy match
  for (const [k, v] of Object.entries(KNOWN_CITIES)) {
    if (key.includes(k) || k.includes(key)) {
      return v;
    }
  }
  // Default jitter around Guntur/AP
  return {
    name: cityName,
    lat: 16.3067 + (Math.random() - 0.5) * 0.15,
    lon: 80.4365 + (Math.random() - 0.5) * 0.15,
  };
}
