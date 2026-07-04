(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================
  // Confetti
  // ==========================================
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const colors = ['#D4A574', '#B45309', '#FDE68A', '#F59E0B', '#FECACA', '#EF4444', '#BFDBFE', '#3B82F6', '#D9F99D', '#84CC16', '#DDD6FE', '#8B5CF6'];

  function createParticle(x, y, burst = false) {
    const particle = {
      x: x || Math.random() * canvas.width,
      y: y || -20,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: burst ? (Math.random() - 0.5) * 16 : (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      decay: Math.random() * 0.005 + 0.003,
    };

    if (burst) {
      particle.gravity = 0.25;
      particle.speedY = (Math.random() - 0.8) * 12 - 4;
    } else {
      particle.gravity = 0.08;
    }

    return particle;
  }

  function updateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      p.speedY += p.gravity;
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    if (particles.length === 0) {
      cancelAnimationFrame(animationId);
      animationId = null;
      return;
    }

    animationId = requestAnimationFrame(updateParticles);
  }

  function addParticles(count, burst = false, x, y) {
    if (prefersReducedMotion) return;

    for (let i = 0; i < count; i++) {
      particles.push(createParticle(x, y, burst));
    }

    if (!animationId) {
      updateParticles();
    }
  }

  // Initial gentle confetti rain
  function startConfettiRain() {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      addParticles(3);
    }, 400);

    // Stop rain after 12 seconds to avoid being too distracting
    setTimeout(() => clearInterval(interval), 12000);
  }

  function burstConfetti(originX, originY) {
    addParticles(120, true, originX, originY);
  }

  // ==========================================
  // GSAP animations
  // ==========================================
  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    heroTl
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8 })
      .from('.hero-digit', { y: 80, opacity: 0, scale: 0.8, duration: 1, stagger: 0.15 }, '-=0.4')
      .from('.hero-title', { y: 40, opacity: 0, duration: 0.9 }, '-=0.6')
      .from('.hero-message', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
      .from('.scroll-hint', { opacity: 0, duration: 0.6 }, '-=0.2');

    // Intro card
    gsap.from('.intro-card', {
      scrollTrigger: {
        trigger: '.intro-card',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    // Gallery
    gsap.from('.gallery-title, .gallery-subtitle', {
      scrollTrigger: {
        trigger: '.gallery-title',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });

    gsap.from('.gallery-item', {
      scrollTrigger: {
        trigger: '.gallery-item',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 80,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
    });

    // Wishes
    gsap.from('.wishes-title', {
      scrollTrigger: {
        trigger: '.wishes-title',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });

    gsap.from('.wish-card', {
      scrollTrigger: {
        trigger: '.wish-card',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'back.out(1.2)',
    });

    // Footer
    gsap.from('.footer-title, .footer-text, #celebrate-again', {
      scrollTrigger: {
        trigger: 'footer',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }

  function initReducedMotion() {
    // Skip heavy animations but keep layout visible
    document.querySelectorAll('.hero-subtitle, .hero-digit, .hero-title, .hero-message, .hero-cta, .scroll-hint').forEach((el) => {
      el.style.opacity = '1';
    });
  }

  // ==========================================
  // Interactions
  // ==========================================
  function initButtons() {
    const wishBtn = document.getElementById('wish-btn');
    const wishMessage = document.getElementById('wish-message');

    wishBtn.addEventListener('click', () => {
      const rect = wishBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      burstConfetti(centerX, centerY);

      wishMessage.classList.remove('hidden');
      gsap.to(wishMessage, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.5)',
      });

      wishBtn.disabled = true;
      wishBtn.classList.add('opacity-75', 'cursor-default');
      const wishBtnText = wishBtn.querySelector('.wish-btn-text');
      if (wishBtnText) wishBtnText.textContent = 'Wish sent!';
    });

    const celebrateAgain = document.getElementById('celebrate-again');
    celebrateAgain.addEventListener('click', () => {
      burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
      gsap.fromTo('footer', { scale: 1 }, { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 });
    });
  }

  // ==========================================
  // Boot
  // ==========================================
  function boot() {
    if (prefersReducedMotion) {
      initReducedMotion();
    } else {
      startConfettiRain();

      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initAnimations();
      }
    }

    initButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
