// LocalStorage management for user listings, favorites, and profile

const STORAGE_KEY = 'agrishare_custom_equipment_v1';
const USER_KEY = 'agrishare_user_profile_v1';

export function getCustomEquipment() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load equipment from localStorage', e);
    return [];
  }
}

export function saveCustomEquipment(item) {
  try {
    const current = getCustomEquipment();
    const updated = [{ ...item, isCustom: true }, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save equipment to localStorage', e);
    return [];
  }
}

export function removeCustomEquipment(id) {
  try {
    const current = getCustomEquipment();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove equipment from localStorage', e);
    return [];
  }
}

export function getUserProfile() {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}
