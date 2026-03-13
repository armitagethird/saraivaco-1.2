/* ═══════════════════════════════════════════════════════════
   SARAIVA CO. — Interactions
   ═══════════════════════════════════════════════════════════ */

// ── Scroll Reveal (IntersectionObserver) ──────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ── Mobile hamburger menu ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ── Stat Counter Animation ────────────────────────────────
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((el) => counterObserver.observe(el));

function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ── Smooth Scroll for anchor links ────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ══════════════════════════════════════════════════════════
// SERVICES — Panel Switching (two-column layout)
// ══════════════════════════════════════════════════════════

const serviceBtns = document.querySelectorAll('.services-buttons .service-btn');
const servicePanels = document.querySelectorAll('.service-panel');
const isMobileQuery = window.matchMedia('(max-width: 768px)');

function activateService(serviceId) {
  // Update buttons
  serviceBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.service === serviceId);
  });
  // Update panels
  servicePanels.forEach(panel => {
    panel.classList.toggle('active', panel.dataset.panel === serviceId);
  });
}

serviceBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    activateService(btn.dataset.service);
  });

  // Desktop: also switch on hover for fluid feel
  if (!isMobileQuery.matches) {
    btn.addEventListener('mouseenter', () => {
      activateService(btn.dataset.service);
    });
  }
});

// ══════════════════════════════════════════════════════════
// INTERACTIVE ABOUT CARDS — only the clicked/hovered card opens
// ══════════════════════════════════════════════════════════

const aboutCards = document.querySelectorAll('.about-icard');

aboutCards.forEach(card => {
  // Click: close all others, then toggle this card
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');
    aboutCards.forEach(c => c.classList.remove('active'));
    if (!isActive) card.classList.add('active');
  });

  // Desktop hover: open ONLY this card, close all others
  if (!isMobileQuery.matches) {
    card.addEventListener('mouseenter', () => {
      aboutCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('active');
    });
  }
});

// ══════════════════════════════════════════════════════════
// SUBTLE BACKGROUND PARTICLES (canvas-based, lightweight)
// ══════════════════════════════════════════════════════════

(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  const PARTICLE_COUNT = 30;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 1, // radius 1 – 3.5
        baseAlpha: Math.random() * 0.27 + 0.08, // more visible: 0.08 – 0.35
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.003 + 0.001, // pulse speed
        drift: (Math.random() - 0.5) * 0.15 // gentle horizontal drift
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      // Pulse alpha between darker and lighter
      const alpha = p.baseAlpha + Math.sin(p.phase + time * p.speed) * p.baseAlpha * 0.7;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${Math.max(0, alpha)})`;
      ctx.fill();

      // Gentle drift
      p.x += p.drift;
      p.y -= 0.05; // very slow upward drift

      // Wrap around
      if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
      if (p.x < -5) p.x = w + 5;
      if (p.x > w + 5) p.x = -5;
    }

    requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

// ══════════════════════════════════════════════════════════
// 3D DOT-MATRIX ROTATING GLOBE (pure Canvas)
// ══════════════════════════════════════════════════════════

(function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Globe params
  const DOT_COUNT_LAT = 36;   // latitude lines
  const DOT_COUNT_LON = 60;   // longitude lines
  const ROTATION_SPEED = 0.003;
  const PERSPECTIVE = 600;
  const CONNECTION_DISTANCE = 35; // max px distance for drawing lines

  let width, height, radius, centerX, centerY;
  let rotation = 0;
  let dots = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    radius = Math.min(width, height) * 0.42;
    centerX = width / 2;
    centerY = height / 2;
  }

  // Generate dots on a sphere surface
  function generateDots() {
    dots = [];
    for (let lat = 0; lat < DOT_COUNT_LAT; lat++) {
      const phi = (Math.PI / DOT_COUNT_LAT) * lat; // 0 to PI (pole to pole)
      // More dots near equator, fewer at poles (natural sphere distribution)
      const dotsAtLat = Math.max(4, Math.round(DOT_COUNT_LON * Math.sin(phi)));
      for (let lon = 0; lon < dotsAtLat; lon++) {
        const theta = (2 * Math.PI / dotsAtLat) * lon; // 0 to 2PI
        dots.push({ phi, theta });
      }
    }
  }

  // Project a 3D point to 2D with perspective
  function project(phi, theta, rot) {
    // Spherical to cartesian
    const x = radius * Math.sin(phi) * Math.cos(theta + rot);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta + rot);

    // Perspective projection
    const scale = PERSPECTIVE / (PERSPECTIVE + z);
    const px = centerX + x * scale;
    const py = centerY + y * scale;

    return { px, py, z, scale };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    rotation += ROTATION_SPEED;

    // Project all dots
    const projected = [];
    for (const dot of dots) {
      const p = project(dot.phi, dot.theta, rotation);
      // Only show front-facing dots (z < some threshold for fade)
      if (p.z > -radius * 0.2) {
        // Normalize z for alpha: front = bright, back = dim
        const normalizedZ = (p.z + radius) / (2 * radius);
        const alpha = Math.pow(normalizedZ, 1.5) * 0.9 + 0.1;
        projected.push({ ...p, alpha });
      }
    }

    // Draw a subtle atmospheric glow behind the globe
    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.6, centerX, centerY, radius * 1.3);
    gradient.addColorStop(0, 'rgba(209, 79, 133, 0.06)');
    gradient.addColorStop(0.5, 'rgba(179, 143, 200, 0.03)');
    gradient.addColorStop(1, 'rgba(209, 79, 133, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Draw connection lines between nearby dots (subtle)
    ctx.lineWidth = 0.6;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const dx = projected[i].px - projected[j].px;
        const dy = projected[i].py - projected[j].py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DISTANCE) {
          const lineAlpha = (1 - dist / CONNECTION_DISTANCE) * Math.min(projected[i].alpha, projected[j].alpha) * 0.45;
          ctx.strokeStyle = `rgba(209, 79, 133, ${lineAlpha})`;
          ctx.beginPath();
          ctx.moveTo(projected[i].px, projected[i].py);
          ctx.lineTo(projected[j].px, projected[j].py);
          ctx.stroke();
        }
      }
    }

    // Draw dots with glow
    for (const p of projected) {
      const dotRadius = Math.max(1.2, 2.5 * p.scale);

      // Subtle glow around each dot
      ctx.beginPath();
      ctx.arc(p.px, p.py, dotRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(209, 79, 133, ${p.alpha * 0.15})`;
      ctx.fill();

      // The dot itself
      ctx.beginPath();
      ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 117, 166, ${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  resize();
  generateDots();
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
  });
})();
