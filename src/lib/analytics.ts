import { db } from './firebase';
import {
  collection, query, where, getDocs, addDoc, updateDoc, doc,
} from 'firebase/firestore';

interface VisitorInfo {
  ip_address: string;
  country: string | null;
  city: string | null;
  isp: string | null;
  asn: string | null;
  device_type: string;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

async function getVisitorInfo(): Promise<VisitorInfo> {
  // Default fallback in case all APIs fail
  const fallback: VisitorInfo = {
    ip_address: 'unknown',
    country: null,
    city: null,
    isp: null,
    asn: null,
    device_type: getDeviceType(),
  };

  // Try api.ipapi.is first (CORS-friendly, no redirect)
  try {
    const res = await fetch('https://api.ipapi.is/', { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return {
        ip_address: data.ip || 'unknown',
        country: data.location?.country || null,
        city: data.location?.city || null,
        isp: data.company?.name || data.asn?.org || null,
        asn: data.asn?.asn ? `AS${data.asn.asn}` : null,
        device_type: getDeviceType(),
      };
    }
  } catch {
    // silently fall through to next API
  }

  // Fallback: ip-api.com
  try {
    const res = await fetch('https://ip-api.com/json/?fields=status,country,city,isp,as,query', {
      signal: AbortSignal.timeout(1500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.status === 'success') {
        return {
          ip_address: data.query || 'unknown',
          country: data.country || null,
          city: data.city || null,
          isp: data.isp || null,
          asn: data.as || null,
          device_type: getDeviceType(),
        };
      }
    }
  } catch {
    // silently fail
  }

  return fallback;
}

export async function trackVisitor(): Promise<void> {
  try {
    const info = await getVisitorInfo();

    // Check returning status and visit count via localStorage to avoid unauthenticated read restrictions
    const isReturning = Boolean(localStorage.getItem('vt_has_visited'));
    const currentVisits = parseInt(localStorage.getItem('vt_visit_count') || '0', 10) + 1;
    
    localStorage.setItem('vt_has_visited', 'true');
    localStorage.setItem('vt_visit_count', currentVisits.toString());
    localStorage.setItem('vt_last_seen', new Date().toISOString());

    // Insert visitor record directly into Firestore
    await addDoc(collection(db, 'visitor_logs'), {
      ...info,
      visit_count: currentVisits,
      last_seen: new Date().toISOString(),
      created_at: new Date().toISOString(),
      is_returning: isReturning,
      path_history: [window.location.pathname],
    });
  } catch (err) {
    console.warn('Analytics tracking notice:', err);
  }
}
