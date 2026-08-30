import '../styles/admin.css';
import { initAuth, logout } from './auth';
import { loadDashboard } from './dashboard';
import { loadBlogManager } from './blog';
import { loadPortfolioManager } from './portfolio';
import { loadTestimonialsManager } from './testimonials';
import { loadEnquiriesManager } from './enquiries';
import { loadSubscribersManager } from './subscribers';
import { loadAnalyticsManager } from './analytics';
import { loadSettingsManager } from './settings';

// Basic HTML structure for admin
const adminHTML = `
  <div class="admin-sidebar">
      <div class="p-6">
          <h2 class="text-xl font-bold text-yellow-500 tracking-wider">VIS ADMIN</h2>
          <p class="text-xs text-blue-200 mt-1">ValorTrust Integrated Services</p>
      </div>
      <nav class="mt-6">
          <a href="#dashboard" class="active" data-view="dashboard"><i class="fas fa-home w-6"></i> Dashboard</a>
          <a href="#enquiries" data-view="enquiries"><i class="fas fa-envelope w-6"></i> Enquiries <span id="nav-unread-badge" class="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-2 hidden">0</span></a>
          <a href="#blog" data-view="blog"><i class="fas fa-pen-nib w-6"></i> Blog Manager</a>
          <a href="#portfolio" data-view="portfolio"><i class="fas fa-briefcase w-6"></i> Portfolio</a>
          <a href="#testimonials" data-view="testimonials"><i class="fas fa-star w-6"></i> Testimonials</a>
          <a href="#subscribers" data-view="subscribers"><i class="fas fa-users w-6"></i> Subscribers</a>
          <a href="#analytics" data-view="analytics"><i class="fas fa-chart-bar w-6"></i> Analytics</a>
          <a href="#settings" data-view="settings"><i class="fas fa-cog w-6"></i> Settings</a>
      </nav>
      <div class="absolute bottom-0 w-full p-6">
          <button id="logout-btn" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition">Log Out</button>
      </div>
  </div>
  <div class="admin-content">
      <div class="admin-header">
          <h1 id="page-title" class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <div class="text-sm text-gray-500" id="current-date"></div>
      </div>
      <div id="admin-view-container">
          <!-- Views will be injected here -->
      </div>
  </div>
`;

function initAdmin() {
  document.body.innerHTML = adminHTML;
  document.title = 'Admin Dashboard | ValorTrust';

  const dateEl = document.getElementById('current-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
  });

  setupRouting();
}

function setupRouting() {
  const links = document.querySelectorAll('.admin-sidebar a');
  
  function handleRoute() {
    const hash = window.location.hash || '#dashboard';
    const viewName = hash.replace('#', '');
    
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = link.textContent?.trim() || 'Dashboard';
      }
    });

    const container = document.getElementById('admin-view-container');
    if (!container) return;

    container.innerHTML = '<div class="flex justify-center p-12"><i class="fas fa-spinner fa-spin text-4xl text-blue-900"></i></div>';

    switch (viewName) {
      case 'dashboard':
        loadDashboard(container);
        break;
      case 'blog': loadBlogManager(container); break;
      case 'portfolio': loadPortfolioManager(container); break;
      case 'testimonials': loadTestimonialsManager(container); break;
      case 'enquiries': loadEnquiriesManager(container); break;
      case 'subscribers': loadSubscribersManager(container); break;
      case 'analytics': loadAnalyticsManager(container); break;
      case 'settings': loadSettingsManager(container); break;
      default:
        container.innerHTML = '<div class="admin-card"><p>This module is currently being implemented.</p></div>';
    }
  }

  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

// Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
  // If we are on /admin.html or something similar
  // Wait for auth
  initAuth();
  
  window.addEventListener('admin-auth-ready', () => {
    initAdmin();
  });
});
