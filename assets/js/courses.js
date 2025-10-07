// assets/js/courses.js
// Dynamically loads courses from synced data and renders them as cards

import { getSyncedData } from './utils.js';

const coursesList = document.getElementById('courses-list');

async function renderCourses() {
  const courses = await getSyncedData('courses', 'data/courses.json');
  if (!coursesList) return;
  coursesList.innerHTML = courses.map(course => {
    // Handle both old format (single cost) and new format (pricing levels)
    const pricingDisplay = course.pricing ? 
      `<div class="space-y-2 mb-4">
        <div class="text-sm font-semibold text-[#8e24aa] mb-2">Pricing (Per Term):</div>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="flex justify-between">
            <span>Artisan:</span>
            <span class="font-semibold">KSh ${course.pricing.artisan?.toLocaleString() || 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span>Certificate:</span>
            <span class="font-semibold">KSh ${course.pricing.certificate?.toLocaleString() || 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span>Diploma:</span>
            <span class="font-semibold">KSh ${course.pricing.diploma?.toLocaleString() || 'N/A'}</span>
          </div>
          <div class="flex justify-between">
            <span>Higher Diploma:</span>
            <span class="font-semibold">KSh ${course.pricing.higherDiploma?.toLocaleString() || 'N/A'}</span>
          </div>
        </div>
      </div>` : 
      `<div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-500">Duration: ${course.duration}</span>
        <span class="text-sm text-gray-500">Cost: <span class="font-semibold text-[#8e24aa]">$${course.cost}</span></span>
      </div>`;

    return `
      <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col border-2 border-[#8e24aa]/20">
        ${course.thumbnail ? `<img src="${course.thumbnail}?v=${Date.now()}" alt="${course.name}" class="w-full h-48 object-cover rounded-lg mb-4 shadow-md">` : ''}
        <h2 class="text-2xl font-bold mb-2 text-[#1A237E]">${course.name}</h2>
        <p class="mb-2 text-[#4a148c]">${course.description}</p>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">Duration: ${course.duration}</span>
        </div>
        ${pricingDisplay}
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">${course.category}</span>
        </div>
        <a href="#" class="mt-auto bg-[#8e24aa] text-white px-4 py-2 rounded hover:bg-[#6d1b7b] transition text-center">Learn More</a>
      </div>
    `;
  }).join('');
}

// Listen for admin data updates
window.addEventListener('dataUpdated', (event) => {
  if (event.detail.key === 'courses') {
    renderCourses();
  }
});

renderCourses();