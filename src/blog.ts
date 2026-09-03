/**
 * Lightweight entry point for blog pages.
 * Only imports the CSS — no Firebase, no analytics, no heavy modules.
 */
import './styles/main.css';

import { initSeoRuntime } from './utils/seoRuntime';
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => initSeoRuntime());
}
