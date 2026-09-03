/**
 * Runtime SEO Helper & Canonical Manager
 * ValorTrust Integrated Services LTD
 */
import { SITE_URL } from './seoConfig';

export function initSeoRuntime(): void {
  try {
    // 1. Ensure canonical link exists and is clean (free of query params and hashes)
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }

    const currentPath = window.location.pathname;
    const cleanUrl = `${SITE_URL}${currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '')}`;
    if (canonical.href !== cleanUrl) {
      canonical.href = cleanUrl;
    }

    // 2. Inject Google Site Verification if present in Vite environment
    const googleVerify = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
    if (googleVerify && typeof googleVerify === 'string' && googleVerify.trim().length > 0) {
      let metaVerify = document.querySelector('meta[name="google-site-verification"]');
      if (!metaVerify) {
        metaVerify = document.createElement('meta');
        metaVerify.setAttribute('name', 'google-site-verification');
        document.head.appendChild(metaVerify);
      }
      metaVerify.setAttribute('content', googleVerify.trim());
    }

    // 3. Inject Bing Webmaster Verification if present in Vite environment
    const bingVerify = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BING_SITE_VERIFICATION;
    if (bingVerify && typeof bingVerify === 'string' && bingVerify.trim().length > 0) {
      let metaBing = document.querySelector('meta[name="msvalidate.01"]');
      if (!metaBing) {
        metaBing = document.createElement('meta');
        metaBing.setAttribute('name', 'msvalidate.01');
        document.head.appendChild(metaBing);
      }
      metaBing.setAttribute('content', bingVerify.trim());
    }
  } catch (err) {
    // Non-blocking catch
    console.debug('SEO runtime initialisation:', err);
  }
}
