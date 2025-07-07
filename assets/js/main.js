// assets/js/main.js
// Common navigation, mobile menu, scroll-spy, smooth scroll, and footer year

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Close mobile menu on link click
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });
});

// Footer year
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Testimonial slider (index.html)
const testimonials = [
  {
    img: 'assets/img/testimonial1.jpg',
    name: 'Jane Doe',
    text: 'The hands-on approach and supportive staff made all the difference in my learning journey.',
  },
  {
    img: 'assets/img/testimonial2.jpg',
    name: 'John Smith',
    text: 'I landed my dream job thanks to the skills I gained at Intranet Training Institute!',
  },
  {
    img: 'assets/img/testimonial1.jpg',
    name: 'Maria Garcia',
    text: 'A truly innovative and student-focused environment. Highly recommended.',
  },
];
let testimonialIndex = 0;
const testimonialContent = document.getElementById('testimonial-content');
function renderTestimonial(idx) {
  if (!testimonialContent) return;
  const t = testimonials[idx];
  testimonialContent.innerHTML = `
    <div class="flex flex-col items-center">
      <img src="${t.img}" alt="Photo of ${t.name}" class="h-20 w-20 rounded-full object-cover mb-4" loading="lazy"/>
      <blockquote class="italic text-lg mb-2">"${t.text}"</blockquote>
      <span class="font-semibold">${t.name}</span>
    </div>
  `;
}
if (testimonialContent) {
  renderTestimonial(testimonialIndex);
  document.getElementById('prev-testimonial').addEventListener('click', () => {
    testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(testimonialIndex);
  });
  document.getElementById('next-testimonial').addEventListener('click', () => {
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    renderTestimonial(testimonialIndex);
  });
}

// Newsletter signup (index.html)
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if (email && /\S+@\S+\.\S+/.test(email)) {
      document.getElementById('newsletter-success').classList.remove('hidden');
      newsletterForm.reset();
    }
  });
}

// Staff carousel (about.html)
const staff = [
  {
    img: 'assets/img/staff1.jpg',
    name: 'Dr. Alice Johnson',
    title: 'Director',
    bio: 'Over 20 years of experience in education leadership.',
  },
  {
    img: 'assets/img/staff2.jpg',
    name: 'Mr. Brian Lee',
    title: 'Lead Instructor',
    bio: 'Expert in curriculum design and student engagement.',
  },
  {
    img: 'assets/img/staff3.jpg',
    name: 'Ms. Clara Evans',
    title: 'Student Advisor',
    bio: 'Passionate about student success and support.',
  },
];
let staffIndex = 0;
const staffContent = document.getElementById('staff-content');
function renderStaff(idx) {
  if (!staffContent) return;
  const s = staff[idx];
  staffContent.innerHTML = `
    <div class="flex flex-col items-center">
      <img src="${s.img}" alt="Photo of ${s.name}" class="h-24 w-24 rounded-full object-cover mb-4" loading="lazy"/>
      <span class="font-bold text-lg">${s.name}</span>
      <span class="text-indigo-600 mb-2">${s.title}</span>
      <p class="text-center">${s.bio}</p>
    </div>
  `;
}
if (staffContent) {
  renderStaff(staffIndex);
  document.getElementById('prev-staff').addEventListener('click', () => {
    staffIndex = (staffIndex - 1 + staff.length) % staff.length;
    renderStaff(staffIndex);
  });
  document.getElementById('next-staff').addEventListener('click', () => {
    staffIndex = (staffIndex + 1) % staff.length;
    renderStaff(staffIndex);
  });
}

// Contact form validation (contact.html)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    // Name validation
    if (!name.value.trim()) {
      document.getElementById('name-error').classList.remove('hidden');
      valid = false;
    } else {
      document.getElementById('name-error').classList.add('hidden');
    }
    // Email validation
    if (!/\S+@\S+\.\S+/.test(email.value)) {
      document.getElementById('email-error').classList.remove('hidden');
      valid = false;
    } else {
      document.getElementById('email-error').classList.add('hidden');
    }
    // Message validation
    if (!message.value.trim()) {
      document.getElementById('message-error').classList.remove('hidden');
      valid = false;
    } else {
      document.getElementById('message-error').classList.add('hidden');
    }
    if (valid) {
      document.getElementById('contact-success').classList.remove('hidden');
      contactForm.reset();
    }
  });
}