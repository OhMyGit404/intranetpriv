// assets/js/homepage.js
// Handles dynamic content loading for the homepage

import { getSyncedData } from './utils.js';

const featuredCourses = document.getElementById('featured-courses');

async function renderFeaturedCourses() {
  if (!featuredCourses) return;
  
  const courses = await getSyncedData('courses', 'data/courses.json');
  const featured = courses.slice(0, 3); // Show first 3 courses
  
  featuredCourses.innerHTML = featured.map(course => `
    <div class="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 lg:p-10 border border-white/20 card-hover">
      <div class="relative overflow-hidden rounded-2xl mb-6">
        <img src="${course.thumbnail || 'assets/img/26cf6bd7-ce74-4a5c-92a2-ca6d233d3411.JPG'}?v=${Date.now()}" alt="${course.name}" class="w-full h-48 lg:h-56 object-cover group-hover:scale-110 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Featured
        </div>
      </div>
      
      <h3 class="text-2xl lg:text-3xl font-bold mb-4 text-slate-800 group-hover:text-blue-600 transition-colors duration-300">${course.name}</h3>
      <p class="text-slate-600 mb-6 leading-relaxed line-clamp-3">${course.description}</p>
      
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-2 text-slate-500">
          <i class="fas fa-clock text-blue-500"></i>
          <span class="text-sm font-medium">${course.duration}</span>
        </div>
        <div class="flex items-center gap-2 text-slate-500">
          <i class="fas fa-dollar-sign text-green-500"></i>
          <span class="text-sm font-medium">${course.cost}</span>
        </div>
      </div>
      
      <a href="courses.html" class="group/btn inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <span>Learn More</span>
        <i class="fas fa-arrow-right ml-2 group-hover/btn:translate-x-1 transition-transform duration-300"></i>
      </a>
    </div>
  `).join('');
}

// Listen for admin data updates
window.addEventListener('dataUpdated', (event) => {
  if (event.detail.key === 'courses') {
    renderFeaturedCourses();
  }
});

// Initialize homepage content
renderFeaturedCourses();
