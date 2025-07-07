// admin/js/admin.js
// Admin portal logic: login, dashboard tabs, CRUD for posts/courses/gallery, localStorage persistence, toasts

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

// --- LocalStorage Data Helpers ---
function getData(key, fallback) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}
function setData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Blog Posts CRUD ---
const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');
let editingPostId = null;

function renderPosts() {
  const posts = getData('posts', []);
  if (!postsList) return;
  postsList.innerHTML = posts.map(post => `
    <div class="bg-white rounded shadow p-4 flex flex-col">
      <img src="${post.thumbnail}" alt="Thumbnail for ${post.title}" class="h-24 w-full object-cover rounded mb-2"/>
      <h3 class="font-bold">${post.title}</h3>
      <div class="flex space-x-2 mt-2">
        <button class="edit-post bg-indigo-600 text-white px-2 py-1 rounded" data-id="${post.id}">Edit</button>
        <button class="delete-post bg-red-600 text-white px-2 py-1 rounded" data-id="${post.id}">Delete</button>
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
  document.getElementById('post-thumbnail').value = post.thumbnail;
  document.getElementById('post-body').value = post.body.replace(/<[^>]+>/g, '');
  editingPostId = id;
}
function deletePost(id) {
  let posts = getData('posts', []);
  posts = posts.filter(p => p.id != id);
  setData('posts', posts);
  showToast('Post deleted');
  renderPosts();
  syncToPublic('posts', posts);
}
if (postForm) {
  postForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('post-id').value;
    const title = document.getElementById('post-title').value.trim();
    const thumbnail = document.getElementById('post-thumbnail').value.trim();
    const body = document.getElementById('post-body').value.trim();
    if (!title || !thumbnail || !body) {
      showToast('All fields are required', 'error');
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
    setData('posts', posts);
    renderPosts();
    postForm.reset();
    editingPostId = null;
    syncToPublic('posts', posts);
  });
  document.getElementById('cancel-post').addEventListener('click', () => {
    postForm.reset();
    editingPostId = null;
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
  coursesList.innerHTML = courses.map(course => `
    <div class="bg-white rounded shadow p-4 flex flex-col">
      <h3 class="font-bold">${course.name}</h3>
      <span class="text-sm text-gray-500">${course.duration} | $${course.cost}</span>
      <span class="text-xs text-gray-400">${course.category}</span>
      <div class="flex space-x-2 mt-2">
        <button class="edit-course bg-indigo-600 text-white px-2 py-1 rounded" data-id="${course.id}">Edit</button>
        <button class="delete-course bg-red-600 text-white px-2 py-1 rounded" data-id="${course.id}">Delete</button>
      </div>
    </div>
  `).join('');
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
  document.getElementById('course-cost').value = course.cost;
  document.getElementById('course-category').value = course.category;
  editingCourseId = id;
}
function deleteCourse(id) {
  let courses = getData('courses', []);
  courses = courses.filter(c => c.id != id);
  setData('courses', courses);
  showToast('Course deleted');
  renderCourses();
  syncToPublic('courses', courses);
}
if (courseForm) {
  courseForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('course-id').value;
    const name = document.getElementById('course-name').value.trim();
    const description = document.getElementById('course-description').value.trim();
    const duration = document.getElementById('course-duration').value.trim();
    const cost = document.getElementById('course-cost').value.trim();
    const category = document.getElementById('course-category').value.trim();
    if (!name || !description || !duration || !cost || !category) {
      showToast('All fields are required', 'error');
      return;
    }
    let courses = getData('courses', []);
    if (id) {
      // Edit
      courses = courses.map(c => c.id == id ? { ...c, name, description, duration, cost, category } : c);
      showToast('Course updated');
    } else {
      // Add
      const newCourse = {
        id: Date.now(),
        name,
        description,
        duration,
        cost,
        category
      };
      courses.unshift(newCourse);
      showToast('Course added');
    }
    setData('courses', courses);
    renderCourses();
    courseForm.reset();
    editingCourseId = null;
    syncToPublic('courses', courses);
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
    <div class="bg-white rounded shadow p-2 flex flex-col items-center">
      <img src="${img.src}" alt="${img.alt}" class="h-24 w-full object-cover rounded mb-2"/>
      <span class="text-xs text-gray-500">${img.alt}</span>
      <button class="delete-gallery bg-red-600 text-white px-2 py-1 rounded mt-2" data-idx="${idx}">Delete</button>
    </div>
  `).join('');
  galleryList.querySelectorAll('.delete-gallery').forEach(btn => {
    btn.addEventListener('click', () => deleteGalleryImage(btn.dataset.idx));
  });
}
function deleteGalleryImage(idx) {
  galleryImages.splice(idx, 1);
  setData('gallery', galleryImages);
  showToast('Image deleted');
  renderGallery();
  syncToPublic('gallery', galleryImages);
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
      setData('gallery', galleryImages);
      showToast('Image added');
      renderGallery();
      galleryForm.reset();
      galleryPreview.innerHTML = '';
      syncToPublic('gallery', galleryImages);
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

// --- Sync to Public JSON (simulate backend) ---
function syncToPublic(type, data) {
  // In a real backend, this would POST to an API or update a file.
  // For demo, we update the public JSON in localStorage and optionally offer a download.
  // Optionally, you could trigger a download of the updated JSON file here.
}

// --- On Dashboard Load, initialize data from public JSON if not present ---
async function initData() {
  if (!getData('posts', null)) {
    const res = await fetch('../../data/posts.json');
    const posts = await res.json();
    setData('posts', posts);
  }
  if (!getData('courses', null)) {
    const res = await fetch('../../data/courses.json');
    const courses = await res.json();
    setData('courses', courses);
  }
  if (!getData('gallery', null)) {
    const res = await fetch('../../data/gallery.json');
    const gallery = await res.json();
    setData('gallery', gallery);
    galleryImages = gallery;
  }
  renderPosts();
  renderCourses();
  renderGallery();
}
if (window.location.pathname.endsWith('dashboard.html')) {
  initData();
}