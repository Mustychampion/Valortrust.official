export function initAnimations(): void {
  initScrollAnimations();
  initNavbarScroll();
  initCountUp();
  initPreloader();
  initScrollToTop();
}

function initScrollAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>(
    'section, .service-card, .portfolio-card, .blog-card, .testimonial-card, .about-content, .contact-field, .animate-on-scroll'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;

      const el = entry.target as HTMLElement;
      const delay = Math.min(index * 80, 400);
      el.style.animationDelay = `${delay}ms`;
      el.classList.add('animate-in');
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  elements.forEach((el) => {
    el.classList.add('animate-ready');
    observer.observe(el);
  });
}

function initNavbarScroll(): void {
  const nav = document.querySelector<HTMLElement>('nav, .navbar, header');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  });
}

function initCountUp(): void {
  const counters = document.querySelectorAll<HTMLElement>('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const target = parseInt(el.getAttribute('data-count') || '0', 10);
        let current = 0;
        const increment = Math.ceil(target / 40);
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = String(current);
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => observer.observe(el));
}

function initPreloader(): void {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => preloader.remove(), 500);
    }, 800);
  });
}

function initScrollToTop(): void {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}