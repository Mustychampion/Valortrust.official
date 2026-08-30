import { db } from '../lib/firebase';
import {
  collection, query, where, orderBy, limit,
  getDocs, getCountFromServer,
} from 'firebase/firestore';
import type { Enquiry } from '../types/firestore.types';

export async function loadDashboard(container: HTMLElement) {
  try {
    // Run all count + recent queries in parallel
    const [
      blogSnap,
      portfolioSnap,
      testimonialSnap,
      unreadSnap,
      recentSnap,
    ] = await Promise.all([
      getCountFromServer(collection(db, 'blog_posts')),
      getCountFromServer(collection(db, 'portfolio')),
      getCountFromServer(collection(db, 'testimonials')),
      getCountFromServer(
        query(collection(db, 'enquiries'), where('status', '==', 'unread'))
      ),
      getDocs(
        query(collection(db, 'enquiries'), orderBy('created_at', 'desc'), limit(5))
      ),
    ]);

    const blogCount = blogSnap.data().count;
    const portfolioCount = portfolioSnap.data().count;
    const testimonialCount = testimonialSnap.data().count;
    const enquiriesCount = unreadSnap.data().count;
    const recentEnquiries = recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enquiry));

    // Update unread badge in sidebar
    const badge = document.getElementById('nav-unread-badge');
    if (badge) {
      if (enquiriesCount && enquiriesCount > 0) {
        badge.textContent = enquiriesCount.toString();
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="admin-card !mb-0 border-l-4 border-blue-900">
          <div class="text-gray-500 text-sm font-medium mb-1">Blog Posts</div>
          <div class="text-3xl font-bold text-gray-800">${blogCount || 0}</div>
        </div>
        <div class="admin-card !mb-0 border-l-4 border-yellow-500">
          <div class="text-gray-500 text-sm font-medium mb-1">Portfolio Items</div>
          <div class="text-3xl font-bold text-gray-800">${portfolioCount || 0}</div>
        </div>
        <div class="admin-card !mb-0 border-l-4 border-green-500">
          <div class="text-gray-500 text-sm font-medium mb-1">Testimonials</div>
          <div class="text-3xl font-bold text-gray-800">${testimonialCount || 0}</div>
        </div>
        <div class="admin-card !mb-0 border-l-4 border-red-500 relative">
          <div class="text-gray-500 text-sm font-medium mb-1">Unread Enquiries</div>
          <div class="text-3xl font-bold text-gray-800">${enquiriesCount || 0}</div>
          ${enquiriesCount && enquiriesCount > 0 ? '<span class="absolute top-4 right-4 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>' : ''}
        </div>
      </div>

      <div class="admin-card">
        <h3 class="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Recent Enquiries</h3>
        ${!recentEnquiries || recentEnquiries.length === 0 ? '<p class="text-gray-500 text-sm">No recent enquiries.</p>' : `
          <div class="overflow-x-auto">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Sector</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${recentEnquiries.map(enq => `
                  <tr class="${enq.status === 'unread' ? 'bg-blue-50' : ''}">
                    <td>${new Date(enq.created_at).toLocaleDateString()}</td>
                    <td class="font-medium">${enq.name}</td>
                    <td>${enq.sector || 'N/A'}</td>
                    <td>
                      <span class="px-2 py-1 rounded text-xs font-medium ${enq.status === 'unread' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}">
                        ${enq.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <a href="#enquiries" class="text-blue-600 hover:underline text-sm">View</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

  } catch (err) {
    container.innerHTML = '<div class="admin-card text-red-500">Error loading dashboard stats.</div>';
    console.error(err);
  }
}
