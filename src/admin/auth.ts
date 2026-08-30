import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';

export async function initAuth() {
  // Listen for auth state changes (replaces supabase.auth.getSession + onAuthStateChange)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      hideLoginModal();
      window.dispatchEvent(new Event('admin-auth-ready'));
    } else {
      showLoginModal();
    }
  });

  setupLoginForm();
}

function showLoginModal() {
  let modal = document.getElementById('auth-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.innerHTML = `
      <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-blue-900">Admin Login</h2>
          <p class="text-gray-500 text-sm mt-1">ValorTrust Integrated Services</p>
        </div>
        <form id="admin-login-form">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="login-email" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-900 focus:border-blue-900" required>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" id="login-password" class="w-full px-4 py-2 border rounded-lg focus:ring-blue-900 focus:border-blue-900" required>
          </div>
          <button type="submit" class="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">Log In</button>
          <div id="login-error" class="text-red-500 text-sm text-center mt-3 hidden"></div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
    setupLoginForm();
  }
  modal.classList.remove('hidden');
}

function hideLoginModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
}

function setupLoginForm() {
  const form = document.getElementById('admin-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    const errorDiv = document.getElementById('login-error');
    
    if (errorDiv) errorDiv.classList.add('hidden');

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (errorDiv) {
        errorDiv.textContent = error.message || 'Login failed';
        errorDiv.classList.remove('hidden');
      }
    }
  });
}

export async function logout() {
  await firebaseSignOut(auth);
}
