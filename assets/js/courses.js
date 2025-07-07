// assets/js/courses.js
// Dynamically loads courses from JSON and renders them as cards

import { fetchJSON } from './utils.js';

const coursesList = document.getElementById('courses-list');

async function renderCourses() {
  const courses = await fetchJSON('../../data/courses.json');
  if (!coursesList) return;
  coursesList.innerHTML = courses.map(course => `
    <div class="bg-white rounded-lg shadow p-6 flex flex-col">
      <h2 class="text-xl font-bold mb-2">${course.name}</h2>
      <p class="mb-2 text-gray-700">${course.description}</p>
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-500">Duration: ${course.duration}</span>
        <span class="text-sm text-gray-500">Cost: <span class="font-semibold text-indigo-600">$${course.cost}</span></span>
      </div>
      <a href="contact.html" class="mt-auto bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-center">Enroll</a>
    </div>
  `).join('');
}

renderCourses();