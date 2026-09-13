/**
 * Premium Visitor Popup / Toast Notification System
 * Displays rich animated popups when visitors interact with forms or site features.
 */

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

let toastContainer: HTMLElement | null = null;

function getOrCreateContainer(): HTMLElement {
  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }

  toastContainer = document.createElement('div');
  toastContainer.id = 'vt-toast-container';
  toastContainer.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 999999;
    display: flex;
    flex-direction: column;
    gap: 12px;
    pointer-events: none;
    max-width: 420px;
    width: calc(100% - 32px);
  `;
  document.body.appendChild(toastContainer);
  return toastContainer;
}

export function showPopupNotification(options: ToastOptions): void {
  const {
    title = 'Success!',
    message,
    type = 'success',
    duration = 4500,
  } = options;

  const container = getOrCreateContainer();

  const toast = document.createElement('div');
  toast.className = 'vt-toast-popup';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');

  const isSuccess = type === 'success';
  const isError = type === 'error';

  const iconSvg = isSuccess
    ? '<i class="fas fa-check-circle text-emerald-400 text-2xl"></i>'
    : isError
    ? '<i class="fas fa-exclamation-circle text-red-400 text-2xl"></i>'
    : '<i class="fas fa-info-circle text-blue-400 text-2xl"></i>';

  const borderColor = isSuccess ? '#10b981' : isError ? '#ef4444' : '#3b82f6';
  const barColor = isSuccess ? '#34d399' : isError ? '#f87171' : '#60a5fa';

  toast.style.cssText = `
    background: #0f172a;
    color: #ffffff;
    border-left: 5px solid ${borderColor};
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: flex-start;
    gap: 14px;
    pointer-events: auto;
    position: relative;
    overflow: hidden;
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: inherit;
  `;

  toast.innerHTML = `
    <div style="flex-shrink: 0; margin-top: 2px;">
      ${iconSvg}
    </div>
    <div style="flex: 1; min-width: 0;">
      <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 700; color: #ffffff; letter-spacing: -0.01em;">
        ${title}
      </h4>
      <p style="margin: 0; font-size: 13.5px; color: #cbd5e1; line-height: 1.45;">
        ${message}
      </p>
    </div>
    <button type="button" aria-label="Close notification" style="
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 18px;
      cursor: pointer;
      padding: 0 0 4px 8px;
      line-height: 1;
      transition: color 0.2s;
    " onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#94a3b8'">
      &times;
    </button>
    <div style="
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: ${barColor};
      width: 100%;
      animation: vt-progress-shrink ${duration}ms linear forwards;
    "></div>
  `;

  // Inject keyframe animation if not already injected
  if (!document.getElementById('vt-toast-keyframes')) {
    const style = document.createElement('style');
    style.id = 'vt-toast-keyframes';
    style.textContent = `
      @keyframes vt-progress-shrink {
        from { width: 100%; }
        to { width: 0%; }
      }
    `;
    document.head.appendChild(style);
  }

  container.appendChild(toast);

  // Trigger enter transition
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0) scale(1)';
    toast.style.opacity = '1';
  });

  const closeToast = () => {
    toast.style.transform = 'translateY(-10px) scale(0.95)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  };

  const closeBtn = toast.querySelector('button');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeToast);
  }

  setTimeout(closeToast, duration);
}
