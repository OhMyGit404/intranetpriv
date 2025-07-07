// assets/js/blog.js
// Handles blog list, pagination, and single post rendering

import { fetchJSON } from './utils.js';

const blogList = document.getElementById('blog-list');
const pagination = document.getElementById('pagination');
const postContent = document.getElementById('post-content');

const POSTS_PER_PAGE = 2;

async function renderBlogList(page = 1) {
  const posts = await fetchJSON('../../data/posts.json');
  if (!blogList) return;
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const paginated = posts.slice(start, end);

  blogList.innerHTML = paginated.map(post => `
    <div class="bg-white rounded-lg shadow p-6 flex flex-col">
      <img src="${post.thumbnail}" alt="Thumbnail for ${post.title}" class="h-40 w-full object-cover rounded mb-4" loading="lazy"/>
      <h2 class="text-xl font-bold mb-2"><a href="post.html?slug=${post.slug}" class="hover:text-indigo-600">${post.title}</a></h2>
      <p class="mb-2 text-gray-700">${post.excerpt}</p>
      <a href="post.html?slug=${post.slug}" class="mt-auto text-indigo-600 hover:underline">Read More</a>
    </div>
  `).join('');

  // Pagination
  if (pagination) {
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    pagination.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = `px-3 py-1 rounded ${i === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'}`;
      btn.addEventListener('click', () => renderBlogList(i));
      pagination.appendChild(btn);
    }
  }
}

async function renderSinglePost() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  if (!slug || !postContent) return;
  const posts = await fetchJSON('../../data/posts.json');
  const post = posts.find(p => p.slug === slug);
  if (!post) {
    postContent.innerHTML = '<p class="text-red-600">Post not found.</p>';
    return;
  }
  postContent.innerHTML = `
    <img src="${post.thumbnail}" alt="Thumbnail for ${post.title}" class="h-56 w-full object-cover rounded mb-6" loading="lazy"/>
    <h1 class="text-3xl font-bold mb-4">${post.title}</h1>
    <div class="prose max-w-none mb-4">${post.body}</div>
    <p class="text-gray-500 text-sm">Published: ${post.date}</p>
  `;
}

if (blogList) renderBlogList();
if (postContent) renderSinglePost();

// Social share (post.html)
const socialShare = document.getElementById('social-share');
if (socialShare) {
  socialShare.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = window.location.href;
      let shareUrl = '';
      if (btn.ariaLabel.includes('Facebook')) {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
      } else if (btn.ariaLabel.includes('Twitter')) {
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
      } else if (btn.ariaLabel.includes('LinkedIn')) {
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;
      }
      window.open(shareUrl, '_blank');
    });
  });
}