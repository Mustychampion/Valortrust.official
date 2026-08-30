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

    // Check if this IP was already logged today
    const today = new Date().toISOString().split('T')[0];
    const visitorQuery = query(
      collection(db, 'visitor_logs'),
      where('ip_address', '==', info.ip_address),
    );
    const snapshot = await getDocs(visitorQuery);

    // Find an existing record from today
    const todayDoc = snapshot.docs.find(d => {
      const lastSeen = d.data().last_seen as string;
      return lastSeen && lastSeen.startsWith(today);
    });

    if (todayDoc) {
      // Update visit count
      const existingData = todayDoc.data();
      await updateDoc(doc(db, 'visitor_logs', todayDoc.id), {
        visit_count: ((existingData.visit_count as number) || 1) + 1,
        last_seen: new Date().toISOString(),
        is_returning: true,
      });
    } else {
      // Insert new visitor
      await addDoc(collection(db, 'visitor_logs'), {
        ...info,
        visit_count: 1,
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString(),
        is_returning: snapshot.size > 0, // returning if they have any previous records
        path_history: [window.location.pathname],
      });
    }
  } catch {
    // Analytics should never break the site — fail silently
  }
}
