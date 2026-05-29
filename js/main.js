/* ═══════════════════════════════════════════════════════════════
   IRONFORGE FITNESS CLUB — Main JavaScript
   Animations · Interactions · UI Logic
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── Library availability flags ─────────────────────────────── */
const HAS_GSAP   = typeof gsap   !== 'undefined';
const HAS_AOS    = typeof AOS    !== 'undefined';
const HAS_SWIPER = typeof Swiper !== 'undefined';

/* ── GSAP Registration ──────────────────────────────────────── */
if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ═══════════════════════════════════════════════════════════════
   1. LOADING SCREEN
═══════════════════════════════════════════════════════════════ */
(function initLoader() {
  const screen = document.getElementById('loading-screen');
  const bar    = document.getElementById('loaderBar');
  const pct    = document.getElementById('loaderPct');

  document.body.classList.add('loading');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(hideLoader, 400);
    }
    bar.style.width = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';
  }, 120);

  function hideLoader() {
    screen.classList.add('hidden');
    document.body.classList.remove('loading');
    initHeroAnimations();
    initParticles();
  }
})();

/* ═══════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR
═══════════════════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  /* Smooth ring follow */
  (function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animRing);
  })();

  /* Expand on interactive elements */
  document.querySelectorAll('a, button, [data-tilt], .gallery-item, .program-card, .trainer-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('expanded');
      ring.classList.add('expanded');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('expanded');
      ring.classList.remove('expanded');
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   3. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / total) * 100) + '%';
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════════
   4. NAVBAR — Glassmorphism + Active Link
═══════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('mobileDrawer');
  const navLinks   = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections   = document.querySelectorAll('section[id]');

  /* Scroll glass effect */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.classList.toggle('modal-open');
  });

  /* Close drawer on mobile link click */
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.classList.remove('modal-open');
    });
  });

  /* Active nav link on scroll */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();

