/* ═══════════════════════════════════════════════════════════
   SARAIVA CO. — Interactions & Spline 3D
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
// SPLINE 3D INTEGRATION — Lazy-loaded for smooth hero
// ══════════════════════════════════════════════════════════

import { Application } from 'https://esm.sh/@splinetool/runtime';

const canvas3d = document.getElementById('canvas3d');
const loader = document.getElementById('splineLoader');

if (canvas3d) {
  // Start canvas hidden with GPU-ready layer
  canvas3d.style.opacity = '0';
  canvas3d.style.transition = 'opacity 1.2s ease';
  canvas3d.style.willChange = 'transform, opacity';

  // Defer Spline init so the hero text renders first (no freeze)
  const initSpline = () => {
    const spline = new Application(canvas3d);

    spline
      .load('https://prod.spline.design/yjH4EpGcf9CRO5kj/scene.splinecode')
      .then(() => {
        console.log('✅ Spline scene loaded successfully!');

        // Fade out the loader
        if (loader) loader.classList.add('loaded');

        // Fade in the canvas smoothly
        requestAnimationFrame(() => {
          canvas3d.style.opacity = '1';
        });

        // Clean up will-change after transition to free GPU memory
        setTimeout(() => {
          canvas3d.style.willChange = 'auto';
        }, 2000);

        // ── Start burst animation after fade-in ──
        setTimeout(() => initBurstAnimation(canvas3d), 1200);
      })
      .catch((err) => {
        console.warn('⚠️ Spline scene failed to load:', err);
        if (loader) loader.classList.add('loaded');
      });
  };

  // Use requestIdleCallback to wait until browser is idle (after hero paint)
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initSpline, { timeout: 1500 });
  } else {
    setTimeout(initSpline, 300);
  }

  // ── Hero button click detection ──
  // Since hero content has pointer-events: none (so Spline reacts everywhere),
  // we detect clicks on the hero and check if they hit a button
  const heroEl = document.getElementById('hero');
  const heroButtons = document.querySelectorAll('.hero-actions .btn');

  if (heroEl && heroButtons.length) {
    // Handle clicks — check if click position overlaps any button
    heroEl.addEventListener('click', (e) => {
      for (const btn of heroButtons) {
        const rect = btn.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          btn.click();
          break;
        }
      }
    });

    // Handle cursor — show pointer when hovering over button areas
    heroEl.addEventListener('mousemove', (e) => {
      let overButton = false;
      for (const btn of heroButtons) {
        const rect = btn.getBoundingClientRect();
        if (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        ) {
          overButton = true;
          break;
        }
      }
      heroEl.style.cursor = overButton ? 'pointer' : '';
    }, { passive: true });
  }
}

// ══════════════════════════════════════════════════════════
// Startup Burst Animation
// ══════════════════════════════════════════════════════════
// This optimized version plays the intro animation on load
// and then completely stops, saving ~40s of Main-Thread CPU.

function initBurstAnimation(canvas) {
  playIdleSweep(canvas);
}

function playIdleSweep(canvas) {
  const FRAME_INTERVAL = 40; // ~25fps is enough for the intro sweep
  let startTime = null;
  let lastFrameTime = 0;

  // ── Burst intro config ──
  const BURST_DURATION = 5;    // 5 seconds of gentle spin
  const BURST_FADE = 3;        // 3 seconds to transition to calm
  const TOTAL_DURATION = BURST_DURATION + BURST_FADE;

  function animate(now) {
    if (!startTime) startTime = now;
    const rawT = (now - startTime) / 1000;

    // Stop animation entirely after the burst to save CPU/Thread Main
    if (rawT > TOTAL_DURATION) {
      return;
    }

    if (now - lastFrameTime < FRAME_INTERVAL) {
      requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = now;

    // ── Burst blend factor ──
    let burst = 0;
    if (rawT < BURST_DURATION) {
      burst = 1;
    } else {
      const fadeProgress = (rawT - BURST_DURATION) / BURST_FADE;
      burst = 1 - fadeProgress * fadeProgress;
    }

    const rect = canvas.getBoundingClientRect();

    // ── Calm idle movement (organic pulse) ──
    const idleX = 0.5
      + Math.sin(rawT * 0.31) * 0.2
      + Math.sin(rawT * 0.197 + 1.7) * 0.12
      + Math.sin(rawT * 0.127 + 3.1) * 0.07;

    const idleY = 0.45
      + Math.sin(rawT * 0.23 + 0.5) * 0.18
      + Math.sin(rawT * 0.151 + 2.3) * 0.1
      + Math.sin(rawT * 0.089 + 4.7) * 0.05;

    // ── Burst spin movement (circular orbit) ──
    const spinSpeed = 0.5 - (rawT / BURST_DURATION) * 0.15; // slow dreamy spin
    const spinAngle = rawT * spinSpeed * Math.PI * 2;
    const spinRadius = 0.3 * (1 - rawT / TOTAL_DURATION); // shrinking orbit
    const spinX = 0.5 + Math.cos(spinAngle) * spinRadius;
    const spinY = 0.45 + Math.sin(spinAngle) * spinRadius * 0.7; // slightly oval

    // ── Blend: spin during burst → organic pulse after ──
    const finalX = burst * spinX + (1 - burst) * idleX;
    const finalY = burst * spinY + (1 - burst) * idleY;

    const x = rect.left + rect.width * finalX;
    const y = rect.top + rect.height * finalY;

    const cx = Math.max(rect.left + 20, Math.min(rect.right - 20, x));
    const cy = Math.max(rect.top + 20, Math.min(rect.bottom - 20, y));

    canvas.dispatchEvent(new PointerEvent('pointermove', {
      clientX: cx,
      clientY: cy,
      bubbles: true,
      pointerType: 'mouse',
    }));

    canvas.dispatchEvent(new MouseEvent('mousemove', {
      clientX: cx,
      clientY: cy,
      bubbles: true,
    }));

    requestAnimationFrame(animate);
  }

  // Activate the scene
  const rect = canvas.getBoundingClientRect();
  canvas.dispatchEvent(new MouseEvent('mouseenter', {
    clientX: rect.left + rect.width * 0.5,
    clientY: rect.top + rect.height * 0.5,
    bubbles: true,
  }));

  requestAnimationFrame(animate);
}
