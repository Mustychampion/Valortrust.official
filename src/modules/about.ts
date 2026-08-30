import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

interface AboutContent {
  id: string;
  heading: string;
  subheading: string;
  body_text: string;
  stat_1_value: string;
  stat_1_label: string;
  stat_2_value: string;
  stat_2_label: string;
  stat_3_value: string;
  stat_3_label: string;
  image_url: string;
}

export async function loadAbout(): Promise<void> {
  try {
    const q = query(collection(db, 'about_content'), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const doc = snapshot.docs[0];
    const about = { id: doc.id, ...doc.data() } as AboutContent;

    const set = (id: string, val: string) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set('about-heading', about.heading || '');
    set('about-subheading', about.subheading || '');
    set('about-body', about.body_text || '');
    set('stat-1-value', about.stat_1_value || '');
    set('stat-1-label', about.stat_1_label || '');
    set('stat-2-value', about.stat_2_value || '');
    set('stat-2-label', about.stat_2_label || '');
    set('stat-3-value', about.stat_3_value || '');
    set('stat-3-label', about.stat_3_label || '');

    if (about.image_url) {
      const img = document.getElementById('about-image') as HTMLImageElement;
      if (img) img.src = about.image_url;
    }
  } catch(err) {
    console.error("Error loading about content:", err);
  }
}