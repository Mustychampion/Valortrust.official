import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import type { Testimonial } from '../types/firestore.types';

export async function loadTestimonialsManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-gray-800">Testimonials</h3>
        <button class="btn-primary"><i class="fas fa-plus mr-2"></i>Add Testimonial</button>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="test-table-body">
          <tr><td colspan="3" class="text-center">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const testimonialsQuery = query(
      collection(db, 'testimonials'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(testimonialsQuery);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));
    
    const tbody = document.getElementById('test-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(item => `
          <tr>
            <td class="font-medium">${item.client_name}</td>
            <td>${item.company}</td>
            <td>
              <button class="text-blue-600 mr-2 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500">No testimonials found.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}
