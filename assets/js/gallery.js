// assets/js/gallery.js
// Renders a responsive masonry gallery and lightbox modal

import { fetchJSON } from './utils.js';

const galleryGrid = document.getElementById('gallery-grid');
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.getElementById('close-lightbox');

async function renderGallery() {
  const images = await fetchJSON('data/gallery.json');
  if (!galleryGrid) return;
  galleryGrid.innerHTML = images.map(img => `
    <img src="${img.src}" alt="${img.alt}" class="w-full mb-4 rounded shadow cursor-pointer hover:opacity-80 transition" loading="lazy" tabindex="0" data-src="${img.src}" />
  `).join('');
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

renderGallery();