/* ═══════════════════════════════════════════════════════════════
   5. HERO CANVAS — Particles + Light Rays
═══════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], rays = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Particle class */
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.size  = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5 - 0.2;
      this.life  = 1;
      this.decay = Math.random() * 0.003 + 0.001;
      this.hue   = Math.random() > 0.5 ? 0 : 20; // red or orange
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      if (this.life <= 0 || this.x < 0 || this.x > W || this.y < 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life * 0.7;
      ctx.fillStyle = `hsl(${this.hue}, 90%, 60%)`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsl(${this.hue}, 90%, 60%)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  /* Light ray class */
  class Ray {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = -50;
      this.angle = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      this.len   = Math.random() * 300 + 150;
      this.width = Math.random() * 2 + 0.5;
      this.speed = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.15 + 0.05;
    }
    update() {
      this.y += this.speed;
      if (this.y > H + 100) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      const grad = ctx.createLinearGradient(
        this.x, this.y,
        this.x + Math.cos(this.angle) * this.len,
        this.y + Math.sin(this.angle) * this.len
      );
      grad.addColorStop(0, 'rgba(230,57,70,0)');
      grad.addColorStop(0.5, 'rgba(230,57,70,0.8)');
      grad.addColorStop(1, 'rgba(244,162,97,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth   = this.width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x + Math.cos(this.angle) * this.len,
        this.y + Math.sin(this.angle) * this.len
      );
      ctx.stroke();
      ctx.restore();
    }
  }

  /* Init */
  for (let i = 0; i < 120; i++) particles.push(new Particle());
  for (let i = 0; i < 12; i++)  rays.push(new Ray());

  /* Mouse parallax */
  let mx = W / 2, my = H / 2;
  canvas.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  /* Animated background grid */
  function drawGrid() {
    const spacing = 60;
    ctx.strokeStyle = 'rgba(230,57,70,0.04)';
    ctx.lineWidth   = 0.5;
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += spacing) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  /* Radial glow that follows mouse */
  function drawMouseGlow() {
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
    grad.addColorStop(0, 'rgba(230,57,70,0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    drawMouseGlow();
    rays.forEach(r => { r.update(); r.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════════════════════════════
   6. HERO ANIMATIONS (GSAP)
═══════════════════════════════════════════════════════════════ */
function initHeroAnimations() {
  if (!HAS_GSAP) {
    /* Without GSAP just make everything visible */
    ['heroLine1','heroLine2','heroLine3','heroLine4','heroSub','heroCta','heroStats'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
    });
    return;
  }
  const tl = gsap.timeline({ delay: 0.2 });

  tl.from('.hero-badge', { y: -30, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' })
    .from('#heroLine1', { y: 80, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .from('#heroLine2', { y: 80, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('#heroLine3', { y: 80, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('#heroLine4', { y: 80, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('#heroSub',   { y: 30,  opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
    .from('#heroCta .btn', {
      y: 30, opacity: 0, duration: 0.6,
      stagger: 0.15, ease: 'power2.out'
    }, '-=0.3')
    .from('#heroStats .hero-stat, #heroStats .hero-stat-divider', {
      y: 20, opacity: 0, duration: 0.5,
      stagger: 0.08, ease: 'power2.out'
    }, '-=0.3')
    .from('.scroll-indicator', { opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
    .from('.hero-silhouette', { x: 80, opacity: 0, duration: 1, ease: 'power2.out' }, '-=1');
}

/* ═══════════════════════════════════════════════════════════════
   7. SCROLL-TRIGGERED ANIMATIONS (GSAP)
═══════════════════════════════════════════════════════════════ */
(function initScrollAnimations() {
  if (!HAS_GSAP) return;

  /* Helper: build a safe scroll-reveal tween.
     - immediateRender:false stops GSAP hiding elements before the trigger fires.
     - invalidateOnRefresh:true recalculates positions after images load.
     - start:'top 95%' is very generous — triggers well before element center. */
  function reveal(targets, vars) {
    const st = Object.assign({ start: 'top 95%', invalidateOnRefresh: true }, vars.scrollTrigger || {});
    return gsap.from(targets, Object.assign({ immediateRender: false }, vars, { scrollTrigger: st }));
  }

  /* Section titles */
  gsap.utils.toArray('.section-title').forEach(el => {
    reveal(el, { scrollTrigger: { trigger: el }, y: 50, opacity: 0, duration: 0.9, ease: 'power3.out' });
  });

  /* Trainer cards */
  gsap.utils.toArray('.trainer-card').forEach((card, i) => {
    reveal(card, { scrollTrigger: { trigger: card }, y: 60, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power2.out' });
  });

  /* Pricing cards */
  gsap.utils.toArray('.pricing-card').forEach((card, i) => {
    reveal(card, { scrollTrigger: { trigger: card }, y: 50, opacity: 0, scale: 0.96, duration: 0.6, delay: i * 0.08, ease: 'back.out(1.4)' });
  });

  /* Timeline items */
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    reveal(item, { scrollTrigger: { trigger: item }, x: i % 2 === 0 ? -50 : 50, opacity: 0, duration: 0.7, ease: 'power2.out' });
  });

  /* Blog cards */
  reveal('.blog-card', { scrollTrigger: { trigger: '.blog-grid', start: 'top 95%' }, y: 60, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' });

  /* About image reveal */
  reveal('.about-img-main', { scrollTrigger: { trigger: '.about-grid', start: 'top 95%' }, clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power3.inOut' });

  /* Parallax hero silhouette — uses gsap.to so no immediateRender concern */
  gsap.to('.hero-silhouette', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    y: 150, ease: 'none'
  });

  /* Sticky CTA fade-out near footer */
  ScrollTrigger.create({
    trigger: '.footer',
    start: 'top bottom',
    onEnter:    () => document.querySelector('.mobile-sticky-cta')?.classList.add('hidden'),
    onLeaveBack: () => document.querySelector('.mobile-sticky-cta')?.classList.remove('hidden')
  });
})();

/* ═══════════════════════════════════════════════════════════════
   8. AOS INIT
═══════════════════════════════════════════════════════════════ */
if (HAS_AOS) {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    disable: window.innerWidth < 480
  });
} else {
  /* Fallback: make AOS-decorated elements visible immediately */
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.removeAttribute('data-aos');
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

/* ═══════════════════════════════════════════════════════════════
   9. ANIMATED COUNTERS
═══════════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.getAttribute('data-target');
      const suffix = target >= 1000 ? '+' : (el.dataset.suffix || '');
      let start    = 0;
      const step   = target / 80;
      const timer  = setInterval(() => {
        start += step;
        if (start >= target) {
          start = target;
          clearInterval(timer);
        }
        const display = target >= 1000
          ? (Math.floor(start) / 1000).toFixed(1) + 'K'
          : Math.floor(start) + suffix;
        el.textContent = display;
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ═══════════════════════════════════════════════════════════════
   10. 3D TILT EFFECT — Program Cards
═══════════════════════════════════════════════════════════════ */
(function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) translateY(-12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   11. MEMBERSHIP PRICING TOGGLE
═══════════════════════════════════════════════════════════════ */
(function initPricingToggle() {
  const toggle    = document.getElementById('pricingToggle');
  const monthlyEl = document.getElementById('toggleMonthly');
  const annualEl  = document.getElementById('toggleAnnual');
  if (!toggle) return;

  toggle.addEventListener('change', () => {
    const isAnnual = toggle.checked;
    document.querySelectorAll('.monthly-price').forEach(el => el.classList.toggle('hidden', isAnnual));
    document.querySelectorAll('.annual-price').forEach(el  => el.classList.toggle('hidden', !isAnnual));
    monthlyEl.classList.toggle('active', !isAnnual);
    annualEl.classList.toggle('active',   isAnnual);
  });
})();

/* ═══════════════════════════════════════════════════════════════
   12. BMI CALCULATOR
═══════════════════════════════════════════════════════════════ */
(function initBMI() {
  const heightRange  = document.getElementById('heightRange');
  const weightRange  = document.getElementById('weightRange');
  const ageRange     = document.getElementById('ageRange');
  const heightVal    = document.getElementById('heightVal');
  const weightVal    = document.getElementById('weightVal');
  const ageVal       = document.getElementById('ageVal');
  const calcBtn      = document.getElementById('calcBmi');
  const bmiNumber    = document.getElementById('bmiNumber');
  const bmiCategory  = document.getElementById('bmiCategory');
  const bmiAdvice    = document.getElementById('bmiAdvice');
  const bmiNeedle    = document.getElementById('bmiNeedle');
  const genderBtns   = document.querySelectorAll('.gender-btn');
  if (!calcBtn) return;

  /* Sync range labels */
  heightRange.addEventListener('input', () => heightVal.textContent = heightRange.value + ' cm');
  weightRange.addEventListener('input', () => weightVal.textContent = weightRange.value + ' kg');
  ageRange.addEventListener('input',    () => ageVal.textContent    = ageRange.value    + ' yrs');

  /* Gender toggle */
  genderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genderBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  calcBtn.addEventListener('click', () => {
    const h   = parseFloat(heightRange.value) / 100;
    const w   = parseFloat(weightRange.value);
    const bmi = +(w / (h * h)).toFixed(1);

    /* Animate number */
    if (HAS_GSAP) {
      gsap.to({ val: 0 }, {
        val: bmi, duration: 1.2, ease: 'power2.out',
        onUpdate: function() { bmiNumber.textContent = this.targets()[0].val.toFixed(1); }
      });
    } else {
      bmiNumber.textContent = bmi.toFixed(1);
    }

    /* Needle rotation: BMI 15→40 maps to -90°→90° */
    const clampBmi = Math.min(Math.max(bmi, 15), 40);
    const deg      = ((clampBmi - 15) / 25) * 180 - 90;
    bmiNeedle.setAttribute('transform', `rotate(${deg}, 100, 100)`);

    /* Category */
    let cat, advice, color;
    if (bmi < 18.5) {
      cat = 'Underweight'; advice = 'Focus on muscle-building programs and caloric surplus.'; color = '#3498db';
    } else if (bmi < 24.9) {
      cat = 'Normal Weight'; advice = 'You\'re in the healthy range. Maintain with regular training!'; color = '#2ecc71';
    } else if (bmi < 29.9) {
      cat = 'Overweight'; advice = 'A fat-loss + strength program will get you to optimal range.'; color = '#f1c40f';
    } else {
      cat = 'Obese'; advice = 'Our coaches will design a safe, effective weight-loss program for you.'; color = '#e74c3c';
    }

    bmiCategory.textContent = cat;
    bmiCategory.style.color = color;
    bmiAdvice.textContent   = advice;
    bmiNumber.style.backgroundImage = `none`;
    bmiNumber.style.color = color;
    bmiNumber.style.webkitTextFillColor = color;
  });
})();

/* ═══════════════════════════════════════════════════════════════
   13. CALORIES CALCULATOR
═══════════════════════════════════════════════════════════════ */
(function initCalories() {
  const btn    = document.getElementById('calcCalories');
  const result = document.getElementById('calResult');
  const numEl  = document.getElementById('caloriesNum');
  const msgEl  = document.getElementById('calResultMsg');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const weight   = parseFloat(document.getElementById('calWeight').value)   || 70;
    const duration = parseFloat(document.getElementById('calDuration').value) || 45;
    const met      = parseFloat(document.getElementById('calActivity').value) || 8;
    const calories = Math.round((met * weight * duration) / 60);

    result.classList.remove('hidden');
    if (HAS_GSAP) gsap.from(result, { y: 20, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });

    if (HAS_GSAP) {
      gsap.to({ val: 0 }, {
        val: calories, duration: 1.2, ease: 'power2.out',
        onUpdate: function() { numEl.textContent = Math.round(this.targets()[0].val); }
      });
    } else {
      numEl.textContent = calories;
    }

    const messages = [
      'Incredible effort! Keep pushing! 🔥',
      'That\'s a serious burn! Well done! 💪',
      'You\'re on fire! IRONFORGE proud! ⚡',
      'Every calorie counts. Stay consistent! 🏆'
    ];
    msgEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  });
})();

/* ═══════════════════════════════════════════════════════════════
   14. SWIPER — TESTIMONIALS
═══════════════════════════════════════════════════════════════ */
(function initSwiper() {
  if (!HAS_SWIPER) return;
  new Swiper('.testimonials-swiper', {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: '.testimonial-pagination',
      clickable: true
    },
    navigation: {
      prevEl: '.testimonial-prev',
      nextEl: '.testimonial-next'
    },
    effect: 'slide',
    speed: 600
  });
})();

/* ═══════════════════════════════════════════════════════════════
   15. GALLERY LIGHTBOX
═══════════════════════════════════════════════════════════════ */
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightboxImg');
  const lbClose  = document.getElementById('lightboxClose');
  const lbPrev   = document.getElementById('lightboxPrev');
  const lbNext   = document.getElementById('lightboxNext');
  if (!lightbox) return;

  const images = Array.from(document.querySelectorAll('.gallery-item img'));
  let current  = 0;

  function openLightbox(idx) {
    current = idx;
    lbImg.src = images[idx].src;
    lightbox.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  function showPrev() {
    current = (current - 1 + images.length) % images.length;
    if (HAS_GSAP) gsap.from(lbImg, { x: -60, opacity: 0, duration: 0.3, ease: 'power2.out' });
    lbImg.src = images[current].src;
  }

  function showNext() {
    current = (current + 1) % images.length;
    if (HAS_GSAP) gsap.from(lbImg, { x: 60, opacity: 0, duration: 0.3, ease: 'power2.out' });
    lbImg.src = images[current].src;
  }

  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => openLightbox(idx));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  showPrev);
  lbNext.addEventListener('click',  showNext);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    showPrev();
    if (e.key === 'ArrowRight')   showNext();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   16. LOGIN / SIGNUP MODAL
═══════════════════════════════════════════════════════════════ */
(function initModal() {
  const modal    = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginBtn');
  const closeBtn = document.getElementById('modalClose');
  const tabs     = document.querySelectorAll('.modal-tab');
  const forms    = { login: document.getElementById('loginFormWrap'), signup: document.getElementById('signupFormWrap') };
  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  loginBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const key = tab.dataset.modalTab;
      Object.values(forms).forEach(f => f.classList.remove('active'));
      forms[key]?.classList.add('active');
    });
  });

  /* Password visibility toggles */
  document.querySelectorAll('.pass-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
      btn.querySelector('i').className = input.type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
  });

  /* Login form submit */
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Welcome back, Champion! 💪', 'success');
    closeModal();
  });

  /* Signup form submit */
  document.getElementById('signupForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Account created! Welcome to IRONFORGE! 🔥', 'success');
    closeModal();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   17. BOOK TRIAL FORM
═══════════════════════════════════════════════════════════════ */
(function initTrialForm() {
  const form     = document.getElementById('trialForm');
  const submitBtn = document.getElementById('trialSubmit');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btnText   = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const btnArrow  = submitBtn.querySelector('.btn-arrow');
    btnText.textContent  = 'Booking...';
    btnLoader.classList.remove('hidden');
    btnArrow.classList.add('hidden');
    submitBtn.disabled = true;

    setTimeout(() => {
      btnLoader.classList.add('hidden');
      btnArrow.classList.remove('hidden');
      btnText.textContent = 'Book Free Trial';
      submitBtn.disabled  = false;
      form.reset();
      showToast('🎉 Trial booked! Check your email for confirmation.', 'success');
      if (HAS_GSAP) gsap.from(form, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    }, 1800);
  });
})();

/* ═══════════════════════════════════════════════════════════════
   18. ENQUIRY TABS & FORM
═══════════════════════════════════════════════════════════════ */
(function initEnquiry() {
  const tabs  = document.querySelectorAll('.enq-tab');
  const forms = document.querySelectorAll('.enq-form');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      const target = document.querySelector(`.enq-form[data-form="${tab.dataset.tab}"]`);
      if (target) {
        target.classList.add('active');
        if (HAS_GSAP) gsap.from(target, { y: 10, opacity: 0, duration: 0.3, ease: 'power2.out' });
      }
    });
  });

  document.getElementById('enquiryForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Enquiry sent! Our team will contact you within 24 hours.', 'info');
    e.target.reset();
  });
})();

/* ═══════════════════════════════════════════════════════════════
   19. CONTACT FORM
═══════════════════════════════════════════════════════════════ */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Message sent! We\'ll reply within 24 hours. 📨', 'success');
  e.target.reset();
});

/* ═══════════════════════════════════════════════════════════════
   20. NEWSLETTER FORM
═══════════════════════════════════════════════════════════════ */
document.getElementById('newsletterForm')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('You\'re subscribed! Weekly gains incoming. 💪', 'success');
  e.target.reset();
});

