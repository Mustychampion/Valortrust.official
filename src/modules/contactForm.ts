import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sendNotificationAlert } from '../lib/notifications';
import { showPopupNotification } from '../utils/toast';

export async function initContactForm(): Promise<void> {
  const form = document.querySelector('#contact form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]') as HTMLButtonElement;
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    btn.disabled = true;

    const data = {
      name: (document.getElementById('name') as HTMLInputElement).value.trim(),
      email: (document.getElementById('email') as HTMLInputElement).value.trim(),
      phone: (document.getElementById('phone') as HTMLInputElement).value.trim(),
      sector: (document.getElementById('service') as HTMLSelectElement).value,
      message: (document.getElementById('message') as HTMLTextAreaElement).value.trim(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'enquiries'), data);

      // Fire multi-channel notification (email + WhatsApp) — non-blocking
      void sendNotificationAlert({
        type: 'contact',
        name: data.name,
        email: data.email,
        phone: data.phone,
        sector: data.sector,
        message: data.message,
      });

      // Show visitor popup notification
      showPopupNotification({
        title: 'Message Sent Successfully!',
        message: 'Thank you for contacting ValorTrust. Our team has received your message and will get back to you promptly.',
        type: 'success',
      });

      // Show success state on submit button
      btn.innerText = '✓ Message Sent!';
      btn.style.background = '#16a34a';
      form.reset();

      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);

    } catch (err) {
      console.error('Contact form error:', err);
      showPopupNotification({
        title: 'Submission Failed',
        message: 'Unable to deliver your message at this time. Please check your connection or contact us directly via phone or WhatsApp.',
        type: 'error',
      });
      btn.innerText = 'Failed — Try Again';
      btn.style.background = '#dc2626';
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
}