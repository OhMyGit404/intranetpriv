// assets/js/courses.js
// Dynamically loads courses from JSON and renders them as cards

import { fetchJSON } from './utils.js';

const coursesList = document.getElementById('courses-list');

async function renderCourses() {
  const courses = await fetchJSON('data/courses.json');
  if (!coursesList) return;
  coursesList.innerHTML = courses.map(course => `
    <div class="bg-white rounded-xl shadow-lg p-6 flex flex-col border-2 border-[#8e24aa]/20">
      <h2 class="text-2xl font-bold mb-2 text-[#1A237E]">${course.name}</h2>
      <p class="mb-2 text-[#4a148c]">${course.description}</p>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-500">Duration: ${course.duration}</span>
        <span class="text-sm text-gray-500">Cost: <span class="font-semibold text-[#8e24aa]">$${course.cost}</span></span>
      </div>
      <a href="#" class="mt-auto bg-[#8e24aa] text-white px-4 py-2 rounded hover:bg-[#6d1b7b] transition text-center">Learn More</a>
    </div>
  `).join('');
}

renderCourses();