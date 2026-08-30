import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface Sector {
  id: string;
  name: string;
  description: string;
  icon: string;
  image_url: string;
  order_index: number;
}

export async function loadSectors(): Promise<void> {
  const container = document.getElementById('sectors-container');
  if (!container) return;

  try {
    const q = query(collection(db, 'sectors'), orderBy('order_index', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return;
    
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sector));

    container.innerHTML = data.map(s => `
      <div class="sector-card">
        <div class="sector-icon"><i class="ti ${s.icon || 'ti-briefcase'}"></i></div>
        <h3>${s.name}</h3>
        <p>${s.description || ''}</p>
        <a href="#contact" class="sector-link">Get a Quote →</a>
      </div>`).join('');
  } catch (err) {
    console.error("Error loading sectors:", err);
  }
}