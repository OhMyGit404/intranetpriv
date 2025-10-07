// admin/js/admin.js
// Admin portal logic: login, dashboard tabs, CRUD for posts/courses/gallery, localStorage persistence, toasts

import { saveData } from '../../assets/js/utils.js';

const DEMO_EMAIL = 'admin@intranet.edu';
const DEMO_PASSWORD = 'password123';

// --- Login Page ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem('adminLoggedIn', '1');
      window.location.href = 'dashboard.html';
    } else {
      document.getElementById('login-error').classList.remove('hidden');
    }
  });
}

// --- Dashboard Auth Guard ---
if (window.location.pathname.endsWith('dashboard.html')) {
  if (!localStorage.getItem('adminLoggedIn')) {
    window.location.href = 'login.html';
  }
}

// --- Logout ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  });
}

// --- Import Data ---
const importDataBtn = document.getElementById('import-data');
if (importDataBtn) {
  importDataBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (data.posts) {
              saveData('posts', data.posts);
              showToast('Posts imported successfully');
            }
            if (data.courses) {
              saveData('courses', data.courses);
              showToast('Courses imported successfully');
            }
            if (data.gallery) {
              saveData('gallery', data.gallery);
              showToast('Gallery imported successfully');
            }
            // Refresh all views
            renderPosts();
            renderCourses();
            renderGallery();
          } catch (error) {
            showToast('Invalid data format', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });
}

// --- Export Data ---
const exportDataBtn = document.getElementById('export-data');
if (exportDataBtn) {
  exportDataBtn.addEventListener('click', () => {
    const data = {
      posts: getData('posts', []),
      courses: getData('courses', []),
      gallery: getData('gallery', []),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intranet-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully');
  });
}

// --- Reset Data ---
const resetDataBtn = document.getElementById('reset-data');
if (resetDataBtn) {
  resetDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data to default? This will remove all custom changes.')) {
      localStorage.removeItem('posts');
      localStorage.removeItem('courses');
      localStorage.removeItem('gallery');
      showToast('Data reset to default');
      // Re-initialize with default data
      initData();
    }
  });
}

// --- Tabs ---
const tabBtns = document.querySelectorAll('.tab-btn');
const tabSections = document.querySelectorAll('.tab-section');
const mobileTabs = document.getElementById('mobile-tabs');
if (tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showTab(btn.dataset.tab);
      if (mobileTabs) mobileTabs.value = btn.dataset.tab;
    });
  });
}
if (mobileTabs) {
  mobileTabs.addEventListener('change', e => {
    showTab(e.target.value);
  });
}
function showTab(tab) {
  tabSections.forEach(sec => sec.classList.add('hidden'));
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
}

