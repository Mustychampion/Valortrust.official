/**
 * Firestore document interfaces.
 *
 * These replace the Supabase-generated `database.types.ts`.
 * Field names are kept identical so UI code needs minimal changes.
 */

export interface Enquiry {
  id?: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  sector: string | null;
  message: string;
  status: 'unread' | 'read';
}

export interface Subscriber {
  id?: string;
  created_at: string;
  email: string;
}

export interface BlogPost {
  id?: string;
  created_at: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  slug: string;
  published_at: string | null;
  status: 'draft' | 'published';
}

export interface PortfolioItem {
  id?: string;
  created_at: string;
  title: string;
  category: string;
  description: string;
  image_url: string;
  link: string | null;
}

export interface Testimonial {
  id?: string;
  created_at: string;
  client_name: string;
  role: string;
  company: string;
  review_text: string;
  photo_url: string | null;
}

export interface VisitorLog {
  id?: string;
  created_at: string;
  ip_address: string;
  country: string | null;
  city: string | null;
  region: string | null;
  isp: string | null;
  asn: string | null;
  device_type: string | null;
  visit_count: number;
  last_seen: string;
  is_returning: boolean;
  path_history: string[];
}
