import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export function initNewsletter() {
  const section = document.querySelector('.py-16.bg-blue-900.text-white form');
  if (!section) return;

  const emailInput = section.querySelector<HTMLInputElement>('input[type="email"]');
  const submitBtn = section.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!emailInput || !submitBtn) return;

  const originalBtnText = submitBtn.innerHTML;

  section.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    try {
      // Check if already subscribed (replaces Supabase unique constraint)
      const existingQuery = query(
        collection(db, 'subscribers'),
        where('email', '==', email)
      );
      const snapshot = await getDocs(existingQuery);

      if (snapshot.empty) {
        await addDoc(collection(db, 'subscribers'), {
          email,
          created_at: new Date().toISOString(),
        });
      }

      submitBtn.innerHTML = '<i class="fas fa-check text-green-500 text-xl bounce-animation"></i>';
      emailInput.value = '';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 3000);

    } catch (err) {
      console.error('Newsletter error:', err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Error';
    }
  });
}
