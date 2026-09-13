import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

interface VisitorInfo {
  ip_address: string;
  country: string | null;
  city: string | null;
  isp: string | null;
  asn: string | null;
  device: string;
  device_type: string;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad/i.test(ua)) return 'Mobile';
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

async function getVisitorInfo(): Promise<VisitorInfo> {
  const device = getDeviceType();
  const fallback: VisitorInfo = {
    ip_address: 'unknown',
    country: null,
    city: null,
    isp: null,
    asn: null,
    device,
    device_type: device,
  };

  // 1. Try ipwho.is (CORS friendly, full HTTPS, rich ASN and ISP data)
  try {
    const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        return {
          ip_address: data.ip || 'unknown',
          country: data.country || null,
          city: data.city || null,
          isp: data.connection?.isp || data.connection?.org || null,
          asn: data.connection?.asn ? `AS${data.connection.asn}` : null,
          device,
          device_type: device,
        };
      }
    }
  } catch {}

  // 2. Try ipapi.co (CORS friendly, HTTPS)
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      if (!data.error) {
        return {
          ip_address: data.ip || 'unknown',
          country: data.country_name || null,
          city: data.city || null,
          isp: data.org || null,
          asn: data.asn || null,
          device,
          device_type: device,
        };
      }
    }
  } catch {}

  // 3. Try freeipapi.com (HTTPS fallback)
  try {
    const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(3500) });
    if (res.ok) {
      const data = await res.json();
      return {
        ip_address: data.ipAddress || 'unknown',
        country: data.countryName || null,
        city: data.cityName || null,
        isp: null,
        asn: null,
        device,
        device_type: device,
      };
    }
  } catch {}

  // 4. Try ipify.org for basic IP resolution
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      return {
        ...fallback,
        ip_address: data.ip || 'unknown',
      };
    }
  } catch {}

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

    // Insert rich visitor record directly into Firestore
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