// --- Toasts ---
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `fixed bottom-4 right-4 z-50 px-4 py-2 rounded shadow text-white ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

// --- Sync Status ---
function updateSyncStatus(message, type = 'success') {
  const syncStatus = document.getElementById('sync-status');
  if (!syncStatus) return;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  const color = type === 'success' ? 'text-green-300' : 'text-yellow-300';
  
  syncStatus.innerHTML = `<i class="fas ${icon} mr-2"></i>${message}`;
  syncStatus.className = `text-sm ${color}`;
  
  // Reset to success after 3 seconds
  setTimeout(() => {
    syncStatus.innerHTML = '<i class="fas fa-check-circle mr-2"></i>Data Synced';
    syncStatus.className = 'text-sm text-green-300';
  }, 3000);
}

// --- LocalStorage Data Helpers ---
function getData(key, fallback) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}

// --- Blog Posts CRUD ---
const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');
let editingPostId = null;

function renderPosts() {
  const posts = getData('posts', []);
  if (!postsList) return;
  postsList.innerHTML = posts.map(post => `
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 card-hover">
      <img src="${post.thumbnail}" alt="Thumbnail for ${post.title}" class="h-32 w-full object-cover rounded-xl mb-4 shadow-md"/>
      <h3 class="font-bold text-lg text-slate-800 mb-2">${post.title}</h3>
      <p class="text-sm text-slate-500 mb-4 flex items-center">
        <i class="fas fa-calendar-alt mr-2 text-blue-500"></i>
        ${post.date}
      </p>
      <div class="flex space-x-3 mt-auto">
        <button class="edit-post bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2" data-id="${post.id}">
          <i class="fas fa-edit"></i>
          <span>Edit</span>
        </button>
        <button class="delete-post bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2" data-id="${post.id}">
          <i class="fas fa-trash"></i>
          <span>Delete</span>
        </button>
      </div>
    </div>
  `).join('');
  // Edit/Delete handlers
  postsList.querySelectorAll('.edit-post').forEach(btn => {
    btn.addEventListener('click', () => editPost(btn.dataset.id));
  });
  postsList.querySelectorAll('.delete-post').forEach(btn => {
    btn.addEventListener('click', () => deletePost(btn.dataset.id));
  });
}
function editPost(id) {
  const posts = getData('posts', []);
  const post = posts.find(p => p.id == id);
  if (!post) return;
  document.getElementById('post-id').value = post.id;
  document.getElementById('post-title').value = post.title;
  
  // Handle thumbnail preview for editing
  const thumbnailPreview = document.getElementById('post-thumbnail-preview');
  const previewImage = document.getElementById('preview-image');
  if (post.thumbnail) {
    previewImage.src = post.thumbnail;
    thumbnailPreview.classList.remove('hidden');
  }
  
  document.getElementById('post-body').value = post.body.replace(/<[^>]+>/g, '');
  editingPostId = id;
}
function deletePost(id) {
  let posts = getData('posts', []);
  posts = posts.filter(p => p.id != id);
  saveData('posts', posts);
  showToast('Post deleted');
  renderPosts();
}
if (postForm) {
  postForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('post-id').value;
    const title = document.getElementById('post-title').value.trim();
    const thumbnailFile = document.getElementById('post-thumbnail').files[0];
    const body = document.getElementById('post-body').value.trim();
    
    if (!title || !body) {
      showToast('Title and content are required', 'error');
      return;
    }
    
    // Handle thumbnail upload
    let thumbnail = '';
    if (thumbnailFile) {
      try {
        // Show loading state
        const submitBtn = postForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Uploading...';
        submitBtn.disabled = true;
        
        // Create FormData for upload
        const formData = new FormData();
        formData.append('image', thumbnailFile);
        
        // Upload to server
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const result = await response.json();
        thumbnail = result.url;
        
        showToast('Image uploaded successfully to Firebase Storage!', 'success');
        
      } catch (error) {
        console.error('Upload error:', error);
        showToast('Failed to upload image. Please try again.', 'error');
        return;
      } finally {
        // Reset button state
        const submitBtn = postForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    } else if (editingPostId) {
      // Keep existing thumbnail when editing
      const posts = getData('posts', []);
      const existingPost = posts.find(p => p.id == editingPostId);
      thumbnail = existingPost ? existingPost.thumbnail : '';
    }
    
    if (!thumbnail) {
      showToast('Please upload a thumbnail image', 'error');
      return;
    }
    let posts = getData('posts', []);
    if (id) {
      // Edit
      posts = posts.map(p => p.id == id ? { ...p, title, thumbnail, body, slug: slugify(title) } : p);
      showToast('Post updated');
    } else {
      // Add
      const newPost = {
        id: Date.now(),
        title,
        thumbnail,
        body,
        slug: slugify(title),
        excerpt: body.substring(0, 80) + '...',
        date: new Date().toISOString().split('T')[0]
      };
      posts.unshift(newPost);
      showToast('Post added');
    }
    saveData('posts', posts);
    updateSyncStatus('Posts updated successfully');
    renderPosts();
    postForm.reset();
    // Clear thumbnail preview
    document.getElementById('post-thumbnail-preview').classList.add('hidden');
    editingPostId = null;
  });
  document.getElementById('cancel-post').addEventListener('click', () => {
    postForm.reset();
    editingPostId = null;
    // Hide thumbnail preview
    document.getElementById('post-thumbnail-preview').classList.add('hidden');
  });
  
  // Handle thumbnail file upload and preview
  const thumbnailInput = document.getElementById('post-thumbnail');
  const thumbnailPreview = document.getElementById('post-thumbnail-preview');
  const previewImage = document.getElementById('preview-image');
  const removeThumbnail = document.getElementById('remove-thumbnail');
  
  thumbnailInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        this.value = '';
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        this.value = '';
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onload = function(e) {
        previewImage.src = e.target.result;
        thumbnailPreview.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
      
      showToast('Image selected successfully!', 'success');
    }
  });
  
  // Handle remove thumbnail
  removeThumbnail.addEventListener('click', function() {
    thumbnailInput.value = '';
    thumbnailPreview.classList.add('hidden');
    showToast('Thumbnail removed', 'info');
  });
}
function slugify(str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
}

// --- Courses CRUD ---
const coursesList = document.getElementById('courses-list');
const courseForm = document.getElementById('course-form');
let editingCourseId = null;

function renderCourses() {
  const courses = getData('courses', []);
  if (!coursesList) return;
  coursesList.innerHTML = courses.map(course => {
    // Handle pricing display for both old and new formats
    const pricingDisplay = course.pricing ? 
      `<div class="space-y-1 mb-4">
        <div class="text-xs font-semibold text-purple-600 mb-1">Pricing (Per Term):</div>
        <div class="grid grid-cols-2 gap-1 text-xs">
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
      `<div class="flex items-center text-sm text-slate-500 mb-2">
        <i class="fas fa-dollar-sign mr-2 text-green-500"></i>
        <span class="font-semibold">$${course.cost}</span>
      </div>`;

    return `
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 card-hover">
        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
          <i class="fas fa-book-open text-xl text-white"></i>
        </div>
        <h3 class="font-bold text-lg text-slate-800 mb-3">${course.name}</h3>
        <p class="text-sm text-slate-600 mb-3 line-clamp-2">${course.description}</p>
        <div class="space-y-2 mb-4">
          <div class="flex items-center text-sm text-slate-500">
            <i class="fas fa-clock mr-2 text-purple-500"></i>
            <span>${course.duration}</span>
          </div>
          ${pricingDisplay}
        </div>
        <span class="inline-block bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full mb-4">${course.category}</span>
        <div class="flex space-x-3 mt-auto">
          <button class="edit-course bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2" data-id="${course.id}">
            <i class="fas fa-edit"></i>
            <span>Edit</span>
          </button>
          <button class="delete-course bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2" data-id="${course.id}">
            <i class="fas fa-trash"></i>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
  // Edit/Delete handlers
  coursesList.querySelectorAll('.edit-course').forEach(btn => {
    btn.addEventListener('click', () => editCourse(btn.dataset.id));
  });
  coursesList.querySelectorAll('.delete-course').forEach(btn => {
    btn.addEventListener('click', () => deleteCourse(btn.dataset.id));
  });
}
function editCourse(id) {
  const courses = getData('courses', []);
  const course = courses.find(c => c.id == id);
  if (!course) return;
  document.getElementById('course-id').value = course.id;
  document.getElementById('course-name').value = course.name;
  document.getElementById('course-description').value = course.description;
  document.getElementById('course-duration').value = course.duration;
  document.getElementById('course-category').value = course.category;
  
  // Handle pricing fields
  if (course.pricing) {
    document.getElementById('course-artisan').value = course.pricing.artisan || '';
    document.getElementById('course-certificate').value = course.pricing.certificate || '';
    document.getElementById('course-diploma').value = course.pricing.diploma || '';
    document.getElementById('course-higher-diploma').value = course.pricing.higherDiploma || '';
  } else {
    // For backward compatibility with old format
    document.getElementById('course-artisan').value = '';
    document.getElementById('course-certificate').value = '';
    document.getElementById('course-diploma').value = '';
    document.getElementById('course-higher-diploma').value = '';
  }
  
  editingCourseId = id;
}
function deleteCourse(id) {
  let courses = getData('courses', []);
  courses = courses.filter(c => c.id != id);
  saveData('courses', courses);
  showToast('Course deleted');
  renderCourses();
}
if (courseForm) {
  courseForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('course-id').value;
    const name = document.getElementById('course-name').value.trim();
    const description = document.getElementById('course-description').value.trim();
    const duration = document.getElementById('course-duration').value.trim();
    const category = document.getElementById('course-category').value.trim();
    
    // Get pricing values
    const artisan = document.getElementById('course-artisan').value.trim();
    const certificate = document.getElementById('course-certificate').value.trim();
    const diploma = document.getElementById('course-diploma').value.trim();
    const higherDiploma = document.getElementById('course-higher-diploma').value.trim();
    
    if (!name || !description || !duration || !category) {
      showToast('Name, description, duration, and category are required', 'error');
      return;
    }
    
    // Create pricing object
    const pricing = {
      artisan: artisan ? parseInt(artisan) : null,
      certificate: certificate ? parseInt(certificate) : null,
      diploma: diploma ? parseInt(diploma) : null,
      higherDiploma: higherDiploma ? parseInt(higherDiploma) : null
    };
    
    // Use the highest pricing level as the main cost for backward compatibility
    const cost = Math.max(...Object.values(pricing).filter(v => v !== null)) || 0;
    
    let courses = getData('courses', []);
    if (id) {
      // Edit
      courses = courses.map(c => c.id == id ? { ...c, name, description, duration, cost, category, pricing } : c);
      showToast('Course updated');
    } else {
      // Add
      const newCourse = {
        id: Date.now(),
        name,
        description,
        duration,
        cost,
        category,
        pricing
      };
      courses.unshift(newCourse);
      showToast('Course added');
    }
    saveData('courses', courses);
    updateSyncStatus('Courses updated successfully');
    renderCourses();
    courseForm.reset();
    editingCourseId = null;
  });
  document.getElementById('cancel-course').addEventListener('click', () => {
    courseForm.reset();
    editingCourseId = null;
  });
}

// --- Gallery CRUD ---
const galleryList = document.getElementById('gallery-list');
const galleryForm = document.getElementById('gallery-form');
const galleryPreview = document.getElementById('gallery-preview');
let galleryImages = getData('gallery', []);

function renderGallery() {
  if (!galleryList) return;
  galleryList.innerHTML = galleryImages.map((img, idx) => `
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20 card-hover">
      <div class="relative group">
        <img src="${img.src}" alt="${img.alt}" class="h-32 w-full object-cover rounded-xl mb-3 shadow-md group-hover:scale-105 transition-transform duration-300"/>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
          <button class="delete-gallery bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0" data-idx="${idx}">
            <i class="fas fa-trash mr-2"></i>
            Delete
          </button>
        </div>
      </div>
      <p class="text-sm text-slate-700 text-center font-medium">${img.alt}</p>
    </div>
  `).join('');
  galleryList.querySelectorAll('.delete-gallery').forEach(btn => {
    btn.addEventListener('click', () => deleteGalleryImage(btn.dataset.idx));
  });
}
function deleteGalleryImage(idx) {
  galleryImages.splice(idx, 1);
  saveData('gallery', galleryImages);
  showToast('Image deleted');
  renderGallery();
}
if (galleryForm) {
  galleryForm.addEventListener('submit', e => {
    e.preventDefault();
    const fileInput = document.getElementById('gallery-image');
    const alt = document.getElementById('gallery-alt').value.trim();
    if (!fileInput.files.length || !alt) {
      showToast('Image and alt text required', 'error');
      return;
    }
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(ev) {
      galleryImages.unshift({ src: ev.target.result, alt });
      saveData('gallery', galleryImages);
      updateSyncStatus('Gallery updated successfully');
      showToast('Image added');
      renderGallery();
      galleryForm.reset();
      galleryPreview.innerHTML = '';
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('gallery-image').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(ev) {
        galleryPreview.innerHTML = `<img src="${ev.target.result}" alt="Preview" class="h-24 rounded shadow"/>`;
      };
      reader.readAsDataURL(file);
    } else {
      galleryPreview.innerHTML = '';
    }
  });
}

// --- On Dashboard Load, initialize data from public JSON if not present ---
async function initData() {
  if (!getData('posts', null)) {
    try {
      const res = await fetch('../../data/posts.json');
      const posts = await res.json();
      saveData('posts', posts);
    } catch (e) {
      console.error('Failed to load posts:', e);
    }
  }
  if (!getData('courses', null)) {
    try {
      const res = await fetch('../../data/courses.json');
      const courses = await res.json();
      saveData('courses', courses);
    } catch (e) {
      console.error('Failed to load courses:', e);
    }
  }
  if (!getData('gallery', null)) {
    try {
      const res = await fetch('../../data/gallery.json');
      const gallery = await res.json();
      saveData('gallery', gallery);
      galleryImages = gallery;
    } catch (e) {
      console.error('Failed to load gallery:', e);
    }
  }
  renderPosts();
  renderCourses();
  renderGallery();
}
if (window.location.pathname.endsWith('dashboard.html')) {
  initData();
}