/* ═══════════════════════════════════════════════════════════════
   21. SCROLL TO TOP
═══════════════════════════════════════════════════════════════ */
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => {
    if (HAS_GSAP) {
      gsap.to(window, { scrollTo: 0, duration: 0.8, ease: 'power3.inOut' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════
   22. DARK / LIGHT MODE TOGGLE
═══════════════════════════════════════════════════════════════ */
(function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;
  if (!btn) return;

  /* Persist preference */
  const saved = localStorage.getItem('ironforge-theme') || 'dark';
  html.setAttribute('data-theme', saved);
  icon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

  btn.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('ironforge-theme', next);

    if (HAS_GSAP) gsap.from('body', { opacity: 0.8, duration: 0.3, ease: 'power2.out' });
    showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'info');
  });
})();

/* ═══════════════════════════════════════════════════════════════
   23. MUSIC TOGGLE (Ambient gym vibe via Web Audio)
═══════════════════════════════════════════════════════════════ */
(function initMusic() {
  const btn  = document.getElementById('musicToggle');
  const icon = document.getElementById('musicIcon');
  if (!btn) return;

  let audioCtx = null;
  let nodes    = [];
  let playing  = false;

  function createAmbientSound(ctx) {
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 2);
    masterGain.connect(ctx.destination);

    /* Sub bass pulse */
    const bass = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(60, ctx.currentTime);
    bassGain.gain.value = 0.4;
    bass.connect(bassGain);
    bassGain.connect(masterGain);
    bass.start();

    /* Mid tone */
    const mid = ctx.createOscillator();
    const midGain = ctx.createGain();
    mid.type = 'triangle';
    mid.frequency.setValueAtTime(120, ctx.currentTime);
    midGain.gain.value = 0.15;
    mid.connect(midGain);
    midGain.connect(masterGain);
    mid.start();

    /* Noise layer for texture */
    const bufferSize  = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data        = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop   = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 200;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start();

    return [bass, mid, noise, masterGain];
  }

  btn.addEventListener('click', () => {
    if (!playing) {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      nodes   = createAmbientSound(audioCtx);
      playing = true;
      icon.className = 'fas fa-volume-up';
      btn.style.color = 'var(--red)';
      showToast('🎵 Gym vibe activated. Let\'s GO!', 'info');
    } else {
      const masterGain = nodes[nodes.length - 1];
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
        nodes   = [];
        playing = false;
        icon.className  = 'fas fa-music';
        btn.style.color = '';
      }, 800);
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════
   24. AI CHATBOT
═══════════════════════════════════════════════════════════════ */
(function initChatbot() {
  const fab      = document.getElementById('chatbotFab');
  const win      = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const input    = document.getElementById('chatInput');
  const sendBtn  = document.getElementById('chatSend');
  const messages = document.getElementById('chatbotMessages');
  const badge    = document.querySelector('.chatbot-badge');
  if (!fab) return;

  const responses = {
    programs: 'We offer 8 world-class programs: Weight Training, Fat Loss, Cardio, CrossFit, Powerlifting, Yoga, Personal Training, and MMA. Each is led by certified coaches. 💪',
    pricing:  'Our plans start at ₹999/month (Starter) up to ₹5,999/month (Personal Training). Annual plans save you 30%! Which plan interests you?',
    start:    'Starting is easy! 1) Book a free trial → 2) Meet your coach → 3) Begin your transformation. No commitment required. Want me to book your trial now?',
    trainer:  'All our trainers are certified professionals with 8–15 years of experience. Check out Marcus, Aria, Raj, and Priya in our Trainers section!',
    trial:    'Great news — your first session is completely FREE! Just fill out the booking form on this page. No credit card needed. 🎉',
    location: 'We have 6 premium locations across the city! Our flagship is at 42 Iron Street, Mumbai. Open 5AM–11PM Mon–Sat.',
    hours:    'We\'re open Mon–Sat 5:00 AM – 11:00 PM, Sunday 6:00 AM – 9:00 PM. Some locations are 24/7 for Elite+ members!',
    bmi:      'Use our BMI Calculator in the "BMI" section to check your stats and get personalised recommendations! 📊',
    default:  'Great question! Our team would love to help you personally. You can also WhatsApp us at +91 98765 43210 for instant replies. 🏋️'
  };

  function getResponse(msg) {
    const m = msg.toLowerCase();
    if (m.includes('program') || m.includes('class') || m.includes('yoga') || m.includes('crossfit')) return responses.programs;
    if (m.includes('price') || m.includes('cost') || m.includes('fee') || m.includes('plan') || m.includes('member')) return responses.pricing;
    if (m.includes('start') || m.includes('begin') || m.includes('how') || m.includes('join')) return responses.start;
    if (m.includes('trainer') || m.includes('coach') || m.includes('instructor')) return responses.trainer;
    if (m.includes('trial') || m.includes('free') || m.includes('test')) return responses.trial;
    if (m.includes('location') || m.includes('address') || m.includes('where') || m.includes('branch')) return responses.location;
    if (m.includes('hour') || m.includes('time') || m.includes('open') || m.includes('close')) return responses.hours;
    if (m.includes('bmi') || m.includes('weight') || m.includes('body')) return responses.bmi;
    return responses.default;
  }

  function addMessage(text, who) {
    const msg  = document.createElement('div');
    msg.classList.add('chat-msg', who);
    const bub  = document.createElement('div');
    bub.classList.add('chat-bubble');
    bub.textContent = text;
    msg.appendChild(bub);
    messages.appendChild(msg);
    if (HAS_GSAP) gsap.from(bub, { y: 10, opacity: 0, duration: 0.3, ease: 'power2.out' });
    messages.scrollTop = messages.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    setTimeout(() => addMessage(getResponse(text), 'bot'), 700);
  }

  fab.addEventListener('click', () => {
    win.classList.toggle('active');
    if (badge) badge.style.display = 'none';
  });

  closeBtn?.addEventListener('click', () => win.classList.remove('active'));

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });

  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addMessage(btn.dataset.msg, 'user');
      setTimeout(() => addMessage(getResponse(btn.dataset.msg), 'bot'), 700);
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   25. OFFER POPUP — Countdown Timer
═══════════════════════════════════════════════════════════════ */
(function initOfferPopup() {
  const popup    = document.getElementById('offerPopup');
  const closeBtn = document.getElementById('offerClose');
  const ctaBtn   = document.getElementById('offerCta');
  const hourEl   = document.getElementById('offerH');
  const minEl    = document.getElementById('offerM');
  const secEl    = document.getElementById('offerS');
  if (!popup) return;

  /* Show popup after 8 seconds (once per session) */
  if (!sessionStorage.getItem('offerShown')) {
    setTimeout(() => {
      popup.classList.add('active');
      sessionStorage.setItem('offerShown', '1');
    }, 8000);
  }

  closeBtn?.addEventListener('click', () => popup.classList.remove('active'));
  ctaBtn?.addEventListener('click',  () => popup.classList.remove('active'));

  /* Countdown: 2h 30m 00s */
  let total = 2 * 3600 + 30 * 60;
  setInterval(() => {
    if (total <= 0) return;
    total--;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (hourEl) hourEl.textContent = String(h).padStart(2, '0');
    if (minEl)  minEl.textContent  = String(m).padStart(2, '0');
    if (secEl)  secEl.textContent  = String(s).padStart(2, '0');
  }, 1000);
})();

/* ═══════════════════════════════════════════════════════════════
   26. SMOOTH SCROLL + GSAP ScrollTo Plugin FALLBACK
═══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ═══════════════════════════════════════════════════════════════
   27. TOAST NOTIFICATION SYSTEM
═══════════════════════════════════════════════════════════════ */
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };

  const toast = document.createElement('div');
  toast.classList.add('toast', type);
  toast.innerHTML = `
    <i class="fas ${icons[type]} toast-icon"></i>
    <span class="toast-text">${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════════
   28. FITNESS PULSE EFFECT — program section background
═══════════════════════════════════════════════════════════════ */
(function initPulse() {
  if (!HAS_GSAP) return;
  const section = document.querySelector('.programs-section');
  if (!section) return;

  gsap.to('.programs-section', {
    scrollTrigger: { trigger: '.programs-section', start: 'top center', toggleActions: 'play none none reverse' },
    '--pulse-opacity': 1,
    duration: 0.5
  });
})();

/* ═══════════════════════════════════════════════════════════════
   29. GLITCH EFFECT — Logo text on hover
═══════════════════════════════════════════════════════════════ */
(function initGlitch() {
  if (!HAS_GSAP) return;
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  logo.addEventListener('mouseenter', () => {
    gsap.to(logo, {
      skewX: 5, duration: 0.1, ease: 'power4.out',
      yoyo: true, repeat: 3, onComplete: () => gsap.set(logo, { skewX: 0 })
    });
  });
})();

/* ═══════════════════════════════════════════════════════════════
   30. SECTION GLOW OVERLAYS — Scroll triggered
═══════════════════════════════════════════════════════════════ */
(function initGlowOverlays() {
  /* Create ambient glow blobs per section */
  document.querySelectorAll('.section').forEach(section => {
    const blob = document.createElement('div');
    blob.classList.add('glow-overlay');
    blob.style.cssText = `
      width: 600px; height: 600px;
      top: ${Math.random() * 60}%; left: ${Math.random() * 60}%;
      opacity: 0; transition: opacity 0.8s;
    `;
    section.style.position = 'relative';
    section.appendChild(blob);

    const obs = new IntersectionObserver(([entry]) => {
      blob.style.opacity = entry.isIntersecting ? '1' : '0';
    }, { threshold: 0.2 });
    obs.observe(section);
  });
})();

/* ═══════════════════════════════════════════════════════════════
   31. STAT BARS — Trainer specialties animated bar
═══════════════════════════════════════════════════════════════ */
(function initStatBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.fitness-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width || '80%';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-card, .trainer-card').forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════════
   32. KEYBOARD NAV ACCESSIBILITY
═══════════════════════════════════════════════════════════════ */
document.addEventListener('keydown', e => {
  /* ESC closes open overlays */
  if (e.key === 'Escape') {
    document.getElementById('loginModal')?.classList.remove('active');
    document.getElementById('lightbox')?.classList.remove('active');
    document.getElementById('chatbotWindow')?.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
});

/* ═══════════════════════════════════════════════════════════════
   33. PERFORMANCE — Lazy init for below-fold content
═══════════════════════════════════════════════════════════════ */
(function lazyInitSections() {
  /* Stagger program card border glow on scroll */
  const programs = document.querySelectorAll('.program-card');
  const progObs  = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.borderColor = 'rgba(230,57,70,0.2)';
        }, i * 80);
        progObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  programs.forEach(p => progObs.observe(p));
})();

/* ═══════════════════════════════════════════════════════════════
   34. MOBILE STICKY CTA — show after hero
═══════════════════════════════════════════════════════════════ */
(function initMobileSticky() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const obs = new IntersectionObserver(([entry]) => {
    const cta = document.querySelector('.mobile-sticky-cta');
    if (!cta) return;
    cta.style.display = entry.isIntersecting ? 'none' : '';
  }, { threshold: 0.1 });
  obs.observe(hero);
})();

/* ═══════════════════════════════════════════════════════════════
   35. NEON FLICKER — Hero accent words
═══════════════════════════════════════════════════════════════ */
(function initNeonFlicker() {
  /* Random neon flicker on hero headline accent */
  const accentLine = document.getElementById('heroLine2');
  if (!accentLine) return;

  setInterval(() => {
    if (Math.random() > 0.85) {
      accentLine.style.textShadow = '0 0 20px rgba(230,57,70,0.9), 0 0 40px rgba(230,57,70,0.6)';
      setTimeout(() => {
        accentLine.style.textShadow = '';
      }, Math.random() * 80 + 40);
    }
  }, 2000);
})();

/* ═══════════════════════════════════════════════════════════════
   36. LOAD REFRESH + VISIBILITY SAFETY NET
═══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  /* Recalculate all ScrollTrigger positions after images/fonts settle */
  if (HAS_GSAP) ScrollTrigger.refresh();
  /* Re-check which AOS elements are in view */
  if (HAS_AOS)  AOS.refresh();

  /* Safety net: any [data-aos] element still invisible after 2.5s gets
     force-revealed. Covers edge cases where the IntersectionObserver
     never fires (e.g. element above fold, observer threshold missed). */
  setTimeout(() => {
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
      el.classList.add('aos-animate');
    });
    /* Also clear any GSAP-applied opacity:0 on visible elements */
    if (HAS_GSAP) {
      gsap.utils.toArray('.section-title, .trainer-card, .pricing-card, .timeline-item, .blog-card').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && parseFloat(getComputedStyle(el).opacity) < 0.1) {
          gsap.to(el, { opacity: 1, y: 0, x: 0, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: true });
        }
      });
    }
  }, 2500);
});

/* ═══════════════════════════════════════════════════════════════
   37. INIT CONFIRMATION LOG
═══════════════════════════════════════════════════════════════ */
console.log('%c⚡ IRONFORGE FITNESS — Let\'s Go! ⚡', [
  'color: #e63946',
  'background: #050505',
  'font-size: 18px',
  'font-weight: bold',
  'padding: 12px 24px',
  'border-radius: 8px',
  'border: 1px solid #e63946'
].join(';'));
