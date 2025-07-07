// assets/js/utils.js
// Reusable helpers

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