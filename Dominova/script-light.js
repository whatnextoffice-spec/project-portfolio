'use strict';

/* ---- PRELOADER ---- */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(() => {
    pre.classList.add('hidden');
    setTimeout(() => pre.remove(), 600);
  }, 1600);
});

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- ACTIVE NAV LINK ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
  const y = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const inView = y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', inView);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* ---- HAMBURGER ---- */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

document.querySelectorAll('.mob-link, .mob-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
    hamburger?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---- SCROLL REVEAL ---- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right')
  .forEach(el => revealObs.observe(el));

/* ---- ANIMATED COUNTERS ---- */
const counterEls     = document.querySelectorAll('.stat-num[data-target]');
let   countersRan    = false;
const statsSection   = document.getElementById('stats');

function easeOut(t) { return 1 - Math.pow(1 - t, 4); }

function runCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(p) * target);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

if (statsSection) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !countersRan) {
      countersRan = true;
      counterEls.forEach(runCounter);
    }
  }, { threshold: 0.3 }).observe(statsSection);
}

/* ---- CONTACT FORM ---- */
const form        = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit');
const formSuccess = document.getElementById('form-success');

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const name    = document.getElementById('name')?.value.trim();
  const email   = document.getElementById('email')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  if (!name || !email || !message) {
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 600);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('email')?.classList.add('field-error');
    return;
  }

  const btnText = submitBtn?.querySelector('.btn-text');
  if (btnText) btnText.textContent = 'Sending...';
  if (submitBtn) submitBtn.disabled = true;

  await new Promise(r => setTimeout(r, 1500));

  if (btnText) btnText.textContent = 'Send Message';
  if (submitBtn) submitBtn.disabled = false;
  form.reset();

  if (formSuccess) {
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }
});

document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('field-error'));
});

/* ---- BACK TO TOP ---- */
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backBtn?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- CARD MICRO-TILT ---- */
document.querySelectorAll('.service-card, .port-card').forEach(card => {
  card.style.transformStyle = 'preserve-3d';
  card.style.perspective    = '800px';

  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / r.width  * 8;
    const y = (e.clientY - r.top  - r.height / 2) / r.height * -8;
    card.style.transform = `translateY(-8px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
    card.style.transition = 'transform 0.08s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform  = '';
    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
  });
});

/* ---- EXTRA INLINE STYLES ---- */
const style = document.createElement('style');
style.textContent = `
  .field-error {
    border-color: #EF4444 !important;
    box-shadow: 0 0 0 4px rgba(239,68,68,0.10) !important;
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    15%,45%,75% { transform: translateX(-6px); }
    30%,60%,90% { transform: translateX( 6px); }
  }
  .contact-form.shake { animation: shake 0.5s ease; }

  /* Logo subtle drift on hover */
  .logo-img, .footer-logo {
    will-change: filter, transform;
  }

  /* Gradient button shimmer */
  .btn-gradient::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transform: translateX(-100%);
    border-radius: inherit;
    transition: transform 0.5s ease;
  }
  .btn-gradient:hover::after { transform: translateX(100%); }
`;
document.head.appendChild(style);

/* ---- CONSOLE BRANDING ---- */
console.log(
  '%c✨ DOMINOVA LIGHT%c— Soft SaaS Edition',
  'color: #7C3AED; font-size: 16px; font-weight: 900; background: #EDE9FE; padding: 6px 10px; border-radius: 6px;',
  'color: #6B7280; font-size: 13px; padding: 6px;'
);
