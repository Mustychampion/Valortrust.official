import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  link: string;
}

let allProjects: PortfolioItem[] = [];

export async function loadPortfolio(): Promise<void> {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  try {
    const portfolioQuery = query(
      collection(db, 'portfolio'),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(portfolioQuery);

    if (snapshot.empty) return;

    allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortfolioItem));
    renderPortfolio(allProjects);
    initFilters();
  } catch (err) {
    console.error('Portfolio load error:', err);
  }
}

function renderPortfolio(items: PortfolioItem[]): void {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `<div class="col-span-3 text-center py-12 text-gray-400">No projects found in this category.</div>`;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="portfolio-item relative overflow-hidden rounded-lg shadow-lg cursor-pointer group" 
         data-category="${item.category}"
         onclick="openPortfolioModal('${item.id}')">
      ${item.image_url
        ? `<img src="${item.image_url}" alt="${item.title}" class="w-full h-64 object-cover transition duration-500 group-hover:scale-110" loading="lazy">`
        : `<div class="w-full h-64 bg-blue-900 flex items-center justify-center"><i class="fas fa-briefcase text-white text-5xl"></i></div>`
      }
      <div class="portfolio-overlay absolute inset-0 bg-blue-900 bg-opacity-90 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
        <span class="text-yellow-500 text-xs font-bold uppercase tracking-wider mb-2">${item.category}</span>
        <h3 class="text-xl font-bold mb-2 text-center">${item.title}</h3>
        <p class="text-center text-sm mb-4 text-blue-100">${(item.description || '').substring(0, 80)}...</p>
        <span class="bg-yellow-500 text-blue-900 font-bold py-2 px-4 rounded-lg text-sm">View Details →</span>
      </div>
    </div>`).join('');
}

function initFilters(): void {
  const filters = document.querySelectorAll<HTMLElement>('.portfolio-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => {
        b.classList.remove('active-filter', 'bg-blue-900', 'text-white');
        b.classList.add('text-blue-900', 'bg-white');
      });
      btn.classList.add('active-filter', 'bg-blue-900', 'text-white');
      btn.classList.remove('text-blue-900', 'bg-white');

      const filter = btn.getAttribute('data-filter');
      const filtered = filter === 'all'
        ? allProjects
        : allProjects.filter(item => item.category.toLowerCase() === filter);
      renderPortfolio(filtered);
    });
  });
}

// Modal functions
(window as any).openPortfolioModal = (id: string) => {
  const item = allProjects.find(p => p.id === id);
  if (!item) return;

  const modal = document.getElementById('portfolio-modal')!;
  const modalImage = document.getElementById('modal-image') as HTMLImageElement;
  const modalNoImage = document.getElementById('modal-no-image')!;
  const modalLink = document.getElementById('modal-link') as HTMLAnchorElement;

  (document.getElementById('modal-title')!).textContent = item.title;
  (document.getElementById('modal-description')!).textContent = item.description || 'No description available.';
  (document.getElementById('modal-category')!).textContent = item.category;

  if (item.image_url) {
    modalImage.src = item.image_url;
    modalImage.alt = item.title;
    modalImage.classList.remove('hidden');
    modalNoImage.classList.add('hidden');
  } else {
    modalImage.classList.add('hidden');
    modalNoImage.classList.remove('hidden');
  }

  if (item.link) {
    modalLink.href = item.link;
    modalLink.classList.remove('hidden');
  } else {
    modalLink.classList.add('hidden');
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

(window as any).closePortfolioModal = () => {
  const modal = document.getElementById('portfolio-modal')!;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
};

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('portfolio-modal');
  if (e.target === modal) {
    (window as any).closePortfolioModal();
  }
});