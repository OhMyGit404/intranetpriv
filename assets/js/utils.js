// assets/js/utils.js
// Reusable helpers and data synchronization

/**
 * Fetches and parses a JSON file.
 * @param {string} url - Path to the JSON file.
 * @returns {Promise<any>}
 */
export async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch JSON');
    return await res.json();
  } catch (e) {
    console.error(e);
    return [];
  }
}

/**
 * Gets data from localStorage if available, otherwise fetches from JSON file
 * @param {string} key - localStorage key
 * @param {string} fallbackUrl - Fallback JSON URL
 * @returns {Promise<any>}
 */
export async function getSyncedData(key, fallbackUrl) {
  try {
    // First try to get from localStorage (admin-managed data)
    const localData = localStorage.getItem(key);
    if (localData) {
      const parsed = JSON.parse(localData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    
    // Fallback to JSON file
    return await fetchJSON(fallbackUrl);
  } catch (e) {
    console.error(`Error getting synced data for ${key}:`, e);
    return [];
  }
}

/**
 * Saves data to localStorage and optionally triggers a sync event
 * @param {string} key - localStorage key
 * @param {any} data - Data to save
 */
export function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('dataUpdated', { 
      detail: { key, data } 
    }));
  } catch (e) {
    console.error(`Error saving data for ${key}:`, e);
  }
}

/**
 * Checks if admin is logged in
 * @returns {boolean}
 */
export function isAdminLoggedIn() {
  return localStorage.getItem('adminLoggedIn') === '1';
}

/**
 * Formats date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}