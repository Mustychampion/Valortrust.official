import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface Testimonial {
  id: string;
  client_name: string;
  role: string;
  review_text: string;
  photo_url: string;
}

export async function loadTestimonials(): Promise<void> {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  try {
    const testimonialsQuery = query(
      collection(db, 'testimonials'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(testimonialsQuery);

    if (snapshot.empty) return; // Keep hardcoded if no data

    const testimonials = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial));

    container.innerHTML = testimonials.map(t => `
      <div class="testimonial-card bg-white text-gray-800 rounded-xl shadow-lg p-8 transition duration-500 hover:bg-blue-800 hover:text-white">
        <div class="text-yellow-500 text-xl mb-4">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <p class="mb-6 italic">"${t.review_text}"</p>
        <div class="flex items-center">
          ${t.photo_url
            ? `<img src="${t.photo_url}" alt="${t.client_name}" class="w-12 h-12 rounded-full mr-4 object-cover">`
            : `<div class="w-12 h-12 rounded-full mr-4 bg-blue-900 flex items-center justify-center text-white font-bold text-lg">${t.client_name?.charAt(0) || 'V'}</div>`
          }
          <div>
            <h4 class="font-bold">${t.client_name}</h4>
            <p class="text-sm">${t.role || ''}</p>
          </div>
        </div>
      </div>`).join('');
  } catch (err) {
    console.error('Testimonials load error:', err);
  }
}