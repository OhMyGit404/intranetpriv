// assets/js/gallery.js
// Renders a responsive masonry gallery and lightbox modal with admin sync

import { getSyncedData } from './utils.js';

const galleryGrid = document.getElementById('gallery-grid');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

async function renderGallery() {
  const images = await getSyncedData('gallery', 'data/gallery.json');
  if (!galleryGrid) return;
  
  // Create masonry-style layout with different heights
  galleryGrid.innerHTML = images.map((img, index) => {
    // Alternate between different heights for visual variety
    const heightClass = index % 4 === 0 ? 'h-64' : 
                       index % 4 === 1 ? 'h-80' : 
                       index % 4 === 2 ? 'h-72' : 'h-60';
    
    return `
      <div class="break-inside-avoid mb-6">
        <img src="${img.src}" alt="${img.alt}" 
             class="w-full ${heightClass} object-cover rounded-lg shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300" 
             loading="lazy" tabindex="0" data-src="${img.src}" />
      </div>
    `;
  }).join('');
  
  // Add click event for lightbox
  galleryGrid.querySelectorAll('img').forEach(imgEl => {
    imgEl.addEventListener('click', () => openLightbox(imgEl.dataset.src, imgEl.alt));
    imgEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openLightbox(imgEl.dataset.src, imgEl.alt);
    });
  });
}

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxModal.classList.remove('hidden');
  lightboxImg.focus();
}

if (closeLightbox) {
  closeLightbox.addEventListener('click', () => {
    lightboxModal.classList.add('hidden');
    lightboxImg.src = '';
    lightboxImg.alt = '';
  });
  // Close on Escape
  document.addEventListener('keydown', e => {
    if (!lightboxModal.classList.contains('hidden') && e.key === 'Escape') {
      lightboxModal.classList.add('hidden');
      lightboxImg.src = '';
      lightboxImg.alt = '';
    }
  });
}

// Listen for admin data updates
window.addEventListener('dataUpdated', (event) => {
  if (event.detail.key === 'gallery') {
    renderGallery();
  }
});

renderGallery();