import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import type { PortfolioItem } from '../types/firestore.types';

export async function loadPortfolioManager(container: HTMLElement) {
  container.innerHTML = `
    <div class="admin-card">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-gray-800">Portfolio Projects</h3>
        <button class="btn-primary"><i class="fas fa-plus mr-2"></i>Add New Project</button>
      </div>
      <p class="text-gray-600 mb-4">Manage your portfolio items here.</p>
      
      <table class="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="portfolio-table-body">
          <tr><td colspan="3" class="text-center">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  try {
    const portfolioQuery = query(
      collection(db, 'portfolio'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(portfolioQuery);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
    
    const tbody = document.getElementById('portfolio-table-body');
    if (tbody) {
      if (data && data.length > 0) {
        tbody.innerHTML = data.map(item => `
          <tr>
            <td class="font-medium">${item.title}</td>
            <td>${item.category}</td>
            <td>
              <button class="text-blue-600 mr-2 hover:underline">Edit</button>
              <button class="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-gray-500">No portfolio items found.</td></tr>';
      }
    }
  } catch (err) {
    console.error(err);
  }
}
