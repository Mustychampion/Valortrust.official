import './styles/main.css';
import { initContactForm } from './modules/contactForm';
import { initNewsletter } from './modules/newsletter';
import { initNavigation } from './modules/navigation';
import { initAnimations } from './modules/animations';

document.addEventListener('DOMContentLoaded', () => {
  // Remove preloader immediately — don't wait for data fetches
  const preloader = document.getElementById('site-preloader') || document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden-preloader');
    setTimeout(() => preloader.remove(), 500);
  }

  if (window.location.pathname.startsWith('/admin')) {
    import('./admin/index');
    return;
  }

  // 1. Initialise critical UI modules (synchronous, lightweight)
  initNavigation();
  initContactForm();
  initNewsletter();
  initAnimations();

  // 2. Defer heavy Firestore data loads — fire-and-forget, non-blocking
  requestIdleCallback(() => {
    import('./modules/blog').then(m => m.loadBlog());
    import('./modules/portfolio').then(m => m.loadPortfolio());
    import('./modules/testimonials').then(m => m.loadTestimonials());
  }, { timeout: 2000 });

  // 3. Defer analytics — runs only when browser is idle
  requestIdleCallback(() => {
    import('./lib/analytics').then(m => m.trackVisitor());
  }, { timeout: 5000 });
});